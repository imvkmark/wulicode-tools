import { get, isNull } from "lodash-es";


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
 * 是否是数字
 * @param n
 */
export const isNumeric = (n: any) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * 判定是否为手机号码
 * @param str
 * @returns {boolean|Array|{index: number, input: string}}
 */
export const isMobile = function (str: string) {
    let phone_number = str.replace(/\(|\)|\s+|/g, '');
    return phone_number.length > 10 && phone_number.match(/^(\d{1,5}-)?1[3|4|5|6|8|7|9][0-9]\d{4,8}$/);
};


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
 * 是否是邮箱
 * @param val
 */
export const isEmail = (val: string) => {
    return regexTest(val, /^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,8}$/i)
}

/**
 * 是否是匹配的用户名
 * normal : 正常
 * sub : 子用户
 * @param val
 * @param type
 */
export const isUsername = (val: string, type = 'normal') => {
    let regex;
    if (type === 'normal') {
        regex = /(?<username>[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{5,15})/u
    } else {
        regex = /(?<username>[a-zA-Z\u4e00-\u9fa5]:[a-zA-Z0-9_\u4e00-\u9fa5]{4,14})/u
    }
    let m = regex.exec(val);
    if (isNull(m)) {
        return false;
    }
    return get(m, 'groups.username', '') === val;
}


/**
 * 密码校验规则
 * @param val
 */
export const isSimplePwd = (val: string) => {
    return regexTest(val, /^[0-9a-zA-Z_*.\[\]\-!@#$%^&()~]{6,16}$/i)
}

/**
 * 是否是英文字符
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
 * 是否是空对象
 * @param obj
 */
export const isEmptyObject = (obj: object) => {
    return Object.getOwnPropertyNames(obj).length === 0;
}


/**
 * 是否是日期
 * @param value
 */
export const isDate = (value: any) => {
    if (value instanceof Date) {
        return true;
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
        return false;
    }

    return !isNaN(Date.parse(String(value)));
}
