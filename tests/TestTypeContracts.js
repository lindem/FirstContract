/**
 * Created by lindem on 12/2/13.
 */
var assert = require('assert'),
    Contracts = require("./helper/proxy").Contracts,
    TC = Contracts.TypeContracts,
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest;

suite("TypeContracts", function () {
    test("isNumber [undefined]", function () {
        throwTest(assert, function () {
            TC.isNumber(undefined);
        });
    });
    test("isNumber [conformance]", function () {
        noThrowTest(assert, function (){
            TC.isNumber(NaN);
            TC.isNumber(Infinity);
            TC.isNumber(1);
        });
    });
    test("isString [undefined]", function () {
        throwTest(assert, function () {
            TC.isString(undefined);
        });
    });
    test("isString [conformance]", function () {
        noThrowTest(assert, function () {
            TC.isString("Hello, World");
        });
    });
    test("isArray [object]", function () {
        throwTest(assert, function () {
            TC.isArray({});
        });
    });
    test("isArray [conformance]", function () {
        noThrowTest(assert, function () {
            TC.isArray([]);
            TC.isArray(new Array(150));
        });
    });
    test("isFunction [non-function]", function () {
        throwTest(assert, function () {
            TC.isFunction({});
        });
    });
    test("isFunction [conformance]", function () {
        noThrowTest(assert, function () {
            TC.isFunction(Object.prototype.toString);
        });
    });
});