import { each, forEach, get, isNaN, isNil, isObject, keys, merge, set, trim } from 'lodash-es';
import { pyRequest } from "../../pkg/core/utils/request";
import { appUrl, appVersion, storageTokenKey } from "@/utils/conf";
import { MD5 } from "crypto-js";
import { appLocalStore } from "@/utils/util";
import { AxiosRequestConfig } from "axios";
import { emitter, REQUEST_401, REQUEST_EXCEPTION } from "../../pkg/core/bus/mitt";

let url = appUrl;
if (!url) {
    url = `${window.location.protocol}//${window.location.host}`
}
pyRequest.interceptors.request.use(
    (config: any) => {
        config.baseURL = url;
        config.data = appParams(config.data);

        // app - base
        config.headers['x-os'] = 'webapp';
        config.headers['x-ver'] = appVersion;

        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        return config;
    }
);

const appPost = (url: string, data?: any, config?: AxiosRequestConfig) => {
    let token = appLocalStore(storageTokenKey());
    let oriConfig = config;
    if (token) {
        oriConfig = {
            ...oriConfig,
            headers: merge(get(oriConfig, 'headers', {}), {
                'Authorization': `Bearer ${token}`
            })
        };
    }
    return pyRequest.post(url, data, oriConfig).then(res => {
        const { data = {}, status, message } = res.data;
        return Promise.resolve({
            success: Boolean(!status),
            message,
            status,
            data
        });
    }).catch(err => {
        const { status } = err;
        if (status === 401) {
            emitter.emit(REQUEST_401, err)
        } else {
            emitter.emit(REQUEST_EXCEPTION, err)
        }
        return Promise.reject(err);
    });
};


const appRequest = (config: AxiosRequestConfig) => {
    return pyRequest(config).then(res => {
        const { data = {}, status, message } = res.data;
        return Promise.resolve({
            success: Boolean(!status), message, status, data
        });
    });
};


export {
    appPost,
    appRequest
}
/**
 * 加密串生成
 * @param {object} params 请求接口时的参数
 * @param {string} token token字段
 * @returns {string}
 * @private
 */
const appSign = (params: any, token = '') => {
    let debug = false;
    let kvStr = '';
    let arrKeys = keys(params);
    arrKeys.sort();
    forEach(arrKeys, function (key) {
        if (key !== 'image' && key !== 'file') {
            if (isObject(params[key])) {
                kvStr += key + '=' + JSON.stringify(params[key]) + ','
            } else {
                kvStr += key + '=' + params[key] + ','
            }
        }
    });
    kvStr = kvStr.slice(0, -1);
    let v1Md5 = MD5(MD5(kvStr).toString() + token).toString();
    if (debug) {
        console.warn(kvStr, MD5(kvStr).toString(), v1Md5);
    }
    return v1Md5.charAt(1) + v1Md5.charAt(3) + v1Md5.charAt(15) + v1Md5.charAt(31)
};


let appParams = (data: any = null) => {
    let oriData = data || {};

    let params: any;
    if (oriData instanceof FormData) {
        params = new FormData();
        for (let pair of oriData.entries()) {
            if (isNil(pair[1])) {
                return;
            }
            if (isNaN(pair[1])) {
                return;
            }
            let sv = pair[1];
            if (typeof pair[1] === 'string') {
                sv = trim(pair[1]);
            }
            params.append(pair[0], sv);
        }
    } else {
        params = {};
        each(oriData, function (val, key) {
            if (isNil(val)) {
                return;
            }
            if (isNaN(val)) {
                return;
            }
            let sv = val;
            if (typeof val === 'string') {
                sv = trim(val);
            }
            set(params, key, sv);
        })
    }

    let token = appLocalStore(storageTokenKey());
    set(params, 'timestamp', Math.round(new Date().getTime() / 1000));
    const sign = appSign(params, token ? token : '');
    set(params, 'sign', sign);
    return params;
}
