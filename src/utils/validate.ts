import { difference, get, includes, indexOf, map, set } from 'lodash-es';
import { Rule } from 'async-validator';
import {
    isAlpha,
    isAlphaDash,
    isAlphaNum,
    isChid,
    isEmail,
    isInteger,
    isIpV4,
    isIpV6,
    isNumeric,
    isUrl,
    regexTest,
    sprintf
} from '@/utils/helper';

const valueSize = (val: any, type: string) => {
    if (!val) {
        return 0;
    }
    const hasNumeric = type === 'numeric';

    if (hasNumeric && !isNaN(parseFloat(val))) {
        return parseFloat(val);
    }

    // for array and string
    return val.length;
}

const defTitle = (defs: any, field?: string) => {
    if (!field) {
        return '';
    }
    return get(defs, field) ? get(defs, field) : capitalCase(field);
}

export const fieldRules: any = (rules: any, defs: any) => {
    let arr = {};
    let model = {};
    map(defs, function (item) {
        set(model, get(item, 'field.name'), get(item, 'item.label'))
    })


    for (let field in rules) {
        set(arr, field, parseRules(field, get(rules, field), model))
    }
    console.log(arr, 'parsed-rules')
    return arr;
}


/**
 * 解析一个字段的所有规则
 * @param itemRules
 * @param field
 * @param model
 */
export const parseRules = (field: string, itemRules: string | string[], model: {}) => {
    let rules = <any>[];

    /* 格式化规则
     * ---------------------------------------- */
    let from;
    if (typeof itemRules === 'string') {
        from = itemRules.split('|');
    } else {
        from = itemRules;
    }
    from.forEach(function (ruleAndArgs) {
        // ruleAndArgs:
        //  - regex:/\d{5}/
        //  - min:1
        //  - max:3
        //  - between:4,20
        if (ruleAndArgs.trim()) {
            let args = ruleAndArgs.split(':');
            let name = args[0];
            let params = args[1] ? args[1].split(',') : [];
            rules.push({
                title: defTitle(model, name),
                field,
                model,
                name,
                params
            })
        }
    });
    return rules;
}
/**
 * 标题转换为大写形式
 * @param str
 */
export const capitalCase = (str: string) => {
    return str
        .split('_')
        .map(function (item) {
            return item[0].toUpperCase() + item.slice(1).toLowerCase();
        })
        .join('');
}

export const defaultMsgs: any = {
    accepted: '{0}必须选择',
    required: '{0}必填',
    email: '{0}必须是邮箱',
    string: '{0}必须是字符串类型',
    alpha: '{0}必须全部由字母构成',
    alphaDash: '{0}必须全部由字母/数字/中杠线(-)/下划线(_)构成',
    alphaNum: '{0}必须全部由字母/数字构成',
    ip: '{0}必须是正确的IP地址(ipv4/ipv6)',
    ipv4: '{0}必须是正确的IPV4地址',
    ipv6: '{0}必须是正确的IPV6地址',
    chid: '{0}必须是正确的身份证号码',
    in: '{0}必须是{1}内的值',
    notIn: '{0}必须不是{1}内的值',
    numeric: '{0}必须是数字',
    integer: '{0}必须是整数',
    url: '{0}需要是一个标准的Url地址',
    digits: '{0}需要是长度为{1}的正整数',
    digits_between: '{0}需要是长度介于{1},{2}的正整数',
    json: '{0}需要是标准的Json字串',
    regex: '字段{0}输入内容不匹配',
    not_regex: '字段{0}输入内容不匹配',
    same: '字段{0}和{1}输入内容不匹配',
    boolean: '验证的字段{0}必须可以是布尔',
    date: '字段{0}需要是日期类型',
    error: {
        max: '{0}的规则{1}必须是数字',
        size: '{0}的规则{1}必须是整数',
        min: '{0}的规则{1}必须是数字',
        between: '{0}的规则{1},{2}必须是数字',
        digits_between: '{0}的规则{1},{2}必须是数字',
        digit: '{0}的规则必须是整数',
        array: '{0}必须是数组'
    },
    max: {
        numeric: '{0}的值不得大于{1}',
        string: '{0}的长度不得大于{1}'  // with array
    },
    size: {
        numeric: '{0}的值需要等于{1}',
        string: '{0}的长度需要等于{1}'
    },
    min: {
        numeric: '{0}的值不得小于{1}',
        string: '{0}的长度不得小于{1}'
    },
    between: {
        numeric: '{0}的值必须介于{1},{2}之间',
        string: '{0}的长度必须介于{1},{2}之间'
    },
    // todo - not test
    array: '{0}必须是数组',
    before: '{0}日期必须在{1}日期之前'
}


/**
 * 返回规则的类型, 根据不同的类型过滤不同的规则
 * @param ruleNames
 */
export const rulesType = (ruleNames: string[]) => {
    if (includes(ruleNames, 'numeric') || includes(ruleNames, 'integer')) {
        return 'numeric';
    } else if (includes(ruleNames, 'array')) {
        return 'array';
    } else if (includes(ruleNames, 'string')) {
        return 'string';
    }
    return '';
}


/**
 * 字串类型
 */
export const validateString = (fieldRule: {}): Rule => {
    return {
        type: 'string',
        validator(rule, value, callback) {
            if (value && typeof value !== 'string') {
                callback(sprintf(defaultMsgs.string, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}


export const validateArray = (fieldRule: {}): Rule => {
    return {
        type: 'array',
        validator(rule, value, callback) {
            if (value && !Array.isArray(value)) {
                callback(sprintf(defaultMsgs.array, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

/**
 * 完全由字母构成
 */
export const validateAlpha = (fieldRule: {}): Rule => {

    return {
        validator(rule, value, callback) {
            if (value && !isAlpha(value)) {
                callback(sprintf(defaultMsgs.alpha, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

/**
 * 验证字段可能包含字母、数字，以及破折号 (-) 和下划线 ( _ )。
 */
export const validateAlphaDash = (fieldRule: {}): Rule => {
    return {
        validator(rule, value, callback) {
            if (value && !isAlphaDash(value)) {
                callback(sprintf(defaultMsgs.alphaDash, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

/**
 * 验证字段必须是完全是字母、数字
 */
export const validateAlphaNum = (fieldRule: {}): Rule => {
    return {
        validator(rule, value, callback) {
            if (value && !isAlphaNum(value)) {
                callback(sprintf(defaultMsgs.alphaNum, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

/**
 * 验证必填
 */
export const validateRequired = (fieldRule: {}): Rule => {
    return {
        required: true,
        validator(rule, value, callback) {
            if (!value) {
                callback(sprintf(defaultMsgs.required, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

/**
 * 必须是邮箱
 */
export const validateEmail = (fieldRule: {}): Rule => {
    return {
        validator: (rule, value, callback) => {
            if (value && !isEmail(value)) {
                callback(sprintf(defaultMsgs.email, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

/**
 * 正确的身份证信息
 */
export const validateChid = (fieldRule: {}): Rule => {
    return {
        validator(rule, value, callback) {
            if (value && !isChid(value)) {
                callback(sprintf(defaultMsgs.chid, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

/**
 * 验证值是否在验证之列
 * @param type
 * @param fieldRule
 */
export const validateIn = (type: string, fieldRule: {}): Rule => {
    let values = get(fieldRule, 'params');
    return {
        validator(rule, value, callback) {
            if (!value) {
                callback();
            }

            // 数组中值不存在
            if (Array.isArray(value) && type === 'array') {
                let arr = difference(value, values);
                if (arr.length !== 0) {
                    callback(sprintf(defaultMsgs.in, get(fieldRule, 'title'), values.toString()));
                }
            }

            // 不在之中
            if (!(indexOf(values, value) >= 0)) {
                callback(sprintf(defaultMsgs.in, get(fieldRule, 'title'), values.toString()));
            } else {
                callback();
            }
        }
    }
}

/**
 * 不在允许的范围内
 * @param fieldRule
 */
export const validateNotIn = (fieldRule: {}): Rule => {
    let values = get(fieldRule, 'params');
    return {
        validator(rule, value, callback) {
            if (value && indexOf(values, value) >= 0) {
                callback(sprintf(defaultMsgs.notIn, get(fieldRule, 'title'), values.toString()));
            } else {
                callback();
            }
        }
    }
}

/**
 * 验证IP
 */
export const validateIp = (fieldRule: {}): Rule => {
    return {
        validator: (rule, value, callback) => {
            if (value && !(isIpV4(value) || isIpV6(value))) {
                callback(sprintf(defaultMsgs.ip, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

export const validateIpV4 = (fieldRule: {}): Rule => {
    return {
        validator: (rule, value, callback) => {
            if (value && !isIpV4(value)) {
                callback(sprintf(defaultMsgs.ipv4, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

export const validateIpV6 = (fieldRule: {}): Rule => {
    return {
        validator: (rule, value, callback) => {
            if (value && !isIpV6(value)) {
                callback(sprintf(defaultMsgs.ipv6, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

/**
 * 数值类型
 */
export const validateNumeric = (fieldRule: {}): Rule => {
    return {
        validator(rule, value, callback) {
            if (value && !isNumeric(value)) {
                callback(sprintf(defaultMsgs.numeric, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

/**
 * 验证是否是一个Url
 */
export const validateUrl = (fieldRule: {}): Rule => {
    return {
        validator(rule, value, callback) {
            if (value && !isUrl(value)) {
                callback(sprintf(defaultMsgs.url, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

export const validateInteger = (fieldRule: {}): Rule => {
    return {
        validator(rule, value, callback) {
            if (value && !isInteger(value)) {
                callback(sprintf(defaultMsgs.integer, get(fieldRule, 'title')));
            } else {
                callback();
            }
        }
    }
}

export const validateMax = (type: string, fieldRule: {}): Rule => {
    return {
        validator(rule, value, callback) {
            let size = Number.parseFloat(get(fieldRule, 'params')[0]);
            if (!isNumeric(size)) {
                callback(sprintf(defaultMsgs.error.max, get(fieldRule, 'title'), size))
            }
            if (!value) {
                callback();
            }
            const valSize = valueSize(value, type);
            if (valSize > size) {
                let tip = defaultMsgs.max.string;
                if (type === 'numeric') {
                    tip = defaultMsgs.max.numeric;
                }
                callback(sprintf(tip, get(fieldRule, 'title'), size))
            }
            callback();
        }
    }
}

export const validateSize = (type: string, fieldRule: {}): Rule => {
    return {
        validator(rule, value, callback) {
            let size = get(fieldRule, 'params')[0];
            if (!isInteger(size)) {
                callback(sprintf(defaultMsgs.error.size, get(fieldRule, 'title'), size))
            }
            if (!value) {
                callback()
            }
            const valSize = valueSize(value, type);
            if (valSize !== size) {
                let tip = defaultMsgs.size.string;
                if (type === 'numeric') {
                    tip = defaultMsgs.size.numeric;
                }
                callback(sprintf(tip, get(fieldRule, 'title'), size))
            }
            callback()
        }
    }
}

/**
 * 检测最小值
 * @param type
 * @param fieldRule
 */
export const validateMin = (type: string, fieldRule: {}): Rule => {
    return {
        validator(rule, value, callback) {
            let size = get(fieldRule, 'params')[0];
            if (!isNumeric(size)) {
                callback(sprintf(defaultMsgs.error.min, get(fieldRule, 'title'), size))
            }
            if (!value) {
                callback()
            }
            const valSize = valueSize(value, type);
            if (valSize < size) {
                let tip = defaultMsgs.min.string;
                if (type === 'numeric') {
                    tip = defaultMsgs.min.numeric;
                }
                callback(sprintf(tip, get(fieldRule, 'title'), size))
            }
            callback()
        }
    }
}

/**
 *
 * @param type
 * @param fieldRule
 */
export const validateBetween = (type: string, fieldRule: {}): Rule => {
    return {
        validator(rule, value, callback) {
            let start = get(fieldRule, 'params')[0];
            let end = get(fieldRule, 'params')[1];
            if (!isNumeric(start) || !isNumeric(end)) {
                callback(sprintf(defaultMsgs.error.between, get(fieldRule, 'title'), start, end))
            }
            if (!value) {
                callback();
            }
            const valSize = valueSize(value, type);
            let startVal = Number.parseFloat(start);
            let endVal = Number.parseFloat(end);
            if (startVal > valSize || endVal < valSize) {
                let tip = defaultMsgs.between.string;
                if (type === 'numeric') {
                    tip = defaultMsgs.between.numeric;
                }
                callback(sprintf(tip, get(fieldRule, 'title'), startVal, endVal))
            }
            callback()
        }
    }
}

/**
 * 长度是 size 大小的正整数
 * @param fieldRule
 */
export const validateDigits = (fieldRule: {}): Rule => {
    return {
        validator(rule, value, callback) {
            let size = get(fieldRule, 'params')[0];
            if (!isNumeric(size)) {
                callback(sprintf(defaultMsgs.error.digits, get(fieldRule, 'title'), size))
            }
            if (value) {
                let length = String(value).length;
                if (/[^0-9]/.test(value) || Number.parseInt(size) !== length) {
                    callback(sprintf(defaultMsgs.digits, get(fieldRule, 'title'), size))
                }
                callback()
            } else {
                callback();
            }
        }
    }
}

/**
 * 验证数据长度在范围内
 * @param fieldRule
 */
export const validateDigitsBetween = (fieldRule: {}): Rule => {
    return {
        validator(rule, value, callback) {
            let min = get(fieldRule, 'params')[0];
            let max = get(fieldRule, 'params')[1];
            if (!isNumeric(min) || !isNumeric(max)) {
                callback(sprintf(defaultMsgs.error.digits_between, get(fieldRule, 'title'), min, max))
            }
            if (value) {
                let length = String(value).length;
                if (/[^0-9]/.test(value) || Number.parseInt(min) > length || Number.parseInt(max) < length) {
                    callback(sprintf(defaultMsgs.digits, get(fieldRule, 'title'), min, max))
                }
                callback()
            } else {
                callback();
            }
        }
    }
}

/**
 * Accept : 必须是有值的
 * 这里值是 yes/on/1/true
 */
export const validateAccepted = (fieldRule: {}): Rule => {
    return {
        validator: (rule, value, callback) => {
            let accepted = ['yes', 'on', '1', 1, true, 'true'];
            if (!(indexOf(accepted, value) >= 0)) {
                callback(sprintf(defaultMsgs.accepted, get(fieldRule, 'title')));
            }
            callback();
        }
    }
}

/**
 * 验证布尔值
 * @param fieldRule
 */
export const validateBoolean = (fieldRule: {}): Rule => {
    return {
        validator: (rule, value, callback) => {
            let acceptable = [true, false, 0, 1, '0', '1'];
            if (!(value === null || acceptable.indexOf(value) >= 0)) {
                callback(sprintf(defaultMsgs.boolean, get(fieldRule, 'title')))
            }
            callback()
        }
    }
}

/**
 * 验证日期
 * @param fieldRule
 */
export const validateDate = (fieldRule: {}): Rule => {
    return {
        validator: (rule, value, callback) => {
            if (typeof value !== 'string' && typeof value !== 'number') {
                callback(sprintf(defaultMsgs.date, get(fieldRule, 'title')))
            }
            if (isNaN(Date.parse(value))) {
                callback(sprintf(defaultMsgs.date, get(fieldRule, 'title')))
            }
            callback()
        }
    }
}

/**
 * 验证是 Json 字串
 * @param fieldRule
 */
export const validateJson = (fieldRule: {}): Rule => {
    return {
        validator: (rule, value, callback) => {
            if (value) {
                try {
                    JSON.parse(value);
                    callback();
                } catch (err) {
                    callback(sprintf(defaultMsgs.json, get(fieldRule, 'title')));
                }
            }
            callback();
        }
    }
}

/**
 * 验证正则匹配的数据
 * @param fieldRule
 */
export const validateRegex = (fieldRule: {}): Rule => {
    return {
        validator: (rule, value, callback) => {
            if (value) {
                let param = get(fieldRule, 'params')[0];
                if (!regexTest(value, param)) {
                    callback(sprintf(defaultMsgs.regex, get(fieldRule, 'title')));
                }
            }
            callback();
        }
    }
}

/**
 * 验证非正则匹配的数据
 * @param fieldRule
 */
export const validateNotRegex = (fieldRule: {}): Rule => {
    return {
        validator: (rule, value, callback) => {
            if (value) {
                let param = get(fieldRule, 'params')[0];
                if (regexTest(value, param)) {
                    callback(sprintf(defaultMsgs.not_regex, get(fieldRule, 'title')));
                }
            }
            callback();
        }
    }
}