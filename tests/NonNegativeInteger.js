/*global require */
/**
 * Created by lindem on 12/2/13.
 */
var helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest,
    Contracts = require("../src/Contracts").Contracts,
    nonNegativeInteger = Contracts.byAlias("Z+0");

module.exports = {
    "test non-negative integer [values]": function (test) {
        throwTest(test, function () {
            nonNegativeInteger(-100);
        });
    },
    "test non-negative integer [datatype]": function (test) {
        throwTest(test, function () {
            nonNegativeInteger("Hello, World");
        });
    },
    "test non-negative integer [NaN]": function (test) {
        throwTest(test, function () {
            nonNegativeInteger(NaN);
        });
    },
    "test non-negative integer [Infinity]": function (test) {
        throwTest(test, function () {
            nonNegativeInteger(Infinity);
        });
    },
    "test non-negative integer [-Infinity]": function (test) {
        throwTest(test, function () {
            nonNegativeInteger(-Infinity);
        });
    },
    "test non-negative integer [conformance]": function (test) {
        noThrowTest(test, function () {
            nonNegativeInteger(10);
        });
    },
    "test non-negative integer [fractional]": function (test) {
        throwTest(test, function () {
            nonNegativeInteger(0.1);
        });
    }
};