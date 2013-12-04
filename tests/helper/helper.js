/**
 * Created by lindem on 12/2/13.
 */

function throwTest(test, fn, error) {
    if (error === undefined) {
        error = /Contract/
    }
    test.throws(fn, error);
}

function noThrowTest(test, fn) {
    test.doesNotThrow(fn);
}

module.exports = {
    throwTest: throwTest,
    noThrowTest: noThrowTest
};