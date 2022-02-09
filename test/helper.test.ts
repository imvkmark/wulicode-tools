// @ts-ignore
import assert from 'assert';
import { regexTest, sprintf } from '@/framework/utils/helper';

describe('regex', function () {
    it('test-number', function () {
        assert.equal(regexTest(['5', '7'], /^\d+$/i), false);
        assert.equal(regexTest(['5'], /^\d+$/i), true);
        assert.equal(regexTest('5', /^\d+$/i), true);
        assert.equal(regexTest('5,7', /^\d+$/i), false);
    });
    it('test-string', function () {
        expect(regexTest('1', /\S/)).toBe(true);
    });
});


describe('string', function () {
    describe('sprintf', function () {
        it('replace 1 param', function () {
            assert.equal('你是什么', sprintf('{0}是什么', '你'));
        });
        it('replace 2 param', function () {
            assert.equal('你是什么', sprintf('{0}是什{1}', '你', '么'));
        });
    });
});
