import { clone, difference, each, endsWith, get, includes, indexOf, keys, map, set, startsWith, union } from 'lodash-es';
import { onMounted, Ref, ref, toRefs, watch } from 'vue';
import { Rule } from 'async-validator';
import {
    isAlpha,
    isAlphaDash,
    isAlphaNum,
    isChid,
    isDate,
    isEmail,
    isInteger,
    isIpV4,
    isIpV6,
    isNumeric,
    isUrl,
    regexTest,
    sprintf
} from '@/utils/helper';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat)

/**
 * 参考Laravel的验证规则
 * https://learnku.com/docs/laravel/6.x/validation/5144#c58a91
 * https://github.com/yiminghe/async-validator/blob/master/src/messages.ts
 */
export default function useValidation(props: any, model = <Ref>{}) {

    const { rules, items } = toRefs(props);

    const defines = ref({});

    const parsedRules = ref({});

    /**
     * 所有的验证规则
     * @private
     */
    const schema = ref({});

    /**
     * 追加的规则
     */
    const append = ref({});

    /**
     * todo 待确定
     * 自定义的消息 { username : {required : '请填写用户名'} }
     */


    const hasData = (name: string) => {
        return typeof get(model.value, name) !== 'undefined';
    }


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


    /**
     * 解析一个字段的所有规则
     * @param itemRules
     * @param field
     */
    const parseRules = (field: string, itemRules: string | string[]) => {
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
    const capitalCase = (str: string) => {
        return str
            .split('_')
            .map(function (item) {
                return item[0].toUpperCase() + item.slice(1).toLowerCase();
            })
            .join('');
    }

    const defaultMsgs: any = {
        accepted: '{0}必须选择',
        filled: '{0}字段存在时候不能为空',
        required: '{0}必填',
        present: '{0}必须存在',
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
        starts_with: '字段{0}应该以{1}开头',
        ends_with: '字段{0}应该以{1}结尾',
        same: '字段{0}和{1}输入内容不匹配',
        different: '字段{0}和{1}输入内容匹配',
        gt: '字段{0}的长度需要大于{1}的长度',
        gte: '字段{0}的长度需要大于等于{1}的长度',
        lte: '字段{0}的长度需要小于等于{1}的长度',
        lt: '字段{0}的长度需要小于{1}的长度',
        boolean: '验证的字段{0}必须可以是布尔',
        date: '字段{0}需要是日期类型',
        after: '验证字段{0}必须是给定日期{1}之后的值',
        required_if: '字段{0}是{1}时候,本字段不能为空',
        required_unless: '字段{0}不是{1}时候,本字段不能为空',
        required_with: '其他任一指定字段{0}出现时，本字段不能为空',
        required_with_all: '其他全部指定字段{0}出现时，本字段不能为空',
        required_without: '其他任一指定字段{0}不出现时，本字段不能为空',
        required_without_all: '其他全部指定字段{0}不出现时，本字段不能为空',
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
    const rulesType = (ruleNames: string[]) => {
        if (includes(ruleNames, 'numeric') || includes(ruleNames, 'integer')) {
            return 'numeric';
        } else if (includes(ruleNames, 'array')) {
            return 'array';
        } else if (includes(ruleNames, 'string')) {
            return 'string';
        } else if (includes(ruleNames, 'date') || includes(ruleNames, 'date_format')) {
            return 'date';
        }
        return '';
    }


    const isRequired = (value: any) => {
        if (value === null) {
            return false;
        } else if (typeof value === 'string' && value.trim() === '') {
            return false;
        } else if (typeof value === 'undefined') {
            return false;
        } else if (Array.isArray(value) && value.length < 1) {
            return false;
        }
        return true;
    }

    const label = (fields: [] | string | undefined) => {
        if (typeof fields === 'undefined') {
            return '';
        }
        let arrFields = Array.isArray(fields) ? fields : [fields];
        return map(arrFields, (field) => {
            return get(defines.value, field, '') ? get(defines.value, field, '') : capitalCase(field);
        }).join(',')
    }

    /* Required
     * ---------------------------------------- */
    const anyFailingRequired = (names = []) => {
        let result = false;

        names.forEach(function (name) {
            if (!isRequired(get(model.value, name))) {
                result = true;
                return;
            }
        });

        return result;
    }

    const allFailingRequired = (names = []) => {
        let result = true;

        names.forEach(function (name) {
            if (isRequired(get(model.value, name))) {
                result = false;
                return;
            }
        });

        return result;
    }

    const isRequiredWith = (value: any, params: []) => {
        if (!allFailingRequired(params)) {
            return isRequired(value);
        }

        return true;
    }

    const isRequiredWithAll = (value: any, params: []) => {
        if (!anyFailingRequired(params)) {
            return isRequired(value);
        }

        return true;
    }

    const isRequiredWithout = (value: any, params: []) => {
        if (anyFailingRequired(params)) {
            return isRequired(value);
        }

        return true;
    }

    const isRequiredWithoutAll = (value: any, params: []) => {
        if (allFailingRequired(params)) {
            return isRequired(value);
        }
        return true;
    }


    /**
     * 字串类型
     */
    const validateString = (fieldRule: {}): Rule => {
        return {
            type: 'string',
            validator(rule, value, callback) {
                if (value && typeof value !== 'string') {
                    callback(sprintf(defaultMsgs.string, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }


    const validateArray = (fieldRule: {}): Rule => {
        return {
            type: 'array',
            validator(rule, value, callback) {
                if (value && !Array.isArray(value)) {
                    callback(sprintf(defaultMsgs.array, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 完全由字母构成
     */
    const validateAlpha = (fieldRule: {}): Rule => {

        return {
            validator(rule, value, callback) {
                if (value && !isAlpha(value)) {
                    callback(sprintf(defaultMsgs.alpha, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证字段可能包含字母、数字，以及破折号 (-) 和下划线 ( _ )。
     */
    const validateAlphaDash = (fieldRule: {}): Rule => {
        return {
            validator(rule, value, callback) {
                if (value && !isAlphaDash(value)) {
                    callback(sprintf(defaultMsgs.alphaDash, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证字段必须是完全是字母、数字
     */
    const validateAlphaNum = (fieldRule: {}): Rule => {
        return {
            validator(rule, value, callback) {
                if (value && !isAlphaNum(value)) {
                    callback(sprintf(defaultMsgs.alphaNum, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证必填
     */
    const validateRequired = (fieldRule: {}): Rule => {
        return {
            required: true,
            validator(rule, value, callback) {
                if (!value) {
                    callback(sprintf(defaultMsgs.required, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }
    /**
     * 验证必须存在, 单可以为空
     */
    const validatePresent = (fieldRule: {}): Rule => {
        return {
            required: true,
            validator(rule, value, callback) {
                if (typeof value === 'undefined') {
                    callback(sprintf(defaultMsgs.present, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 必须是邮箱
     */
    const validateEmail = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value && !isEmail(value)) {
                    callback(sprintf(defaultMsgs.email, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 正确的身份证信息
     */
    const validateChid = (fieldRule: {}): Rule => {
        return {
            validator(rule, value, callback) {
                if (value && !isChid(value)) {
                    callback(sprintf(defaultMsgs.chid, label(rule.field)));
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
    const validateIn = (type: string, fieldRule: {}): Rule => {
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
                        callback(sprintf(defaultMsgs.in, label(rule.field), values.toString()));
                    }
                }

                // 不在之中
                if (!(indexOf(values, value) >= 0)) {
                    callback(sprintf(defaultMsgs.in, label(rule.field), values.toString()));
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
    const validateNotIn = (fieldRule: {}): Rule => {
        let values = get(fieldRule, 'params');
        return {
            validator(rule, value, callback) {
                if (value && indexOf(values, value) >= 0) {
                    callback(sprintf(defaultMsgs.notIn, label(rule.field), values.toString()));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证IP
     */
    const validateIp = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value && !(isIpV4(value) || isIpV6(value))) {
                    callback(sprintf(defaultMsgs.ip, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    const validateIpV4 = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value && !isIpV4(value)) {
                    callback(sprintf(defaultMsgs.ipv4, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    const validateIpV6 = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value && !isIpV6(value)) {
                    callback(sprintf(defaultMsgs.ipv6, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 数值类型
     */
    const validateNumeric = (fieldRule: {}): Rule => {
        return {
            validator(rule, value, callback) {
                if (value && !isNumeric(value)) {
                    callback(sprintf(defaultMsgs.numeric, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证是否是一个Url
     */
    const validateUrl = (fieldRule: {}): Rule => {
        return {
            validator(rule, value, callback) {
                if (value && !isUrl(value)) {
                    callback(sprintf(defaultMsgs.url, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    const validateInteger = (fieldRule: {}): Rule => {
        return {
            validator(rule, value, callback) {
                if (value && !isInteger(value)) {
                    callback(sprintf(defaultMsgs.integer, label(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    const validateMax = (type: string, fieldRule: {}): Rule => {
        return {
            validator(rule, value, callback) {
                let size = Number.parseFloat(get(fieldRule, 'params')[0]);
                if (!isNumeric(size)) {
                    callback(sprintf(defaultMsgs.error.max, label(rule.field), size))
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
                    callback(sprintf(tip, label(rule.field), size))
                }
                callback();
            }
        }
    }

    const validateSize = (type: string, fieldRule: {}): Rule => {
        return {
            validator(rule, value, callback) {
                let size = get(fieldRule, 'params')[0];
                if (!isInteger(size)) {
                    callback(sprintf(defaultMsgs.error.size, label(rule.field), size))
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
                    callback(sprintf(tip, label(rule.field), size))
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
    const validateMin = (type: string, fieldRule: {}): Rule => {
        return {
            validator(rule, value, callback) {
                let size = get(fieldRule, 'params')[0];
                if (!isNumeric(size)) {
                    callback(sprintf(defaultMsgs.error.min, label(rule.field), size))
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
                    callback(sprintf(tip, label(rule.field), size))
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
    const validateBetween = (type: string, fieldRule: {}): Rule => {
        return {
            validator(rule, value, callback) {
                let start = get(fieldRule, 'params')[0];
                let end = get(fieldRule, 'params')[1];
                if (!isNumeric(start) || !isNumeric(end)) {
                    callback(sprintf(defaultMsgs.error.between, label(rule.field), start, end))
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
                    callback(sprintf(tip, label(rule.field), startVal, endVal))
                }
                callback()
            }
        }
    }

    /**
     * 长度是 size 大小的正整数
     * @param fieldRule
     */
    const validateDigits = (fieldRule: {}): Rule => {
        return {
            validator(rule, value, callback) {
                let size = get(fieldRule, 'params')[0];
                if (!isNumeric(size)) {
                    callback(sprintf(defaultMsgs.error.digits, label(rule.field), size))
                }
                if (value) {
                    let length = String(value).length;
                    if (/[^0-9]/.test(value) || Number.parseInt(size) !== length) {
                        callback(sprintf(defaultMsgs.digits, label(rule.field), size))
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
    const validateDigitsBetween = (fieldRule: {}): Rule => {
        return {
            validator(rule, value, callback) {
                let min = get(fieldRule, 'params')[0];
                let max = get(fieldRule, 'params')[1];
                if (!isNumeric(min) || !isNumeric(max)) {
                    callback(sprintf(defaultMsgs.error.digits_between, label(rule.field), min, max))
                }
                if (value) {
                    let length = String(value).length;
                    if (/[^0-9]/.test(value) || Number.parseInt(min) > length || Number.parseInt(max) < length) {
                        callback(sprintf(defaultMsgs.digits, label(rule.field), min, max))
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
    const validateAccepted = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                let accepted = ['yes', 'on', '1', 1, true, 'true'];
                if (!(indexOf(accepted, value) >= 0)) {
                    callback(sprintf(defaultMsgs.accepted, label(rule.field)));
                }
                callback();
            }
        }
    }

    const validateFilled = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (typeof value !== 'undefined' && value !== null) {
                    if (!value) {
                        callback(sprintf(defaultMsgs.filled, label(rule.field)));
                    }
                }
                callback();
            }
        }
    }

    /**
     * 验证布尔值
     * @param fieldRule
     */
    const validateBoolean = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                let acceptable = [true, false, 0, 1, '0', '1'];
                if (!(value === null || acceptable.indexOf(value) >= 0)) {
                    callback(sprintf(defaultMsgs.boolean, label(rule.field)))
                }
                callback()
            }
        }
    }

    /**
     * 验证日期(Y-m-d)
     * @param fieldRule
     */
    const validateDate = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value && !dayjs(value, 'YYYY-MM-DD', true).isValid()) {
                    callback(sprintf(defaultMsgs.date, label(rule.field)))
                }
                callback()
            }
        }
    }

    /**
     * 验证是 Json 字串
     * @param fieldRule
     */
    const validateJson = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    try {
                        JSON.parse(value);
                        callback();
                    } catch (err) {
                        callback(sprintf(defaultMsgs.json, label(rule.field)));
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
    const validateRegex = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let param = get(fieldRule, 'params')[0];
                    if (!regexTest(value, param)) {
                        callback(sprintf(defaultMsgs.regex, label(rule.field)));
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
    const validateNotRegex = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let param = get(fieldRule, 'params')[0];
                    if (regexTest(value, param)) {
                        callback(sprintf(defaultMsgs.not_regex, label(rule.field)));
                    }
                }
                callback();
            }
        }
    }

    const validateStartsWith = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let param = get(fieldRule, 'params')[0];
                    if (!startsWith(value, param)) {
                        callback(sprintf(defaultMsgs.starts_with, label(rule.field), param));
                    }
                }
                callback();
            }
        }
    }
    const validateEndsWith = (fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let param = get(fieldRule, 'params')[0];
                    if (!endsWith(value, param)) {
                        callback(sprintf(defaultMsgs.ends_with, label(rule.field), param));
                    }
                }
                callback();
            }
        }
    }


    /**
     * 独立的规则, 不依附于其他字段的存在
     */
    const independentRules = {
        'array': validateArray,
        'required': validateRequired,
        'filled': validateFilled,
        'present': validatePresent,
        'ip': validateIp,
        'ipv4': validateIpV4,
        'boolean': validateBoolean,
        'starts_with': validateStartsWith,
        'ends_with': validateEndsWith,
        'regex': validateRegex,
        'not_regex': validateNotRegex,
        'date': validateDate,
        'ipv6': validateIpV6,
        'numeric': validateNumeric,
        'integer': validateInteger,
        'alpha': validateAlpha,
        'url': validateUrl,
        'alpha_dash': validateAlphaDash,
        'json': validateJson,
        'alpha_num': validateAlphaNum,
        'email': validateEmail,
        'digits': validateDigits,
        'digits_between': validateDigitsBetween,
        'chid': validateChid,
        'string': validateString,
        'accepted': validateAccepted
    };

    const typedRules = {
        'max': validateMax,
        'min': validateMin,
        'between': validateBetween,
        'size': validateSize,
        'in': validateIn,
        'not_in': validateNotIn
    };

    /**
     * 验证非正则匹配的数据
     * @param type
     * @param fieldRule
     */
    const validateSame = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (value !== fieldVal) {
                        callback(sprintf(defaultMsgs.same, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        }
    }
    /**
     * 验证非正则匹配的数据
     * @param type
     * @param fieldRule
     */
    const validateDifferent = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (value === fieldVal) {
                        callback(sprintf(defaultMsgs.different, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        }
    }

    const validateGt = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (!(valueSize(value, type) > valueSize(fieldVal, type))) {
                        callback(sprintf(defaultMsgs.gt, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        }
    }
    const validateGte = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (!(valueSize(value, type) >= valueSize(fieldVal, type))) {
                        callback(sprintf(defaultMsgs.gte, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        }
    }

    const validateLte = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (!(valueSize(value, type) <= valueSize(fieldVal, type))) {
                        callback(sprintf(defaultMsgs.lte, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        }
    }

    const validateLt = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (!(valueSize(value, type) < valueSize(fieldVal, type))) {
                        callback(sprintf(defaultMsgs.lt, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        }
    }


    const validateAfter = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (!isDate(fieldVal)) {
                        callback(sprintf(defaultMsgs.date, label(field)));
                    }
                    if (!isDate(value)) {
                        callback(sprintf(defaultMsgs.date, label(rule.field)));
                    }
                    if (!(Date.parse(value) > Date.parse(fieldVal))) {
                        callback(sprintf(defaultMsgs.after, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        }
    }

    const validateBefore = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (!isDate(fieldVal)) {
                        callback(sprintf(defaultMsgs.date, label(field)));
                    }
                    if (!isDate(value)) {
                        callback(sprintf(defaultMsgs.date, label(rule.field)));
                    }
                    if (!(Date.parse(value) < Date.parse(fieldVal))) {
                        callback(sprintf(defaultMsgs.after, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        }
    }


    const validateAfterOrEqual = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (!isDate(fieldVal)) {
                        callback(sprintf(defaultMsgs.date, label(field)));
                    }
                    if (!isDate(value)) {
                        callback(sprintf(defaultMsgs.date, label(rule.field)));
                    }
                    if (!(Date.parse(value) >= Date.parse(fieldVal))) {
                        callback(sprintf(defaultMsgs.after, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        }
    }

    const validateBeforeOrEqual = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (!isDate(fieldVal)) {
                        callback(sprintf(defaultMsgs.date, label(field)));
                    }
                    if (!isDate(value)) {
                        callback(sprintf(defaultMsgs.date, label(rule.field)));
                    }
                    if (!(Date.parse(value) <= Date.parse(fieldVal))) {
                        callback(sprintf(defaultMsgs.after, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        }
    }

    /**
     * 验证当 字段 为指定值时候, 本字段不能为空
     * @param type
     * @param fieldRule
     */
    const validateRequiredIf = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                let field = get(fieldRule, 'params')[0];
                let fieldVal = get(model.value, field);
                let allowed = get(fieldRule, 'params', []).slice(1);
                if (indexOf(allowed, fieldVal) >= 0 && !value) {
                    callback(sprintf(defaultMsgs.required_if, label(field), allowed.toString()));
                }
                callback();
            }
        }
    }

    const validateRequiredWith = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                let params = get(fieldRule, 'params');
                console.log(value, params);
                if (!isRequiredWith(value, params)) {
                    callback(sprintf(defaultMsgs.required_with, label(params)));
                }
                callback();
            }
        }
    }
    const validateRequiredWithAll = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                let params = get(fieldRule, 'params');
                if (!isRequiredWithAll(value, params)) {
                    callback(sprintf(defaultMsgs.required_with_all, label(params)));
                }
                callback();
            }
        }
    }
    const validateRequiredWithout = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                let params = get(fieldRule, 'params');
                if (!isRequiredWithout(value, params)) {
                    callback(sprintf(defaultMsgs.required_without, label(params)));
                }
                callback();
            }
        }
    }


    const validateRequiredWithoutAll = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                let params = get(fieldRule, 'params');
                if (!isRequiredWithoutAll(value, params)) {
                    callback(sprintf(defaultMsgs.required_without_all, label(params)));
                }
                callback();
            }
        }
    }

    /**
     * 验证当 字段 不为指定值时候, 本字段不能为空
     * @param type
     * @param fieldRule
     */
    const validateRequiredUnless = (type: string, fieldRule: {}): Rule => {
        return {
            validator: (rule, value, callback) => {
                let field = get(fieldRule, 'params')[0];
                let fieldVal = get(model.value, field);
                let allowed = get(fieldRule, 'params', []).slice(1);
                if (!(indexOf(allowed, fieldVal) >= 0) && !value) {
                    callback(sprintf(defaultMsgs.required_unless, label(field), allowed.toString()));
                }
                callback();
            }
        }
    }

    /**
     * 验证存在值并一致
     * @param type
     * @param fieldRule
     */
    const validateConfirmed = (type: string, fieldRule: {}): Rule => {
        let fieldConfirm = `${get(fieldRule, 'field')}_confirmation`;
        let cloneAppend = clone(append.value);
        let ori: any = get(cloneAppend, fieldConfirm, []);
        if (Array.isArray(ori)) {
            /* 对之前数据的验证
             * ---------------------------------------- */
            ori.push({
                validator: (rule: any, value: any, callback: any) => {
                    if (value) {
                        let oriField = String(get(rule, 'field'))
                        let thatField = oriField.slice(0, oriField.indexOf('_confirmation'));
                        let fieldTitle = label(oriField)
                        let thatFieldTitle = label(thatField)
                        let fieldVal = get(model.value, thatField);
                        if (value !== fieldVal) {
                            callback(sprintf(defaultMsgs.same, fieldTitle, thatFieldTitle));
                        }
                    }
                    callback();
                }
            })
        }
        set(cloneAppend, fieldConfirm, ori);
        append.value = cloneAppend;

        /* 当前验证 confirm
         * ---------------------------------------- */
        return {}
    }

    const dependentRules = {
        'gt': validateGt,
        'lt': validateLt,
        'gte': validateGte,
        'lte': validateLte,
        'confirmed': validateConfirmed,
        'different': validateDifferent,
        'same': validateSame,
        'after': validateAfter,
        'after_or_equal': validateAfterOrEqual,
        'before': validateBefore,
        'before_or_equal': validateBeforeOrEqual,
        'required_if': validateRequiredIf,
        'required_unless': validateRequiredUnless,
        'required_with': validateRequiredWith,
        'required_with_all': validateRequiredWithAll,
        'required_without': validateRequiredWithout,
        'required_without_all': validateRequiredWithoutAll
    };


    /**
     * 查找验证规则
     * @param type
     * @param field
     * @param rule
     */
    const combineRule = (type: string, field: string, rule = {}) => {
        let name = get(rule, 'name');
        if (includes(keys(independentRules), name)) {
            return get(independentRules, name)(rule);
        } else if (includes(keys(typedRules), name)) {
            return get(typedRules, name)(type, rule);
        } else if (includes(keys(dependentRules), name)) {
            return get(dependentRules, name)(type, rule);
        } else {
            console.error(
                '"' + name + '" validation rule does not exist!'
            );
        }
        return {}
    }

    const fieldRules: any = (rules: any, defs: any) => {
        let arr = {};
        let mdl = {};
        // 模型名称获取
        map(defs, function (item) {
            set(mdl, get(item, 'field.name'), get(item, 'item.label'))
        })

        defines.value = mdl;

        for (let field in rules) {
            set(arr, field, parseRules(field, get(rules, field)))
        }

        console.log(arr, 'parsed-rules')
        return arr;
    }

    /**
     * 将规则进行合并
     * @param rules
     */
    const combinedRules = (rules: any[]) => {
        let comp = {};
        each(rules, (fieldRules, field: string) => {
            let ruleNames = map(fieldRules, (rule) => get(rule, 'name'))
            let type = rulesType(ruleNames);
            set(comp, field, fieldRules.map((rule: any) => {
                return combineRule(type, field, rule);
            }));
        });

        each(append.value, (rules, field: string) => {
            let oriFieldRules = get(comp, field, []);
            set(comp, field, union(oriFieldRules, rules));
        })
        console.log(comp, 'schema');
        return comp;
    }

    const parseSchema = () => {
        let prs = fieldRules(rules.value, items.value);
        parsedRules.value = prs;
        schema.value = combinedRules(prs);
    }

    watch(() => rules.value, () => {
        parseSchema();
    }, { deep: true })

    onMounted(() => {
        parseSchema();
    });

    return {
        schema
    }
}