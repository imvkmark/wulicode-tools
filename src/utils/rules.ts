import { each, get, includes, isBoolean, isString, keys, map, set, toLower } from 'lodash-es';
import type { Rule } from 'async-validator';
import { isAlpha, isAlphaDash, isAlphaNum, isChid, isEmail, isIpV4, isNumeric, sprintf } from '@/utils/helper';

/**
 * 参考Laravel的验证规则
 * https://learnku.com/docs/laravel/6.x/validation/5144#c58a91
 * https://github.com/yiminghe/async-validator/blob/master/src/messages.ts
 */
class AsyncRules {
    /**
     * 解析的规则
     * @protected
     */
    protected rules = <any>[];

    /**
     * 自定义的消息 { username : {required : '请填写用户名'} }
     * @private
     */
    private customMessages: {};

    private defaultMessages: any = {
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
        before: '{0}日期必须在{1}日期之前',
    }

    /**
     * 模型数据, 用于替换默认的英文提示
     * @private
     */
    protected model: {};

    /**
     * 所有的验证规则
     * @private
     */
    private schema: {};

    constructor(rules: object, model = {}, customMessages = {}) {
        this.rules = this.parse(rules);
        this.schema = {}
        this.model = model;
        // this.failedRules = [];
        // this.errors = null;
        // this.customRules = {};
        this.customMessages = customMessages;
        // this.customNames = customNames;
        // this.customValues = {};
    }

    static make(rules: object, model = {}, customMessages = []) {
        let obj = new AsyncRules(rules, model, customMessages);
        console.log('rule-string', obj.rules);
        return obj.combinedRules(obj.rules);
    }

    parse(rules: any) {
        let self = this;
        let arr = {};

        for (let field in rules) {
            set(arr, field, self.parseRules(field, get(rules, field)))
        }
        return arr;
    }

    /**
     * 解析一个字段的所有规则
     * @param itemRules
     * @param field
     */
    parseRules(field: string, itemRules: string | string[]) {
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
     * 将规则进行合并
     * @param rules
     */
    combinedRules(rules: any[]) {
        const self = this;
        let comp = {};
        each(rules, (filedRules, field: string) => {
            let ruleNames = map(filedRules, (rule) => get(rule, 'name'))
            let type = self.rulesType(ruleNames);

            // 默认 String 类型, 但是没有规则, 添加 String 规则
            set(comp, field, filedRules.map((rule: any) => {
                return self.combineRule(type, field, rule);
            }));
        });
        return comp;
    }

    /**
     * 返回规则的类型, 根据不同的类型过滤不同的规则
     * @param ruleNames
     */
    rulesType(ruleNames: string[]) {
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
     * 独立的规则, 不依附于其他字段的存在
     */
    independentRules() {
        return {
            'array': this.validateArray(),
            'required': this.validateRequired(),
            'ip': this.validateIp(),
            'numeric': this.validateNumeric(),
            'alpha': this.validateAlpha(),
            'alpha_dash': this.validateAlphaDash(),
            'alpha_num': this.validateAlphaNum(),
            'email': this.validateEmail(),
            'chid': this.validateChid(),
            'string': this.validateString(),
            'accepted': this.validateAccepted()
        };
    }

    get dependentRules() {
        return [];
    }

    /**
     * 标题转换为大写形式
     * @param str
     */
    capitalCase(str: string) {
        return str
            .split('_')
            .map(function (item) {
                return item[0].toUpperCase() + item.slice(1).toLowerCase();
            })
            .join('');
    }

    /**
     * 查找验证规则
     * @param type
     * @param field
     * @param rule
     */
    combineRule(type: string, field: string, rule = {}) {
        let that = this;
        let capitalName = this.capitalCase(get(rule, 'name'));
        let methodName = `validate${capitalName}`;
        let method = get(that, methodName)

        if (includes(keys(that.independentRules()), get(rule, 'name'))) {
            if (typeof method !== 'function') {
                console.error(
                    '"' + rule + '" validation rule does not exist!'
                );
            }
            return method.apply(that);
        }
        return {}
    }

    /**
     * 字串类型
     */
    validateString(): Rule {
        let that = this;
        return {
            type: 'string',
            validator(rule, value, callback) {
                if (value && typeof value !== 'string') {
                    callback(sprintf(that.defaultMessages.string, that.fieldTitle(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    validateArray(): Rule {
        let that = this;
        return {
            type: 'array',
            validator(rule, value, callback) {
                if (value && !Array.isArray(value)) {
                    callback(sprintf(that.defaultMessages.array, that.fieldTitle(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 完全由字母构成
     */
    validateAlpha(): Rule {
        let that = this;
        return {
            validator(rule, value, callback) {
                if (value && !isAlpha(value)) {
                    callback(sprintf(that.defaultMessages.alpha, that.fieldTitle(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证字段可能包含字母、数字，以及破折号 (-) 和下划线 ( _ )。
     */
    validateAlphaDash(): Rule {
        let that = this;
        return {
            validator(rule, value, callback) {
                if (value && !isAlphaDash(value)) {
                    callback(sprintf(that.defaultMessages.alphaDash, that.fieldTitle(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证字段必须是完全是字母、数字
     */
    validateAlphaNum(): Rule {
        let that = this;
        return {
            validator(rule, value, callback, source, options) {
                console.log(rule, value, source, options, 'alpha-num')
                if (value && !isAlphaNum(value)) {
                    callback(sprintf(that.defaultMessages.alphaNum, that.fieldTitle(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证必填
     */
    validateRequired(): Rule {
        let that = this;
        return {
            required: true,
            validator(rule, value, callback) {
                if (!value) {
                    callback(sprintf(that.defaultMessages.required, that.fieldTitle(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 必须是邮箱
     */
    validateEmail(): Rule {
        return {
            validator: (rule, value, callback) => {
                if (value && !isEmail(value)) {
                    callback(sprintf(this.defaultMessages.email, this.fieldTitle(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 正确的身份证信息
     */
    validateChid(): Rule {
        let that = this;
        return {
            validator(rule, value, callback) {
                if (value && !isChid(value)) {
                    callback(sprintf(that.defaultMessages.chid, that.fieldTitle(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证IP
     */
    validateIp(): Rule {
        let that = this;
        return {
            validator: (rule, value, callback) => {
                if (value && !isIpV4(value)) {
                    callback(sprintf(that.defaultMessages.ip, that.fieldTitle(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 数值类型
     */
    validateNumeric(): Rule {
        let that = this;
        return {
            validator(rule, value, callback) {
                if (value && !isNumeric(value)) {
                    callback(sprintf(that.defaultMessages.numeric, that.fieldTitle(rule.field)));
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
    validateAccepted(): Rule {
        return {
            validator: (rule, value, callback) => {
                let message = sprintf(this.defaultMessages.accepted, this.fieldTitle(rule.field));
                if (isNumeric(value) && value === 1) {
                    callback()
                } else if (isString(value) && includes(['yes', 'on', '1'], toLower(value))) {
                    callback();
                } else if (isBoolean(value) && value === true) {
                    callback();
                } else {
                    callback(message);
                }
            }
        }
    }

    /**
     * 字段标题
     * @param field
     */
    fieldTitle(field?: string) {
        if (!field) {
            return '';
        }
        return get(this.model, field) ? get(this.model, field) : field;
    }
}

export default AsyncRules;