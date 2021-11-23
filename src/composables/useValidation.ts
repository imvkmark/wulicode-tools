import { each, get, includes, isBoolean, isString, keys, map, set, toLower } from 'lodash-es';
import { defaultMsgs, defTitle, fieldRules, rulesType } from '@/utils/validate';
import { onMounted, ref, toRefs, watch } from 'vue';
import { Rule } from 'async-validator';
import { isAlpha, isAlphaDash, isAlphaNum, isChid, isEmail, isIpV4, isNumeric, sprintf } from '@/utils/helper';

/**
 * 参考Laravel的验证规则
 * https://learnku.com/docs/laravel/6.x/validation/5144#c58a91
 * https://github.com/yiminghe/async-validator/blob/master/src/messages.ts
 */
export default function useValidation(props: any, defs = {}) {

    const { rules } = toRefs(props);

    /**
     * 所有的验证规则
     * @private
     */
    const schema = ref({});

    /**
     * todo 待确定
     * 自定义的消息 { username : {required : '请填写用户名'} }
     */

    /**
     * 字串类型
     */
    const validateString = (): Rule => {
        return {
            type: 'string',
            validator(rule, value, callback) {
                if (value && typeof value !== 'string') {
                    callback(sprintf(defaultMsgs.string, defTitle(defs, rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    const validateArray = (): Rule => {
        return {
            type: 'array',
            validator(rule, value, callback) {
                if (value && !Array.isArray(value)) {
                    callback(sprintf(defaultMsgs.array, defTitle(defs, rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 完全由字母构成
     */
    const validateAlpha = (): Rule => {
        return {
            validator(rule, value, callback) {
                if (value && !isAlpha(value)) {
                    callback(sprintf(defaultMsgs.alpha, defTitle(defs, rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证字段可能包含字母、数字，以及破折号 (-) 和下划线 ( _ )。
     */
    const validateAlphaDash = (): Rule => {
        return {
            validator(rule, value, callback) {
                if (value && !isAlphaDash(value)) {
                    callback(sprintf(defaultMsgs.alphaDash, defTitle(defs, rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证字段必须是完全是字母、数字
     */
    const validateAlphaNum = (): Rule => {
        return {
            validator(rule, value, callback) {
                if (value && !isAlphaNum(value)) {
                    callback(sprintf(defaultMsgs.alphaNum, defTitle(defs, rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证必填
     */
    const validateRequired = (): Rule => {
        return {
            required: true,
            validator(rule, value, callback) {
                if (!value) {
                    callback(sprintf(defaultMsgs.required, defTitle(defs, rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 必须是邮箱
     */
    const validateEmail = (): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value && !isEmail(value)) {
                    callback(sprintf(defaultMsgs.email, defTitle(rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 正确的身份证信息
     */
    const validateChid = (): Rule => {
        return {
            validator(rule, value, callback) {
                if (value && !isChid(value)) {
                    callback(sprintf(defaultMsgs.chid, defTitle(defs, rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 验证IP
     */
    const validateIp = (): Rule => {
        return {
            validator: (rule, value, callback) => {
                if (value && !isIpV4(value)) {
                    callback(sprintf(defaultMsgs.ip, defTitle(defs, rule.field)));
                } else {
                    callback();
                }
            }
        }
    }

    /**
     * 数值类型
     */
    const validateNumeric = (): Rule => {
        return {
            validator(rule, value, callback) {
                if (value && !isNumeric(value)) {
                    callback(sprintf(defaultMsgs.numeric, defTitle(defs, rule.field)));
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
    const validateAccepted = (): Rule => {
        return {
            validator: (rule, value, callback) => {
                let message = sprintf(defaultMsgs.accepted, defTitle(defs, rule.field));
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
     * 独立的规则, 不依附于其他字段的存在
     */
    const independentRules = {
        'array': validateArray,
        'required': validateRequired,
        'ip': validateIp,
        'numeric': validateNumeric,
        'alpha': validateAlpha,
        'alpha_dash': validateAlphaDash,
        'alpha_num': validateAlphaNum,
        'email': validateEmail,
        'chid': validateChid,
        'string': validateString,
        'accepted': validateAccepted
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
            return get(independentRules, name)();
        } else {
            console.error(
                '"' + name + '" validation rule does not exist!'
            );
        }
        return {}
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
        return comp;
    }


    watch(() => rules.value, (newVal) => {
        let parsedRules = fieldRules(newVal);
        schema.value = combinedRules(parsedRules);
    }, { deep: true })

    onMounted(() => {
        let parsedRules = fieldRules(rules.value);
        schema.value = combinedRules(parsedRules);
    });

    return {
        schema
    }
}