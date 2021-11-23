// @ts-ignore
import assert from 'assert';
import Rules from '../src/utils/rules';
import Schema from 'async-validator';

describe('validator', () => {
    it('works-s', (done) => {
        console.log(Rules.make({
            name: 'required'
        }));
        (new Schema(Rules.make({
            name: 'required'
        }))).validate({ n: '' }, errors => {
            console.log(done);
            console.log(errors);
            done();
        }).then(() => {
            console.log('a')
            done()
        }).catch(() => {
            console.log('b')
            done()
        })
    })
});
//
describe('async-validator', () => {
    it('works', done => {
        new Schema({
            v: [
                {
                    validator(rule, value, callback) {
                        callback(new Error('e1'));
                    }
                },
                {
                    validator(rule, value, callback) {
                        callback(new Error('e2'));
                    }
                }
            ],
            v2: [
                {
                    validator(rule, value, callback) {
                        callback(new Error('e3'));
                    }
                }
            ],
            v3: [
                {
                    validator() {
                        return false;
                    }
                },
                {
                    validator() {
                        return new Error('e5');
                    }
                },
                {
                    validator() {
                        return false;
                    },
                    message: 'e6'
                },
                {
                    validator() {
                        return true;
                    }
                },
                // Customize with empty message
                {
                    validator() {
                        return false;
                    },
                    message: ''
                }
            ]
        }).validate(
            {
                v: 2
            },
            errors => {
                expect(errors.length).toBe(7);
                expect(errors[0].message).toBe('e1');
                expect(errors[1].message).toBe('e2');
                expect(errors[2].message).toBe('e3');
                expect(errors[3].message).toBe('v3 fails');
                expect(errors[4].message).toBe('e5');
                expect(errors[5].message).toBe('e6');
                expect(errors[6].message).toBe('');
                done();
            }
        );
    });
});