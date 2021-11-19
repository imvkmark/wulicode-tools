// @ts-ignore
import assert from 'assert';
import Rules from '../src/utils/rules';
import Schema from 'async-validator';
import { regexTest } from '../src/utils/str';

describe('Validation', function () {
    describe('required', function () {
        // laravel rules
        let data = {
            name: ['required', 'chid']
            // age: ['required']
        }
        let rules = Rules.make(data);
        console.log(rules);
        const validator = new Schema(rules);
        validator.validate({ name: 'Firstname' }, (errors, fields) => {
            if (errors) {

            }
            // validation passed
        });
        it('1 rules', function () {
            // assert.equal(Array(get(rules, 'name')).length, 1);
            // assert.equal(Array(get(rules, 'age')).length, 1);
            // let rule = find(get(rules, 'name'), (rule) => {
            //     return get(rule, 'required')
            // })
            // expect(rule).toMatchObject({
            //     required: true
            // })
        });
    });
    describe('regex-match', function () {
        console.log(regexTest(['5'], /\d+/i))
    });
});