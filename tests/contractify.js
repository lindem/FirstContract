/**
 * Created by lindem on 12/3/13.
 */
function sum (a, b) {
    return a + b;
}

var FirstContract = require("./helper/proxy"),
    Contracts = FirstContract.Contracts,
    contractify = FirstContract.contractify,
    c = FirstContract.c,
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest,
    RR_R = c(["R", "R"], "R"),
    RR_Rp = c(["R", "R"], "R+");


module.exports = {
    "test contractify [fail]": function (test) {
        var f = contractify({params: ["Z+0", "Z+0"], returns: "Z+0" },
            sum);
        throwTest(test, function () {
            f("a", 2);
        });
    },
    "test contractify [success]": function (test) {
        var f = contractify(
            { params: ["Z+0", "Z+0"], returns: "Z+0" },
            sum);
        noThrowTest(test, function () {
            f(1, 2);
        });
    },
    "test c shorthand [fail parameters]": function (test) {
        throwTest(test, function () {
            RR_R(sum)("a", "b");
        });
    },
    "test c shorthand [fail return type]": function (test) {
        throwTest(test, function () {
            RR_Rp(sum)(1, NaN);
        });
    },
    "test contractify error message [fail]": function (test) {
        var msg;
        try {
            RR_Rp(sum)(1, NaN);
        } catch (e) {
            msg = e.message;
        }
        test.expect(2);
        test.ok(/function sum/.test(msg));
        test.ok(/parameter 2/.test(msg));
        test.done();
    }

};