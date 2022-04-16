import { httpBuildQuery, localStore, sessionStore } from "../../pkg/core/utils/helper";
import { ElMessage } from "element-plus/es";
import { appMode, appUrl } from "@/utils/conf";
import { isInteger } from "../../pkg/core/utils/validate";
import { get, isObject } from "lodash-es";


/**
 * 实现localStorage缓存的 存, 取, 删操作
 * @param key 对象, 批量设置
 * @param val 有值:设置; 无值: 获取; null, 删除;
 */
export const appLocalStore = (key: any, val?: any) => {
    return localStore(hashKey(key), val);
};

/**
 * 实现sessionStorage缓存的 存, 取, 删操作
 * @param key 对象, 批量设置
 * @param val 有值:设置; 无值: 获取; null, 删除;
 */
export const appSessionStore = (key: any, val?: any) => {
    return sessionStore(hashKey(key), val);
};


/**
 * 通过域名 + 版本号摒弃缓存
 * 这个地方和清空缓存有关系, 注意使用, 这里必须要有 `:`
 * @returns {*}
 */
export const hashKey = (key: string) => {
    let genKey = `${appMode}:${key}`;
    if (genKey.indexOf(':') < 0) {
        console.error('生成的KEY不包含 :, 会导致清理缓存异常');
    }
    return genKey;
};


/**
 * 封装 ele 的状态显示
 * @param {string} resp
 * @param {boolean|string|integer} success
 */
export const toast = (resp: any, success: any = false) => {
    let type = success;
    if (isInteger(success)) {
        type = Boolean(success);
    }

    // 不使用第二个参数
    if (isObject(resp)) {
        let status = get(resp, 'status');
        let message = get(resp, 'message');
        if (status === 0) {
            ElMessage.success(message);
            return;
        }
        if (status > 200 && status < 1000) {
            ElMessage.error(message);
            return;
        }
        ElMessage.warning(message);
        return;
    }

    // string
    if (type === true) {
        ElMessage.success(resp);
    } else if (type === false) {
        ElMessage.warning(resp);
    } else {
        ElMessage.error(resp);
    }
}


/**
 * 返回完整的Url 地址
 * @param {string} path   请求Url
 * @param {object} query 查询条件
 */
export const baseUrl = (path: string, query: any = {}) => {
    let baseUrl = appUrl;
    if (!baseUrl) {
        baseUrl = `${window.location.protocol}//${window.location.host}`
    }
    let newPath = path;
    if (path.indexOf('/') !== 0) {
        newPath = '/' + path;
    }
    return `${baseUrl}/${httpBuildQuery(newPath, query)}`
}
