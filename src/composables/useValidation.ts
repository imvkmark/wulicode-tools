import { clone, difference, each, endsWith, find, get, includes, indexOf, keys, map, set, startsWith } from 'lodash-es';
import { onMounted, Ref, ref, toRefs, watch } from 'vue';
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
    sprintf,
    toDayjsFormat
} from '@/utils/helper';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import IsSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import IsSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(customParseFormat)
dayjs.extend(IsSameOrAfter)
dayjs.extend(IsSameOrBefore)

/**
 * 参考Laravel的验证规则
 * https://learnku.com/docs/laravel/6.x/validation/5144#c58a91
 * https://github.com/yiminghe/async-validator/blob/master/src/messages.ts
 */
export default function useValidation(props: any, model = <Ref>{}) {

    const { items } = toRefs(props);

    const defines = ref({});

    const plainRules = ref({});

    /**
     * 所有的验证规则
     * @private
     */
    const schema = ref({});

    /**
     * todo 待确定
     * 自定义的消息 { username : {required : '请填写用户名'} }
     */


    const setTo = (field: string, rule: Rule) => {
        let cloneSchema = clone(schema.value);
        let obj = get(cloneSchema, field, []);
        obj.push(rule);
        set(cloneSchema, field, obj);
        schema.value = cloneSchema;
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
    const toPlainRules = (field: string, itemRules: string | string[]) => {
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

    const defaultMessages: any = {
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
        date_format: '字段{0}需要是形如{1}的日期格式',
        after: '验证字段{0}必须是给定日期{1}之后的值',
        required_if: '字段{0}是{1}时候,本字段不能为空',
        required_unless: '字段{0}不是{1}时候,本字段不能为空',
        required_with: '其他任一指定字段{0}出现时，本字段不能为空',
        required_with_all: '其他全部指定字段{0}出现时，本字段不能为空',
        required_without: '其他任一指定字段{0}不出现时，本字段不能为空',
        required_without_all: '其他全部指定字段{0}不出现时，本字段不能为空',
        error: {
            date_empty: '{0}必须存在值才可以被比较',
            not_date: '{0}字段必须是日期形式',
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
     * @param field
     */
    const fieldType = (field: string) => {
        let rules = get(plainRules.value, field);
        let names = map(rules, (rule) => get(rule, 'name'))
        if (includes(names, 'numeric') || includes(names, 'integer')) {
            return 'numeric';
        } else if (includes(names, 'array')) {
            return 'array';
        } else if (includes(names, 'string')) {
            return 'string';
        } else if (includes(names, 'date') || includes(names, 'date_format')) {
            return 'date';
        }
        return '';
    }

    /**
     * 字段的日期格式
     * @param field
     */
    const dateFormat = (field: string) => {
        let rules = get(plainRules.value, field);
        if (fieldType(field) === 'date') {
            if (find(rules, { name: 'date' })) {
                return 'YYYY-MM-DD';
            }
            let df = find(rules, { name: 'date_format' });
            return toDayjsFormat(get(df, 'params')[0]);
        }
        return false;
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
    const validateString = (field: string) => {
        setTo(field, {
            type: 'string',
            validator(rule, value, callback) {
                if (value && typeof value !== 'string') {
                    callback(sprintf(defaultMessages.string, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }


    const validateArray = (field: string) => {
        setTo(field, {
            type: 'array',
            validator(rule, value, callback) {
                if (value && !Array.isArray(value)) {
                    callback(sprintf(defaultMessages.array, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * 完全由字母构成
     */
    const validateAlpha = (field: string) => {
        setTo(field, {
            validator(rule, value, callback) {
                if (value && !isAlpha(value)) {
                    callback(sprintf(defaultMessages.alpha, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * 验证字段可能包含字母、数字，以及破折号 (-) 和下划线 ( _ )。
     */
    const validateAlphaDash = (field: string) => {
        setTo(field, {
            validator(rule, value, callback) {
                if (value && !isAlphaDash(value)) {
                    callback(sprintf(defaultMessages.alphaDash, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * 验证字段必须是完全是字母、数字
     */
    const validateAlphaNum = (field: string) => {
        setTo(field, {
            validator(rule, value, callback) {
                if (value && !isAlphaNum(value)) {
                    callback(sprintf(defaultMessages.alphaNum, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * 验证必填
     */
    const validateRequired = (field: string) => {
        setTo(field, {
            required: true,
            validator(rule, value, callback) {
                if (!value) {
                    callback(sprintf(defaultMessages.required, label(rule.field)));
                } else {
                    callback();
                }
            }
        });
    }
    /**
     * 验证必须存在, 单可以为空
     */
    const validatePresent = (field: string) => {
        setTo(field, {
            required: true,
            validator(rule, value, callback) {
                if (typeof value === 'undefined') {
                    callback(sprintf(defaultMessages.present, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * 必须是邮箱
     */
    const validateEmail = (field: string) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value && !isEmail(value)) {
                    callback(sprintf(defaultMessages.email, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * 正确的身份证信息
     */
    const validateChid = (field: string) => {
        setTo(field, {
            validator(rule, value, callback) {
                if (value && !isChid(value)) {
                    callback(sprintf(defaultMessages.chid, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * 验证值是否在验证之列
     * @param field
     * @param fieldRule
     */
    const validateIn = (field: string, fieldRule: {}) => {
        let values = get(fieldRule, 'params');
        let type = fieldType(field)
        setTo(field, {
            validator(rule, value, callback) {
                if (!value) {
                    callback();
                }

                // 数组中值不存在
                if (Array.isArray(value) && type === 'array') {
                    let arr = difference(value, values);
                    if (arr.length !== 0) {
                        callback(sprintf(defaultMessages.in, label(rule.field), values.toString()));
                    }
                }

                // 不在之中
                if (!(indexOf(values, value) >= 0)) {
                    callback(sprintf(defaultMessages.in, label(rule.field), values.toString()));
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * 不在允许的范围内
     * @param field
     * @param fieldRule
     */
    const validateNotIn = (field: string, fieldRule: {}) => {
        let values = get(fieldRule, 'params');
        setTo(field, {
            validator(rule, value, callback) {
                if (value && indexOf(values, value) >= 0) {
                    callback(sprintf(defaultMessages.notIn, label(rule.field), values.toString()));
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * 验证IP
     */
    const validateIp = (field: string) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value && !(isIpV4(value) || isIpV6(value))) {
                    callback(sprintf(defaultMessages.ip, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    const validateIpV4 = (field: string) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value && !isIpV4(value)) {
                    callback(sprintf(defaultMessages.ipv4, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    const validateIpV6 = (field: string) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value && !isIpV6(value)) {
                    callback(sprintf(defaultMessages.ipv6, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * 数值类型
     */
    const validateNumeric = (field: string) => {
        setTo(field, {
            validator(rule, value, callback) {
                if (value && !isNumeric(value)) {
                    callback(sprintf(defaultMessages.numeric, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * 验证是否是一个Url
     */
    const validateUrl = (field: string) => {
        setTo(field, {
            validator(rule, value, callback) {
                if (value && !isUrl(value)) {
                    callback(sprintf(defaultMessages.url, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    const validateInteger = (field: string) => {
        setTo(field, {
            validator(rule, value, callback) {
                if (value && !isInteger(value)) {
                    callback(sprintf(defaultMessages.integer, label(rule.field)));
                } else {
                    callback();
                }
            }
        })
    }

    const validateMax = (field: string, fieldRule: {}) => {
        let type = fieldType(field);
        setTo(field, {
            validator(rule, value, callback) {
                let size = Number.parseFloat(get(fieldRule, 'params')[0]);
                if (!isNumeric(size)) {
                    callback(sprintf(defaultMessages.error.max, label(rule.field), size))
                }
                if (!value) {
                    callback();
                }
                const valSize = valueSize(value, type);
                if (valSize > size) {
                    let tip = defaultMessages.max.string;
                    if (type === 'numeric') {
                        tip = defaultMessages.max.numeric;
                    }
                    callback(sprintf(tip, label(rule.field), size))
                }
                callback();
            }
        })
    }

    const validateSize = (field: string, fieldRule: {}) => {
        let type = fieldType(field);
        setTo(field, {
            validator(rule, value, callback) {
                let size = get(fieldRule, 'params')[0];
                if (!isInteger(size)) {
                    callback(sprintf(defaultMessages.error.size, label(rule.field), size))
                }
                if (!value) {
                    callback()
                }
                const valSize = valueSize(value, type);
                if (valSize !== size) {
                    let tip = defaultMessages.size.string;
                    if (type === 'numeric') {
                        tip = defaultMessages.size.numeric;
                    }
                    callback(sprintf(tip, label(rule.field), size))
                }
                callback()
            }
        })
    }

    /**
     * 检测最小值
     * @param field
     * @param fieldRule
     */
    const validateMin = (field: string, fieldRule: {}) => {
        let type = fieldType(field);
        setTo(field, {
            validator(rule, value, callback) {
                let size = get(fieldRule, 'params')[0];
                if (!isNumeric(size)) {
                    callback(sprintf(defaultMessages.error.min, label(rule.field), size))
                }
                if (!value) {
                    callback()
                }
                const valSize = valueSize(value, type);
                if (valSize < size) {
                    let tip = defaultMessages.min.string;
                    if (type === 'numeric') {
                        tip = defaultMessages.min.numeric;
                    }
                    callback(sprintf(tip, label(rule.field), size))
                }
                callback()
            }
        })
    }

    /**
     *
     * @param field
     * @param fieldRule
     */
    const validateBetween = (field: string, fieldRule: {}) => {
        let type = fieldType(field);
        setTo(field, {
            validator(rule, value, callback) {
                let start = get(fieldRule, 'params')[0];
                let end = get(fieldRule, 'params')[1];
                if (!isNumeric(start) || !isNumeric(end)) {
                    callback(sprintf(defaultMessages.error.between, label(rule.field), start, end))
                }
                if (!value) {
                    callback();
                }
                const valSize = valueSize(value, type);
                let startVal = Number.parseFloat(start);
                let endVal = Number.parseFloat(end);
                if (startVal > valSize || endVal < valSize) {
                    let tip = defaultMessages.between.string;
                    if (type === 'numeric') {
                        tip = defaultMessages.between.numeric;
                    }
                    callback(sprintf(tip, label(rule.field), startVal, endVal))
                }
                callback()
            }
        })
    }

    /**
     * 长度是 size 大小的正整数
     * @param field
     * @param fieldRule
     */
    const validateDigits = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator(rule, value, callback) {
                let size = get(fieldRule, 'params')[0];
                if (!isNumeric(size)) {
                    callback(sprintf(defaultMessages.error.digits, label(rule.field), size))
                }
                if (value) {
                    let length = String(value).length;
                    if (/[^0-9]/.test(value) || Number.parseInt(size) !== length) {
                        callback(sprintf(defaultMessages.digits, label(rule.field), size))
                    }
                    callback()
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * 验证数据长度在范围内
     * @param field
     * @param fieldRule
     */
    const validateDigitsBetween = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator(rule, value, callback) {
                let min = get(fieldRule, 'params')[0];
                let max = get(fieldRule, 'params')[1];
                if (!isNumeric(min) || !isNumeric(max)) {
                    callback(sprintf(defaultMessages.error.digits_between, label(rule.field), min, max))
                }
                if (value) {
                    let length = String(value).length;
                    if (/[^0-9]/.test(value) || Number.parseInt(min) > length || Number.parseInt(max) < length) {
                        callback(sprintf(defaultMessages.digits, label(rule.field), min, max))
                    }
                    callback()
                } else {
                    callback();
                }
            }
        })
    }

    /**
     * Accept : 必须是有值的
     * 这里值是 yes/on/1/true
     */
    const validateAccepted = (field: string) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                let accepted = ['yes', 'on', '1', 1, true, 'true'];
                if (!(indexOf(accepted, value) >= 0)) {
                    callback(sprintf(defaultMessages.accepted, label(rule.field)));
                }
                callback();
            }
        })
    }

    const validateFilled = (field: string) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (typeof value !== 'undefined' && value !== null) {
                    if (!value) {
                        callback(sprintf(defaultMessages.filled, label(rule.field)));
                    }
                }
                callback();
            }
        })
    }

    /**
     * 验证布尔值
     * @param field
     */
    const validateBoolean = (field: string) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                let acceptable = [true, false, 0, 1, '0', '1'];
                if (!(value === null || acceptable.indexOf(value) >= 0)) {
                    callback(sprintf(defaultMessages.boolean, label(rule.field)))
                }
                callback()
            }
        })
    }

    /**
     * 验证日期(Y-m-d)
     * @param field
     */
    const validateDate = (field: string) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value && !dayjs(value, 'YYYY-MM-DD', true).isValid()) {
                    callback(sprintf(defaultMessages.date, label(rule.field)))
                }
                callback()
            }
        })
    }

    const validateDateFormat = (field: string, fieldRule: {}) => {
        let format = get(fieldRule, 'params')[0];
        setTo(field, {
            validator: (rule, value, callback) => {
                let dayFormat = toDayjsFormat(format);
                if (value && !dayjs(value, dayFormat, true).isValid()) {
                    callback(sprintf(defaultMessages.date_format, label(rule.field), dayFormat))
                }
                callback()
            }
        })
    }

    /**
     * 验证是 Json 字串
     * @param field
     */
    const validateJson = (field: string) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    try {
                        JSON.parse(value);
                        callback();
                    } catch (err) {
                        callback(sprintf(defaultMessages.json, label(rule.field)));
                    }
                }
                callback();
            }
        })
    }

    /**
     * 验证正则匹配的数据
     * @param field
     * @param fieldRule
     */
    const validateRegex = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let param = get(fieldRule, 'params')[0];
                    if (!regexTest(value, param)) {
                        callback(sprintf(defaultMessages.regex, label(rule.field)));
                    }
                }
                callback();
            }
        })
    }

    /**
     * 验证非正则匹配的数据
     * @param field
     * @param fieldRule
     */
    const validateNotRegex = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let param = get(fieldRule, 'params')[0];
                    if (regexTest(value, param)) {
                        callback(sprintf(defaultMessages.not_regex, label(rule.field)));
                    }
                }
                callback();
            }
        })
    }

    const validateStartsWith = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let param = get(fieldRule, 'params')[0];
                    if (!startsWith(value, param)) {
                        callback(sprintf(defaultMessages.starts_with, label(rule.field), param));
                    }
                }
                callback();
            }
        })
    }
    const validateEndsWith = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let param = get(fieldRule, 'params')[0];
                    if (!endsWith(value, param)) {
                        callback(sprintf(defaultMessages.ends_with, label(rule.field), param));
                    }
                }
                callback();
            }
        })
    }

    /**
     * 验证非正则匹配的数据
     * @param field
     * @param fieldRule
     */
    const validateSame = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (value !== fieldVal) {
                        callback(sprintf(defaultMessages.same, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        })
    }
    /**
     * 验证非正则匹配的数据
     * @param field
     * @param fieldRule
     */
    const validateDifferent = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (value === fieldVal) {
                        callback(sprintf(defaultMessages.different, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        })
    }

    const validateGt = (field: string, fieldRule: {}) => {
        let type = fieldType(field);
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (!(valueSize(value, type) > valueSize(fieldVal, type))) {
                        callback(sprintf(defaultMessages.gt, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        })
    }
    const validateGte = (field: string, fieldRule: {}) => {
        let type = fieldType(field);
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (!(valueSize(value, type) >= valueSize(fieldVal, type))) {
                        callback(sprintf(defaultMessages.gte, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        })
    }

    const validateLte = (field: string, fieldRule: {}) => {
        let type = fieldType(field);
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (!(valueSize(value, type) <= valueSize(fieldVal, type))) {
                        callback(sprintf(defaultMessages.lte, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        })
    }

    const validateLt = (field: string, fieldRule: {}) => {
        let type = fieldType(field);
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let field = get(fieldRule, 'params')[0];
                    let fieldVal = get(model.value, field);
                    if (!(valueSize(value, type) < valueSize(fieldVal, type))) {
                        callback(sprintf(defaultMessages.lt, label(rule.field), label(field)));
                    }
                }
                callback();
            }
        })
    }


    const validateAfter = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let aimField = get(fieldRule, 'params')[0];
                    let aimVal = get(model.value, aimField);
                    let format = dateFormat(aimField);
                    if (!aimVal) {
                        callback(sprintf(defaultMessages.error.date_empty, label(aimField)));
                    }
                    if (format) {
                        if (!dayjs(value, format, true).isValid()) {
                            callback(sprintf(defaultMessages.date, label(field)));
                        }
                        if (!dayjs(value, format).isAfter(dayjs(aimVal, format))) {
                            callback(sprintf(defaultMessages.after, label(field), label(aimField)));
                        }
                    } else {
                        callback(sprintf(defaultMessages.error.not_date, label(aimField)));
                    }
                }
                callback();
            }
        })
    }

    const validateBefore = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let aimField = get(fieldRule, 'params')[0];
                    let aimVal = get(model.value, aimField);
                    let format = dateFormat(aimField);
                    if (!aimVal) {
                        callback(sprintf(defaultMessages.error.date_empty, label(aimField)));
                    }
                    if (format) {
                        if (!dayjs(value, format, true).isValid()) {
                            callback(sprintf(defaultMessages.date, label(field)));
                        }
                        if (!dayjs(value, format).isBefore(dayjs(aimVal, format))) {
                            callback(sprintf(defaultMessages.after, label(field), label(aimField)));
                        }
                    } else {
                        callback(sprintf(defaultMessages.error.not_date, label(aimField)));
                    }
                }
                callback();
            }
        })
    }


    const validateAfterOrEqual = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let aimField = get(fieldRule, 'params')[0];
                    let aimVal = get(model.value, aimField);
                    let format = dateFormat(aimField);
                    if (!aimVal) {
                        callback(sprintf(defaultMessages.error.date_empty, label(aimField)));
                    }
                    if (format) {
                        if (!dayjs(value, format, true).isValid()) {
                            callback(sprintf(defaultMessages.date, label(field)));
                        }
                        if (!dayjs(value, format).isSameOrAfter(dayjs(aimVal, format))) {
                            callback(sprintf(defaultMessages.after, label(field), label(aimField)));
                        }
                    } else {
                        callback(sprintf(defaultMessages.error.not_date, label(aimField)));
                    }
                }
                callback();
            }
        })
    }

    const validateBeforeOrEqual = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                if (value) {
                    let aimField = get(fieldRule, 'params')[0];
                    let aimVal = get(model.value, aimField);
                    let format = dateFormat(aimField);
                    if (!aimVal) {
                        callback(sprintf(defaultMessages.error.date_empty, label(aimField)));
                    }
                    if (format) {
                        if (!dayjs(value, format, true).isValid()) {
                            callback(sprintf(defaultMessages.date, label(field)));
                        }
                        if (!dayjs(value, format).isSameOrBefore(dayjs(aimVal, format))) {
                            callback(sprintf(defaultMessages.after, label(field), label(aimField)));
                        }
                    } else {
                        callback(sprintf(defaultMessages.error.not_date, label(aimField)));
                    }
                }
                callback();
            }
        })
    }

    /**
     * 验证当 字段 为指定值时候, 本字段不能为空
     * @param field
     * @param fieldRule
     */
    const validateRequiredIf = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                let field = get(fieldRule, 'params')[0];
                let fieldVal = get(model.value, field);
                let allowed = get(fieldRule, 'params', []).slice(1);
                if (indexOf(allowed, fieldVal) >= 0 && !value) {
                    callback(sprintf(defaultMessages.required_if, label(field), allowed.toString()));
                }
                callback();
            }
        })
    }

    const validateRequiredWith = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                let params = get(fieldRule, 'params');
                console.log(value, params);
                if (!isRequiredWith(value, params)) {
                    callback(sprintf(defaultMessages.required_with, label(params)));
                }
                callback();
            }
        })
    }
    const validateRequiredWithAll = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                let params = get(fieldRule, 'params');
                if (!isRequiredWithAll(value, params)) {
                    callback(sprintf(defaultMessages.required_with_all, label(params)));
                }
                callback();
            }
        })
    }
    const validateRequiredWithout = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                let params = get(fieldRule, 'params');
                if (!isRequiredWithout(value, params)) {
                    callback(sprintf(defaultMessages.required_without, label(params)));
                }
                callback();
            }
        })
    }

    const validateRequiredWithoutAll = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                let params = get(fieldRule, 'params');
                if (!isRequiredWithoutAll(value, params)) {
                    callback(sprintf(defaultMessages.required_without_all, label(params)));
                }
                callback();
            }
        })
    }

    /**
     * 验证当 字段 不为指定值时候, 本字段不能为空
     * @param field
     * @param fieldRule
     */
    const validateRequiredUnless = (field: string, fieldRule: {}) => {
        setTo(field, {
            validator: (rule, value, callback) => {
                let field = get(fieldRule, 'params')[0];
                let fieldVal = get(model.value, field);
                let allowed = get(fieldRule, 'params', []).slice(1);
                if (!(indexOf(allowed, fieldVal) >= 0) && !value) {
                    callback(sprintf(defaultMessages.required_unless, label(field), allowed.toString()));
                }
                callback();
            }
        })
    }

    /**
     * 验证存在值并一致
     * @param field
     */
    const validateConfirmed = (field: string) => {
        let fieldConfirm = `${field}_confirmation`;
        setTo(fieldConfirm, {
            validator: (rule: any, value: any, callback: any) => {
                if (value) {
                    let oriField = String(get(rule, 'field'))
                    let thatField = oriField.slice(0, oriField.indexOf('_confirmation'));
                    let fieldTitle = label(oriField)
                    let thatFieldTitle = label(thatField)
                    let fieldVal = get(model.value, thatField);
                    if (value !== fieldVal) {
                        callback(sprintf(defaultMessages.same, fieldTitle, thatFieldTitle));
                    }
                }
                callback();
            }
        });
    }

    /**
     * 独立的规则
     */
    const rulesMap = {
        // independent
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
        'date_format': validateDateFormat,
        'json': validateJson,
        'alpha_num': validateAlphaNum,
        'email': validateEmail,
        'digits': validateDigits,
        'digits_between': validateDigitsBetween,
        'chid': validateChid,
        'string': validateString,
        'accepted': validateAccepted,

        // typed
        'max': validateMax,
        'min': validateMin,
        'between': validateBetween,
        'size': validateSize,
        'in': validateIn,
        'not_in': validateNotIn,

        // dependent
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


    const parseRules: any = () => {
        /* 模型
         * ---------------------------------------- */
        let mdl = {};
        map(items.value, function (item) {
            set(mdl, get(item, 'field.name'), get(item, 'item.label'))
        })
        defines.value = mdl;

        /* 规则
         * ---------------------------------------- */
        let arr = {};
        for (let item of items.value) {
            let field = get(item, 'field.name');
            let rules = get(item, 'rules', []);
            if (rules.length) {
                set(arr, field, toPlainRules(field, rules))
            }
        }
        plainRules.value = arr;

        /* 解析
         * ---------------------------------------- */
        each(plainRules.value, (fieldRules: any, field: string) => {
            each(fieldRules, (rule: any) => {
                let name = get(rule, 'name');
                if (includes(keys(rulesMap), name)) {
                    get(rulesMap, name)(field, rule);
                } else {
                    console.error(
                        '"' + name + '" validation rule does not exist!'
                    );
                }
            })
        });
    }

    watch(() => items.value, () => {
        parseRules();
    }, { deep: true })

    onMounted(() => {
        parseRules();
    });

    return {
        schema
    }
}