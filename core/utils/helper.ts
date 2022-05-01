/*
|--------------------------------------------------------------------------
| 帮助函数
|--------------------------------------------------------------------------
|
*/

import { camelCase, each, forEach, get, indexOf, isObject, map, round, set, upperFirst } from "lodash-es";
import { pyStorageDeviceIdKey } from "./conf";
import { MD5 } from "crypto-js";

//region 尺寸MEDIA


const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

/**
 * 返回根据大小所匹配的 class name
 * @param size
 */
export const sizeClass = (size: string) => {
    return {
        xs: size === 'xs',
        sm: size === 'sm',
        md: size === 'md',
        lg: size === 'lg',
        xl: size === 'xl',
        xxl: size === 'xxl'
    }
}

/**
 * 百分比尺寸
 * @param size
 */
export const sizePercent = (size: string) => {
    switch (size) {
        case 'xs':
            return '100%';
        case 'sm':
            return '90%';
        case 'md':
            return '65%';
        case 'lg':
            return '43%';
        case 'xl':
            return '40%';
        case 'xxl':
            return '35%';
        default:
            return '30%';
    }
}


/**
 * 尺寸大于
 * @param a
 * @param b
 */
export const sizeGt = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia > ib;
}

/**
 * 尺寸小于
 * @param a
 * @param b
 */
export const sizeLt = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia < ib;
}

/**
 * 尺寸大于等于
 * @param a
 * @param b
 */
export const sizeGte = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia >= ib;
}
/**
 * 根据 size 计算宽度
 */
export const sizeWidth = (size: string, width: number) => {
    let ia = indexOf(sizes, size);
    const series = {
        0: 10 / 4,   // xs
        1: 8 / 4,   // sm
        2: 6 / 4,    // md
        3: 4 / 4,    // lg
        4: 3 / 4,    // xl
    }
    const calcWidth = round(get(series, ia, 1) * width);
    if (calcWidth <= 1) {
        return 1;
    } else if (1 < calcWidth && calcWidth <= 2) {
        return 2;
    } else if (2 < calcWidth && calcWidth <= 3) {
        return 3;
    } else if (3 < calcWidth && calcWidth <= 4) {
        return 4;
    } else if (4 < calcWidth && calcWidth <= 6) {
        return 6;
    } else if (6 < calcWidth && calcWidth <= 8) {
        return 8
    } else if (8 < calcWidth && calcWidth <= 12) {
        return 12
    } else {
        return 24
    }
}

/**
 * 尺寸小于等于
 * @param a
 * @param b
 */
export const sizeLte = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia <= ib;
}

//endregion

/*
|--------------------------------------------------------------------------
| 验证
|--------------------------------------------------------------------------
|
*/


//region Utils
export const urlExtension = (url: string) => {
    let ext = url.substring(url.lastIndexOf('.') + 1);
    if (ext.indexOf('?') > -1) {
        return strBefore(ext, '?')
    }
    return ext;
}


/**
 * 组合请求Url
 * @param url
 * @param params
 */
export const httpBuildQuery = (url: string, params: any) => {
    let urlComp = ''
    if (url.indexOf('?') === -1) {
        urlComp = `${url}?`;
    }
    let queryStr = (new URLSearchParams(params)).toString();
    return `${urlComp}${queryStr}`;
}

/**
 * 返回 Debug 的时间
 */
export const debugTime = () => {
    const d = new Date();
    return '🕊 🕊 🕊 [' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ' + d.getMilliseconds() + '] ';
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

//endregion


//region Browser
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

/**
 * 是否是微信浏览器
 */
export const isWechat = () => {
    let userAgent = navigator.userAgent.toLowerCase();
    return !!userAgent.match(/micromessenger/);
};


/**
 * 返回设备ID, 如果本地存在则取本地
 */
export const deviceId = (): string => {
    const val = localStore(pyStorageDeviceIdKey)
    if (val) {
        return val;
    } else {
        let id = 'p-' + MD5(uniqueId('popjs-core')) + '-c'
        localStore(pyStorageDeviceIdKey, id);
        return id;
    }
}


/**
 * return a promise that resolves with a File instance
 * https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f
 * @param url
 */
export const base64ToFile = (url: string) => {
    // data:image/png;base64,iVBO
    let extension = strAfter(strBefore(url, ';base64'), '/');
    if (!extension) {
        extension = 'png';
    }
    let filename = strRandom(8) + '.' + extension
    let mimeType = 'image/' + extension;

    return (fetch(url)
            .then(function (res) {
                return res.arrayBuffer();
            })
            .then(function (buf) {
                return new File([buf], filename, { type: mimeType });
            })
    );
}

/**
 * 获取系统操作平台
 */
export const sysOs = () => {
    let userAgent = window.navigator.userAgent,
        platform = get(window.navigator, 'platform'),
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (/Linux/.test(platform)) {
        os = 'Linux';
    }
    return os;
}
//endregion


//region Str
/**
 * alias encode
 * @param data
 */
export const base64Encode = (data: any) => {
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
 * 解码查询
 * @param data
 */
export const queryEncode: any = (data: object) => {
    let encode = {};
    map(data, function (val, key) {
        let valEncode;
        if (isObject(val)) {
            valEncode = '--wb--' + base64Encode(JSON.stringify(val));
        } else {
            valEncode = val;
        }
        set(encode, key, valEncode)
    });
    return encode;
}

/**
 * 恢复到查询对象
 * @param data
 */
export const queryDecode: any = (data: object) => {
    let decode = {};
    map(data, function (val, key) {
        let valDecode: any = val;
        if (String(val).indexOf('--wb--') === 0) {
            valDecode = JSON.parse(base64Decode(String(val).substring(6)));
        }
        set(decode, key, valDecode)
    });
    return decode
}


/**
 * 格式化
 * @param args
 */
export const sprintf = (...args: string[] | any[]) => {
    let replace = Array.prototype.slice.call(args, 1);
    let format = args[0];
    return format.replace(/{(\d+)}/g, function (match: string, number: number) {
        return typeof replace[number] != 'undefined'
            ? replace[number]
            : match
            ;
    });
}


/**
 * 首字母大写的KEY
 * @param str
 */
export const upperCamelCase = (str: string) => {
    return upperFirst(camelCase(str))
}


/**
 * 去掉标签
 * @param str
 */
export const stripTags = (str: string) => {
    return str.replace(/(<([^>]+)>)/gi, "");
}

/**
 * 生成随机字符
 * @param {number|string} length 长度
 * @param {boolean} use_upper 使用大写字母
 * @returns {string}
 */

export const strRandom = (length: Number = 16, use_upper: boolean = false) => {
    let chars = 'abcdefhjmnpqrstuvwxyz123456789';
    if (use_upper) {
        chars += 'ABCDEFGHJKLMNPQRSTUVWYXZ';
    }
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

/**
 * 字串之前
 * @param str
 * @param needle
 */
export const strBefore = (str: string, needle: string) => {
    return str.substring(0, str.indexOf(needle));
}


/**
 * 字串之后
 * @param str
 * @param needle
 */
export const strAfter = (str: string, needle: string) => {
    return str.substring(str.indexOf(needle) + needle.length);
}
//endregion


//region Datetime
/**
 * php 格式化转换为 dayjs 格式
 * @param str
 */
export const phpToDayjsFormat = (str: string) => {
    const replacements = {
        'D': 'ddd',
        'l': 'dddd',
        'z': 'DDD',
        'd': 'DD',
        'j': 'D',
        'o': 'YYYY',
        'Y': 'YYYY',
        'F': 'MMMM',
        'M': 'MMM',
        'm': 'MM',
        'n': 'M',
        'y': 'YY',
        'N': 'E',
        'S': 'o',
        'w': 'e',
        'W': 'W',
        't': '', // no equivalent
        'L': '', // no equivalent
        'a': 'a',
        'A': 'A',
        'B': '', // no equivalent
        'h': 'hh',
        'g': 'h',
        'G': 'H',
        'H': 'HH',
        'i': 'mm',
        's': 'ss',
        'u': 'SSS',
        'e': 'zz', // deprecated since version 1.6.0 of moment.js
        'I': '', // no equivalent
        'O': '', // no equivalent
        'P': '', // no equivalent
        'T': '', // no equivalent
        'Z': '', // no equivalent
        'c': '', // no equivalent
        'r': '', // no equivalent
        'U': 'X'
    };
    return str.split('').map(chr => chr in replacements ? get(replacements, chr) : chr).join('');
}
//endregion
