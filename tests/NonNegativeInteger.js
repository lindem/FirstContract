/*global require */
/**
 * Created by lindem on 12/2/13.
 */
var throwTest = require("./helper").throwTest,
    Contracts = require("../src/Contracts"),
    NC = Contracts.NumberContracts,
    nonNegativeInteger = NC.nonNegativeInteger;

module.exports = {
    "test positive non-negative integer [values]": function (test) {
        throwTest(test, function () {
            nonNegativeInteger(-100);
        });
    },
    "test positive non-negative integer [datatype]": function (test) {
        throwTest(test, function () {
            nonNegativeInteger("Hello, World");
        });
    },
    "test positive non-negative integer [NaN]": function (test) {
        throwTest(test, function () {
            nonNegativeInteger(NaN);
        });
    },
    "test positive non-negative integer [Infinity]": function (test) {
        throwTest(test, function () {
            nonNegativeInteger(Infinity);
        });
    },
    "test positive non-negative integer [-Infinity]": function (test) {
        throwTest(test, function () {
            nonNegativeInteger(-Infinity);
        });
    },
    "test positive non-negative integer [conformance]": function (test) {
        test.expect(1);
        test.doesNotThrow(function () {
            nonNegativeInteger(10);
        });
        test.done();
    },
    "test positive non-negative integer [fractional]": function (test) {
        throwTest(test, function () {
            nonNegativeInteger(0.1);
        });
    }
};