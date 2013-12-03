/**
 * Created by lindem on 12/2/13.
 */

function throwTest(test, fn, error) {
    if (error === undefined) {
        error = /Contract/
    }
    test.expect(1);
    test.throws(fn, error);
    test.done();
}

function noThrowTest(test, fn) {
    test.expect(1);
    test.doesNotThrow(fn);
    test.done();
}

module.exports = {
    throwTest: throwTest,
    noThrowTest: noThrowTest
};