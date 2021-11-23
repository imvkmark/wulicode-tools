import { get, includes, set } from 'lodash-es';

export const fieldRules: any = (rules: any) => {
    let arr = {};
    for (let field in rules) {
        set(arr, field, parseRules(field, get(rules, field)))
    }
    return arr;
}


/**
 * 解析一个字段的所有规则
 * @param itemRules
 * @param field
 */
export const parseRules = (field: string, itemRules: string | string[]) => {
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
    ip: '{0}必须是正确的IP地址',
    chid: '{0}必须是正确的身份证号码',
    numeric: '{0}必须是数字',
    // todo - not test
    array: '{0}必须是数组',
    before: '{0}日期必须在{1}日期之前'
}


/**
 * 字段标题
 * @param {any} defs
 * @param field
 */
export const defTitle = (defs: any, field?: string) => {
    if (!field) {
        return '';
    }
    return get(defs, field) ? get(defs, field) : capitalCase(field);
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
