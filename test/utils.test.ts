// @ts-ignore
import assert from 'assert';
import { sprintf } from '../src/utils/str';

describe('Utils', function () {
    describe('sprintf', function () {
        it('replace 1 param', function () {
            assert.equal('你是什么', sprintf('{0}是什么', '你'));
        });
        it('replace 2 param', function () {
            assert.equal('你是什么', sprintf('{0}是什{1}', '你', '么'));
        });
    });
});