import { get, isEmpty, isObject } from 'lodash-es';
import UAParser from "ua-parser-js";
import axios, { AxiosInstance } from "axios";
import { emitter, REQUEST_LOADED } from "../bus/mitt";
import { deviceId } from "./helper";

/**
 * 拦截器 : https://axios-http.com/zh/docs/interceptors
 */
let url = '';
if (!url) {
    url = `${window.location.protocol}//${window.location.host}`
}
let controller: any;
const instance: AxiosInstance = axios.create({
    baseURL: url,
    timeout: 10000 // 请求超时 10s
});
// 添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        let ua = new UAParser();
        controller = new AbortController();
        if (config.headers) {
            config.headers['x-id'] = deviceId();
            config.headers['x-sys-name'] = String(ua.getOS().name);
            config.headers['x-sys-version'] = String(ua.getOS().version);
            config.headers['x-sys-device'] = `${get(ua.getDevice(), 'type', '')}/${get(ua.getDevice(), 'vendor', '')}/${get(ua.getDevice(), 'model', '')}`;
            config.headers['x-sys-cpu'] = get(ua.getCPU(), 'architecture', '');
        }
        config.signal = controller.signal;
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        // 对响应数据进行请求处理, 打印 Log
        const { config, data } = response;
        let url = config.url;
        emitter.emit(REQUEST_LOADED, { url });

        // 正确的响应, 但是没有任何数据返回
        if (isEmpty(data)) {
            return Promise.reject({ status: 204, message: '服务正确响应, 但未发送任何数据' });
        }

        // 按照结构正确返回数据
        const { data: resp = {}, status, message } = data;
        console.info(url, status, message, resp, data);
        return response;
    },
    (error) => {
        if (get(error, 'message') === 'canceled') {
            console.warn('canceled', 400, '请求被取消');
            return Promise.reject({ status: 400, message: '请求被取消' });
        }
        const { config } = error;
        let url = config.url;
        emitter.emit(REQUEST_LOADED, { url });

        // 错误的响应
        let response = get(error, 'response');
        let request = get(error, 'request');
        if (isObject(error) && get(error, 'message') === 'canceled') {
            return Promise.reject(error);
        }

        console.warn(url, config.data, { type: 'response', response }, { 'type': 'request', request }, { type: 'error', error });
        let msg;
        if (response) {
            // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
            let { data, statusText, status } = response;
            msg = data.message || statusText;
            let exception = { message: data.message || statusText, status }
            // 500 | 404 | 403 | 401
            exception.message = '错误码 = ' + status + (msg ? ', Message:' + msg : '') + '，请联系管理人员或者是客服人员！'
            console.error(url, exception.status, exception.message);
            return Promise.reject(exception);
        } else if (request) {
            // 请求已经成功发起，但没有收到响应 = [请求超时]
            let code = 408;
            if (error.code === 'ECONNABORTED') {
                if (get(config, 'data') instanceof FormData) {
                    msg = '上传超时，请检查网络或压缩图片上传';
                } else {
                    msg = '请求超时，请检查网络再试';
                }
            }
            if (error.name === 'Error') {
                // [跨域]
                if (error.message === 'Network Error') {
                    msg = '网络连接异常！, 请检查网络或请求跨域';
                    code = 520
                }
            }
            let exception = {
                message: msg,
                status: code
            }
            console.error(url, code, msg);
            return Promise.reject(exception);
        } else {
            msg = error.message || '未知错误';
            let exception = {
                message: msg,
                status: 415
            }
            console.error(url, 415, msg);
            return Promise.reject(exception);
        }
    }
)

export const pyRequest = instance;
export const pyGet = instance.get;
export const pyAbort = () => {
    if (controller instanceof AbortController) {
        controller.abort();
    }
};
export const pyPost = instance.post;
export const pyPut = instance.put;
export const pyHead = instance.head;
export const pyDelete = instance.delete;
export const pyPatch = instance.patch;
export const pyOptions = instance.options;
