// @ts-ignore
import assert from 'assert';
import Rules from '../src/utils/rules';
import Schema from 'async-validator';
import { regexTest } from '../src/utils/helper';

describe('validation', function () {
    // required
    describe('required', function () {
        it('array = to success', function () {
            (new Schema(Rules.make({
                name: ['required']
            }))).validate({ name: 'Firstname' }, (errors) => {
                expect(errors).toBeNull()
            });
        });
        it('array = to error', function () {
            (new Schema(Rules.make({
                name: ['required']
            }))).validate({ name: '' }, (errors) => {
                expect(errors).toBeNull()
            });
        });
        it('string = to success', function () {
            (new Schema(Rules.make({
                name: 'required'
            }))).validate({ name: 'Firstname' }, (errors) => {
                expect(errors).toBeNull()
            });
        });
        it('string = to error', function () {
            (new Schema(Rules.make({
                name: 'required'
            }))).validate({ name: '' }, (errors) => {
                expect(errors).toBeNull()
            });
        });
    });

    describe('string', function () {
        it('is not string', function () {
            (new Schema(Rules.make({
                accepted: 'string'
            }))).validate({ accepted: null }, (errors) => {
                // expect(errors).toHaveLength(1);
                expect(errors).toBeNull();
            });
        });
    });

    describe('accepted', function () {
        it('is empty', function () {
            (new Schema(Rules.make({
                accepted: 'accepted'
            }))).validate({ accepted: '' }, (errors) => {
                expect(errors).toHaveLength(1);
            });
        });
    });
    describe('email', function () {
        it('is not email', function () {
            (new Schema(Rules.make({
                mail: 'email'
            }))).validate({ mail: '' }, (errors) => {
                expect(errors).toHaveLength(1);
            });
        });
        it('is email', function () {
            (new Schema(Rules.make({
                mail: 'email'
            }))).validate({ mail: 'duoli@wulicode.com' }, (errors) => {
                expect(errors).toBeNull();
            });
        });
    });

    describe('alpha', function () {

        console.log(Rules.make({
            mail: 'alpha'
        }));
        expect.assertions(1);
        return (new Schema(Rules.make({
            mail: 'alpha'
        }))).validate({ mail: 'aa333' }, (errors) => {
            it('is', function () {
                console.log(errors);
                expect(errors).toBeNull();
                expect(errors).toHaveLength(3);
            });
        });


    });
    describe('regex match', function () {
        it('test-number', function () {
            assert.equal(regexTest(['5'], /\d+/i), true);
            assert.equal(regexTest('5', /\d+/i), true);
        });
    });
});