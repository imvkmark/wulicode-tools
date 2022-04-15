/*
|--------------------------------------------------------------------------
| 帮助函数
|--------------------------------------------------------------------------
|
*/

import { camelCase, get, indexOf, random, round, upperFirst } from "lodash-es";


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



/*
|--------------------------------------------------------------------------
| 尺寸大小 media
|--------------------------------------------------------------------------
|
*/

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

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


/*
|--------------------------------------------------------------------------
| 验证
|--------------------------------------------------------------------------
|
*/

/**
 * php 格式化转换为 dayjs 格式
 * @param str
 */
export const toDayjsFormat = (str: string) => {
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


export const urlExtension = (url: string) => {
    let ext = url.substring(url.lastIndexOf('.') + 1);
    if (ext.indexOf('?') > -1) {
        return strBefore(ext, '?')
    }
    return ext;
}

/**
 * return a promise that resolves with a File instance
 * https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f
 * @param url
 */
export const urlToFile = (url: string) => {
    // data:image/png;base64,iVBO
    let extension = strAfter(strBefore(url, ';base64'), '/');
    if (!extension) {
        extension = 'png';
    }
    let filename = random() + '.' + extension
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
 * 是否是微信浏览器
 */
export const isWechat = () => {
    let userAgent = navigator.userAgent.toLowerCase();
    return !!userAgent.match(/micromessenger/);
};




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
 * 进行浏览器警告, 便于项目寻找错误
 */
export const pyWarning = (...args: any[]) => {
    const debugTime = () => {
        const d = new Date();
        return '🕊 🕊 🕊 [' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ' + d.getMilliseconds() + '] ';
    }
    console.warn(debugTime(), ...args);
}
