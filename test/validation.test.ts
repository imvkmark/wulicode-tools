// @ts-ignore
import assert from 'assert';
import Rules from '../src/utils/rules';
import Schema from 'async-validator';

describe('Validation', function () {
    describe('required', function () {
        let strRule = 'required';

        let arrRule = ['required']

        // laravel rules
        let data = {
            name: 'required',
            age: ['required']
        }
        let Rule = Rules.make(data);
        let rules = Rule.getRules();
        console.log(rules);
        const validator = new Schema(rules);
        validator.validate({
            name: '',
            ag: 8
        }).then((resp) => {
            console.log(resp)
        }).catch((resp) => {
            console.log(resp)
        })
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});