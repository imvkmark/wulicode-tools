import { get, set } from 'lodash-es';
import type { Rule, Rules } from 'async-validator';
import { sprintf } from '@/utils/str';
import { isIpV4 } from '@/utils/net';

class AsyncRules {
    protected rules: Rules;

    /**
     * 自定义的消息 { username : {required : '请填写用户名'} }
     * @private
     */
    private customMessages: {};

    private defaultMessages: any = {
        required: '{0}必填',
        ip: '{0}必须是正确的IP地址'
    }

    /**
     * 模型数据, 用于替换默认的英文提示
     * @private
     */
    private model: {};

    constructor(rules: object, model = {}, customMessages = {}) {
        this.rules = this.parseFields(rules);
        this.model = model;
        // this.failedRules = [];
        // this.errors = null;
        // this.customRules = {};
        // this.defaultMessages = newMessage
        this.customMessages = customMessages;
        // this.customNames = customNames;
        // this.customValues = {};
    }

    static make(rules: object, customMessages = []) {
        return new AsyncRules(rules, customMessages);
    }

    getRules() {
        return this.rules;
    }

    parseFields(rules: any) {
        let self = this;
        let arr = {};

        for (let field in rules) {
            set(arr, field, self.parseRules(rules[field], field))
        }
        return arr;
    }

    /**
     * 解析一条规则
     * @param itemRules
     * @param field
     */
    parseRules(itemRules: string | string[], field: string) {
        let self = this;
        let rules = <any>[];
        let from;
        if (typeof itemRules === 'string') {
            from = itemRules.split('|');
        } else {
            from = itemRules;
        }
        from.forEach(function (ruleAndArgs) {
            if (ruleAndArgs.trim()) {
                let args = ruleAndArgs.split(':');
                let rule = self.findRuleMethod(
                    field,
                    self.titleCase(args[0], '_'),
                    args[1] ? args[0] === 'regex' ? args[1] : args[1].split(',') : []
                );
                let message = get(self.customMessages, `${field}.${args[0]}`);
                if (message) {
                    rule = Object.assign(rule, { message })
                }
                rules.push(rule)
            }
        });
        return rules;
    }


    /**
     * 标题转换为大写形式
     * @param str
     * @param delimiter
     */
    titleCase(str: string, delimiter: string) {
        let del = delimiter || ' ';
        return str
            .split(del)
            .map(function (item) {
                return item[0].toUpperCase() + item.slice(1).toLowerCase();
            })
            .join('');
    }

    /**
     * 查找验证规则
     * @param field
     * @param rule
     * @param params
     */
    findRuleMethod(field: string, rule: string, params: string[] | string) {
        let self = this;
        let method = get(self, `validate${rule}`)
        if (typeof method !== 'function') {
            console.error(
                '"' + rule + '" validation rule does not exist!'
            );
        }
        return method.apply(this, [field, params])
    }

    /**
     * 验证必填
     * @param field
     */
    validateRequired(field: string): Rule {
        return {
            required: true,
            message: () => {
                return sprintf(this.defaultMessages.required, this.fieldTitle(field));
            }
        }
    }

    /**
     * 验证IP
     * @param field
     */
    validateIp(field: string): Rule {
        return {
            validator: (rule, value, callback) => {
                if (!isIpV4(value)) {
                    callback(new Error(sprintf(this.defaultMessages.ip, this.fieldTitle(field))));  // reject with error message
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 字段标题
     * @param field
     */
    fieldTitle(field: string) {
        return get(this.model, field) ? get(this.model, field) : field;
    }
}

export default AsyncRules;