/**
 * Created by lindem on 12/3/13.
 */
function sum (a, b) {
    return a + b;
}

var assert = require('assert'),
    FirstContract = require("./helper/proxy"),
    Contracts = FirstContract.Contracts,
    contractify = FirstContract.contractify,
    c = FirstContract.c,
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest,
    RR_R = c(["R", "R"], "R"),
    RR_Rp = c(["R", "R"], "R+");


suite("contractify() and c() shorthand", function () {
    test("contractify [fail]", function () {
        var f = contractify({params: ["Z+0", "Z+0"], returns: "Z+0" },
            sum);
        throwTest(assert, function () {
            f("a", 2);
        });
    });
    test("contractify [success]", function () {
        var f = contractify(
            { params: ["Z+0", "Z+0"], returns: "Z+0" },
            sum);
        noThrowTest(assert, function () {
            f(1, 2);
        });
    });
    test("c shorthand [fail parameters]", function () {
        throwTest(assert, function () {
            RR_R(sum)("a", "b");
        });
    });
    test("c shorthand [fail return type]", function () {
        throwTest(assert, function () {
            RR_Rp(sum)(1, NaN);
        });
    });
    test("contractify error message [parameter]", function () {
        var msg;
        try {
            RR_Rp("testlabel", sum)(1, NaN);
        } catch (e) {
            msg = e.message;
            console.log(msg);
        }
        assert.ok(/function sum/.test(msg));
        assert.ok(/parameter 2/.test(msg));
    });
    test("preserve execution context for wrapped function", function () {
        function F() {
            this.foo = "bar";
            return this;
        }
        function baz () {
            return this.foo;
        }

        F.prototype.baz = c([], "S+")(baz);

        noThrowTest(assert, function () {
            var f = new F();
            assert.equal(f.baz(), "bar");
        });
    });
    test("contractify error message [return type]", function () {

        function bang() {
            return NaN;
        }
        var contract = c([], "Z"),
            msg;
        try {
            contract(bang)();
        } catch (e) {
            msg = e.message;
        }
        assert.ok(/return value/.test(msg));
    });
    test("contractify labels", function () {
        var testfn = RR_Rp("important label", sum),
            msg;
        try {
            testfn(NaN, "blah");
        } catch (e) {
            msg = e.message;
        }
        assert.ok(/important label/.test(msg));
    });

});