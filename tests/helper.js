/**
 * Created by lindem on 12/2/13.
 */

function throwTest(test, fn) {
    test.expect(1);
    test.throws(fn);
    test.done();
}

module.exports = {
    throwTest: throwTest
};