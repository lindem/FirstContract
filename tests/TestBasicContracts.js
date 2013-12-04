/**
 * Created by lindem on 12/2/13.
 */

var assert = require("assert"),
    Contracts = require("./helper/proxy").Contracts,
    BC = Contracts.BasicContracts,
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest;

suite("BasicContracts", function () {
    test("defined [undefined]", function () {
        throwTest(assert, function () {
            BC.defined(undefined);
        });
    });
    test("defined [conformance]", function () {
        noThrowTest(assert, function () {
            BC.defined(1);
        });
    });
    test("notNull [null]", function () {
        throwTest(assert, function () {
           BC.notNull(null)
        });
    });
    test("notNull [conformance]", function () {
        noThrowTest(assert, function () {
            BC.notNull(1)
        });
    });
    test("realBoolean [undefined]", function () {
        throwTest(assert, function () {
            BC.realBoolean(undefined);
        });
    });
    test("realBoolean [conformance]", function () {
        noThrowTest(assert, function () {
            BC.realBoolean(false);
            BC.realBoolean(true);
        });
    });
    test("properValue [undefined]", function () {
        throwTest(assert, function () {
            BC.properValue(undefined);
        });
    });
    test("properValue [conformance]", function () {
        noThrowTest(assert, function () {
            BC.properValue(1);
        });
    });
});