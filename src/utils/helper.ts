import { get, indexOf, random } from 'lodash-es';


/*
|--------------------------------------------------------------------------
| 尺寸大小 media
|--------------------------------------------------------------------------
|
*/

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

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
 * 尺寸小于等于
 * @param a
 * @param b
 */
export const sizeLte = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia <= ib;
}

/**
 * 尺寸的样式
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

/*
|--------------------------------------------------------------------------
| 验证
|--------------------------------------------------------------------------
|
*/

/**
 * 是否是 IPv4
 * @param ip
 */
export const isIpV4 = (ip: string) => {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
}


/**
 * 是否是 IpV6
 * @param ip
 */
export const isIpV6 = (ip: string) => {
    return /^([0-9A-Fa-f]{0,4}:){2,7}([0-9A-Fa-f]{1,4}$|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4})$/gm.test(ip);
}

/**
 * 是否是中文身份证号
 * @param chId
 */
export const isChid = (chId: string) => {
    let iW = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
    let iSum = 0;
    let iC, iVal;
    for (let i = 0; i < 17; i++) {
        iC = chId.charAt(i);
        iVal = parseInt(iC, 10);
        iSum += iVal * iW[i];
    }
    let iJYM = iSum % 11;
    let sJYM = '';
    if (iJYM === 0) sJYM = '1';
    else if (iJYM === 1) sJYM = '0';
    else if (iJYM === 2) sJYM = 'x';
    else if (iJYM === 3) sJYM = '9';
    else if (iJYM === 4) sJYM = '8';
    else if (iJYM === 5) sJYM = '7';
    else if (iJYM === 6) sJYM = '6';
    else if (iJYM === 7) sJYM = '5';
    else if (iJYM === 8) sJYM = '4';
    else if (iJYM === 9) sJYM = '3';
    else if (iJYM === 10) sJYM = '2';
    let cCheck = chId.charAt(17).toLowerCase().toString();
    return sJYM && cCheck === sJYM;
}

/**
 * 是否是邮箱
 * @param val
 */
export const isEmail = (val: string) => {
    return regexTest(val, /^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,8}$/i)
}

/**
 * 是否是字母构成
 * @param val
 */
export const isAlpha = (val: string) => {
    return regexTest(val, /^([a-z])+$/i)
}

/**
 * 验证字段可能包含字母、数字，以及破折号 (-) 和下划线 ( _ )。
 * @param val
 */
export const isAlphaDash = (val: string) => {
    return regexTest(val, /^([a-z0-9-_])+$/i)
}

/**
 * 验证字段必须是完全是字母、数字
 * @param val
 */
export const isAlphaNum = (val: string) => {
    return regexTest(val, /^([a-z0-9])+$/i)
}


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
 * 是否是数字
 * @param n
 */
export const isNumeric = (n: any) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * 是否是Url
 * @param n
 */
export const isUrl = (n: any) => {
    return regexTest(n, /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/i);
}

/**
 * 是否是 Int 类型的数据
 * @param n
 */
export const isInteger = (n: any) => {
    if (isNaN(Math.round(n))) {
        return false;
    }
    return Math.round(n).toString() === n.toString();
}

/**
 * RegexTest / 正则匹配
 * @param value
 * @param params
 */
export const regexTest = (value: string[] | string, params: string[] | string | any) => {
    let args = !(params instanceof Array) ? [params] : params;
    let val = !(value instanceof Array) ? [value] : value;

    let re = args[0];

    if (!(re instanceof RegExp)) {
        re = re.split('/');
        re = new RegExp(re[1], re[2]);
    }
    return re.test(val);
}

/**
 * 是否是空对象
 * @param obj
 */
export const isEmptyObject = (obj: object) => {
    return Object.getOwnPropertyNames(obj).length === 0;
}

export const isDate = (value: any) => {
    if (value instanceof Date) {
        return true;
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
        return false;
    }

    return !isNaN(Date.parse(String(value)));
}

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


/**
 * return a promise that resolves with a File instance
 * https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f
 * @param url
 */
export const urltoFile = (url: string) => {
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