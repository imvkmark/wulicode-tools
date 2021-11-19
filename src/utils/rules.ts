import { each, find, get, includes, map, set } from 'lodash-es';
import type { Rule } from 'async-validator';
import { isNumeric, sprintf } from '@/utils/str';
import { isChid, isIpV4 } from '@/utils/net';

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
        required: '{0}必填',
        email: '{0}必须是邮箱',
        string: '{0}必须是字符串类型',
        ip: '{0}必须是正确的IP地址',
        chid: '{0}必须是正确的身份证号码',
        numeric: '{0}必须是数字'
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
        console.log(rules);
        let comp = {};
        each(rules, (filedRules, field: string) => {
            let ruleNames = map(filedRules, (rule) => get(rule, 'name'))
            let fieldType = self.rulesType(ruleNames);

            // 默认 String 类型, 但是没有规则, 添加 String 规则
            if (fieldType === 'string' && !find(filedRules, { name: 'string' })) {
                filedRules.push({ name: 'string', params: [] })
            }
            set(comp, field, filedRules.map((rule: any) => {
                return self.combineRule(fieldType, field, rule);
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
        }
        return 'string';
    }

    /**
     * 独立的规则, 不依附于其他字段的存在
     */
    independentRules() {
        return [
            'required',
            'ip',
            'numeric',
            'chid',
            'string'
        ];
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
        let self = this;
        let capitalName = this.capitalCase(get(rule, 'name'));
        let method = get(self, `validate${capitalName}`)

        if (includes(self.independentRules(), get(rule, 'name'))) {
            if (typeof method !== 'function') {
                console.error(
                    '"' + rule + '" validation rule does not exist!'
                );
            }
            return method.apply(self, [field, get(rule, 'params')])
        }
        return {}
    }

    /**
     * 字串类型
     * @param field
     */
    validateString(field: string): Rule {
        return {
            type: 'string',
            message: () => {
                return sprintf(this.defaultMessages.string, this.fieldTitle(field));
            }
        }
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
     * 必须是邮箱
     * @param field
     */
    validateEmail(field: string): Rule {
        return {
            type: 'email',
            message: () => {
                return sprintf(this.defaultMessages.email, this.fieldTitle(field));
            }
        }
    }

    /**
     * 正确的身份证信息
     * @param field
     */
    validateChid(field: string): Rule {
        return {
            validator: (rule, value, callback) => {
                if (value && !isChid(value)) {
                    callback(sprintf(this.defaultMessages.chid, this.fieldTitle(field)));
                } else {
                    callback();
                }
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
                if (value && !isIpV4(value)) {
                    callback(sprintf(this.defaultMessages.ip, this.fieldTitle(field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 数值类型
     * @param field
     */
    validateNumeric(field: string): Rule {
        return {
            validator: (rule, value, callback) => {
                if (value && !isNumeric(value)) {
                    callback(sprintf(this.defaultMessages.numeric, this.fieldTitle(field)));
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