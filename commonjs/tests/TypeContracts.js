/**
 * Created by lindem on 12/2/13.
 */
var Contracts = require("../FirstContract").Contracts,
    TC = Contracts.TypeContracts,
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest;

module.exports = {
    "test isNumber [undefined]": function (test) {
        throwTest(test, function () {
            TC.isNumber(undefined);
        });
    },
    "test isNumber [conformance]": function (test) {
        noThrowTest(test, function (){
            TC.isNumber(NaN);
            TC.isNumber(Infinity);
            TC.isNumber(1);
        });
    },
    "test isString [undefined]": function (test) {
        throwTest(test, function () {
            TC.isString(undefined);
        });
    },
    "test isString [conformance]": function (test) {
        noThrowTest(test, function () {
            TC.isString("Hello, World");
        });
    },
    "test isArray [object]": function (test) {
        throwTest(test, function () {
            TC.isArray({});
        });
    },
    "test isArray [conformance]": function (test) {
        noThrowTest(test, function () {
            TC.isArray([]);
            TC.isArray(new Array(150));
        });
    },
    "test isFunction [non-function]": function (test) {
        throwTest(test, function () {
            TC.isFunction({});
        });
    },
    "test isFunction [conformance]": function (test) {
        noThrowTest(test, function () {
            TC.isFunction(Object.prototype.toString);
        });
    }
};