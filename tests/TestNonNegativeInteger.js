/*global require */
/**
 * Created by lindem on 12/2/13.
 */
var assert = require('assert'),
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest,
    Contracts = require("./helper/proxy").Contracts,
    nonNegativeInteger = Contracts.byAlias("Z+0");

suite("NonNegativeInteger contract", function () {
    test("non-negative integer [values]", function () {
        throwTest(assert, function () {
            nonNegativeInteger(-100);
        });
    });
    test("non-negative integer [datatype]", function () {
        throwTest(assert, function () {
            nonNegativeInteger("Hello, World");
        });
    });
    test("non-negative integer [NaN]", function () {
        throwTest(assert, function () {
            nonNegativeInteger(NaN);
        });
    });
    test("non-negative integer [Infinity]", function () {
        throwTest(assert, function () {
            nonNegativeInteger(Infinity);
        });
    });
    test("non-negative integer [-Infinity]", function () {
        throwTest(assert, function () {
            nonNegativeInteger(-Infinity);
        });
    });
    test("non-negative integer [conformance]", function () {
        noThrowTest(assert, function () {
            nonNegativeInteger(10);
        });
    });
    test("non-negative integer [conformance; zero]", function () {
        noThrowTest(assert, function () {
            nonNegativeInteger(0);
        });
    });
    test("non-negative integer [fractional]", function () {
        throwTest(assert, function () {
            nonNegativeInteger(0.1);
        });
    });
});