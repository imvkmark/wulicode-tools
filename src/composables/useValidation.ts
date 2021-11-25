import { clone, each, get, includes, keys, map, set, union } from 'lodash-es';
import {
    defaultMsgs,
    fieldRules,
    rulesType,
    validateAccepted,
    validateAlpha,
    validateAlphaDash,
    validateAlphaNum,
    validateArray,
    validateBetween,
    validateBoolean,
    validateChid,
    validateDate,
    validateDigits,
    validateDigitsBetween,
    validateEmail,
    validateIn,
    validateInteger,
    validateIp,
    validateIpV4,
    validateIpV6,
    validateJson,
    validateMax,
    validateMin,
    validateNotIn,
    validateNotRegex,
    validateNumeric,
    validateRegex,
    validateRequired,
    validateSize,
    validateString,
    validateUrl
} from '@/utils/validate';
import { onMounted, Ref, ref, toRefs, watch } from 'vue';
import { Rule } from 'async-validator';
import { sprintf } from '@/utils/helper';

/**
 * 参考Laravel的验证规则
 * https://learnku.com/docs/laravel/6.x/validation/5144#c58a91
 * https://github.com/yiminghe/async-validator/blob/master/src/messages.ts
 */
export default function useValidation(props: any, model = <Ref>{}) {

    const { rules, items } = toRefs(props);

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

    /**
     * 独立的规则, 不依附于其他字段的存在
     */
    const independentRules = {
        'array': validateArray,
        'required': validateRequired,
        'ip': validateIp,
        'ipv4': validateIpV4,
        'boolean': validateBoolean,
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
                        callback(sprintf(defaultMsgs.same, get(fieldRule, 'title')));
                    }
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
            /* 对之前数据的验证 [双向验证]
             * ---------------------------------------- */
            ori.push({
                validator: (rule: any, value: any, callback: any) => {
                    if (value) {
                        let oriField = String(get(rule, 'field'))
                        let thatField = oriField.slice(0, oriField.indexOf('_confirmation'));
                        let defs = get(fieldRule, 'model');
                        let fieldTitle = get(defs, oriField)
                        let thatFieldTitle = get(defs, thatField)
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
        return {
            validator: (rule, value, callback) => {
                if (value) {
                    let defs = get(fieldRule, 'model');
                    let confirmFieldTitle = get(defs, fieldConfirm)
                    let confirmFieldVal = get(model.value, fieldConfirm);
                    if (!confirmFieldVal) {
                        callback();
                    }
                    if (value !== confirmFieldVal) {
                        callback(sprintf(defaultMsgs.same, get(fieldRule, 'title'), confirmFieldTitle));
                    }
                }
                callback();
            }
        }
    }

    const dependentRules = {
        'confirmed': validateConfirmed,
        'same': validateSame
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
        let parsedRules = fieldRules(rules.value, items.value);
        schema.value = combinedRules(parsedRules);
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