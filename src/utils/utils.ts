import { MD5 } from 'crypto-js';
import { appMode, storageKey } from '@/utils/conf';
import { localStore as _localStore, sessionStore as _sessionStore, uniqueId } from '@popjs/util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import locale from 'dayjs/locale/zh-cn'
import { ElMessage } from 'element-plus';
import { camelCase, isInteger, isString, upperFirst } from 'lodash-es';


/**
 * 实现localStorage缓存的 存, 取, 删操作
 * @param key 对象, 批量设置
 * @param val 有值:设置; 无值: 获取; null, 删除;
 */
export const localStore = (key: any, val?: any) => {
    return _localStore(hashKey(key), val);
};

/**
 * 实现sessionStorage缓存的 存, 取, 删操作
 * @param key 对象, 批量设置
 * @param val 有值:设置; 无值: 获取; null, 删除;
 */
export const sessionStore = (key: any, val?: any) => {
    return _sessionStore(hashKey(key), val);
};

/**
 * 返回设备ID, 如果本地存在则取本地
 */
export const deviceId = (): string => {
    if (localStore(storageKey.PY_DEVICE_ID)) {
        return localStore(storageKey.PY_DEVICE_ID);
    } else {
        let id = 'h-' + MD5(uniqueId('wulicode')) + '-5'
        localStore(storageKey.PY_DEVICE_ID, id);
        return id
    }
}


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
 * 设备的DPR
 */
export const dpr = () => {
    return window.devicePixelRatio;
}

/**
 * 是否是微信浏览器
 */
export const isWechat = () => {
    let userAgent = navigator.userAgent.toLowerCase();
    return !!userAgent.match(/micromessenger/);
};


/**
 * 判定是否为手机号码
 * @param str
 * @returns {boolean|Array|{index: number, input: string}}
 */
export const isMobile = function (str: string) {
    let phone_number = str.replace(/\(|\)|\s+|-/g, '');
    return phone_number.length > 10 && phone_number.match(/^(\d{1,5}\-)?1[3|4|5|6|8|7|9][0-9]\d{4,8}$/);
};
/**
 * 用于 Im 的时间展示
 * @param timestamp
 */
export const formatUnixFromNow = (timestamp: any) => {
    if (!timestamp) {
        return '####-##-##'
    }
    dayjs.extend(relativeTime);
    dayjs.locale(locale.name);
    return dayjs().to(dayjs(timestamp * 1000))
}


/**
 * 用于 Im 的时间展示
 * @param timestamp
 * @param format
 */
export const formatUnixTimestamp = (timestamp: any, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!timestamp) {
        return '####-##-##'
    }
    dayjs.locale(locale.name);
    return dayjs(timestamp * 1000).format(format);
}


/**
 * alias encode
 * @param data
 */
export const base64Encode = (data: string) => {
    return window.btoa(data);
}

/**
 * alias decode
 * @param data
 */
export const base64Decode = (data: string) => {
    return window.atob(data);
}

/**
 * 首字母大写的KEY
 * @param str
 */
export const upperCamelCase = (str: string) => {
    return upperFirst(camelCase(str))
}

/**
 * 封装 ele 的状态显示
 * @param {string|object} resp
 * @param {boolean|string|integer} warning
 */
export const toast = (resp: any, warning: any = true) => {
    let type = warning;
    if (isInteger(warning)) {
        type = Boolean(warning);
    }
    if (isString(resp)) {
        if (type === true) {
            ElMessage.success(resp);
        } else if (type === false) {
            ElMessage.warning(resp);
        } else {
            ElMessage.error(resp);
        }

    } else {
        const { message, status } = resp;
        if (status === 0) {                         // 成功
            ElMessage.success(message)
        } else if (status > 0 && status <= 1000) {  // http error
            ElMessage.error(message)
        } else {                                    // project error
            ElMessage.warning(message);
        }
    }
}
