import { MD5 } from "crypto-js";
import { each, forEach } from "lodash-es";
import { pyStorageDeviceIdKey } from './conf';


/**
 * 返回设备ID, 如果本地存在则取本地
 */
export const deviceId = (): string => {
    const val = localStore(pyStorageDeviceIdKey())
    if (val) {
        return val;
    } else {
        let id = 'p-' + MD5(uniqueId('popjs-core')) + '-c'
        localStore(pyStorageDeviceIdKey(), id);
        return id;
    }
}


/**
 * 获取唯一ID
 * @param prefix
 * @returns {string}
 */
export function uniqueId(prefix?: string) {
    let _pre = (typeof prefix == 'undefined') ? '' : prefix;
    return _pre + Math.floor(Math.random() * (new Date()).getTime());
}


/**
 * 设置获取Store 的内容
 * @param {string|array} key
 * @param val
 * @returns
 */
export const localStore = (key: any, val?: any) => {
    /**
     * localStorage内存溢出时，则清空后继续保存
     * @param {string} key 缓存key
     * @param {string} data JSON.stringify后的数据
     */
    let _localStorageOverflow = (key: any, data: any) => {
        try {
            localStorage.setItem(key, data);
        } catch (e: any) { // 当缓存溢出，则清空后继续保存
            if (e.code === 'QUOTA_EXCEEDED_ERR_CODE') {
                localStorage.removeItem(key);
                localStorage.setItem(key, data);
            } else {
                console.error(e);
            }
        }
    };

    // 本地数据存储封装，没有过期时间限制，仅限于该页面的协议
    if (val === null) {
        if (typeof key === 'object') {
            each(key, function (ele, idx) {
                _localStorageOverflow(idx, ele); // 存储数据
            });
            return;
        } else {
            localStorage.removeItem(key);// 移除数据
            return;
        }
    }
    if (typeof val === 'undefined') {
        let data = localStorage.getItem(key);
        if (data) {
            try {
                data = JSON.parse(data);
                return data; // 获取数据
            } catch (err) {
                return data; // 获取数据
            }
        }
        return data; // 获取数据
    }
    if (typeof val === 'object') {
        _localStorageOverflow(key, JSON.stringify(val));
    } else {
        _localStorageOverflow(key, val);
    }
}


/**
 * 实现sessionStorage缓存的 存, 取, 删操作
 * @param key 对象, 批量设置
 * @param val 有值:设置; 无值: 获取; null, 删除;
 */
export const sessionStore = (key: any, val?: any) => {  // 本地数据存储封装，随页面回话结束而结束，仅限于该页面的协议
    if (val === null) {
        if (typeof key === 'object') {
            forEach(key, function (ele, idx) {
                sessionStorage.setItem(idx, ele);
            });
            return;
        } else {
            sessionStorage.removeItem(key);
            return;
        }
    }
    if (typeof val === 'undefined') {
        let data = sessionStorage.getItem(key);
        if (data) {
            try {
                data = JSON.parse(data);
                return data; // 获取数据
            } catch (err) {
                return sessionStorage.getItem(key); // 获取数据
            }
        }
        return data; // 获取数据
    }
    if (typeof val === 'object') {
        sessionStorage.setItem(key, JSON.stringify(val));
    } else {
        sessionStorage.setItem(key, val);
    }
}

