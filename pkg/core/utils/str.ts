import { isObject, map, set } from "lodash-es";

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
