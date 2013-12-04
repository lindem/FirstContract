/**
 * Created by lindem on 12/2/13.
 */

var Contracts = require("./helper/proxy").Contracts,
    BC = Contracts.BasicContracts,
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest;

module.exports = {
    "test defined [undefined]": function (test) {
        throwTest(test, function () {
            BC.defined(undefined);
        });
    },
    "test defined [conformance]": function (test) {
        noThrowTest(test, function () {
            BC.defined(1);
        });
    },
    "test notNull [null]": function (test) {
        throwTest(test, function () {
           BC.notNull(null)
        });
    },
    "test notNull [conformance]": function (test) {
        noThrowTest(test, function () {
            BC.notNull(1)
        });
    },
    "test realBoolean [undefined]": function (test) {
        throwTest(test, function () {
            BC.realBoolean(undefined);
        });
    },
    "test realBoolean [conformance]": function (test) {
        noThrowTest(test, function () {
            BC.realBoolean(false);
            BC.realBoolean(true);
        });
    },
    "test properValue [undefined]": function (test) {
        throwTest(test, function () {
            BC.properValue(undefined);
        });
    },
    "test properValue [conformance]": function (test) {
        noThrowTest(test, function () {
            BC.properValue(1);
        });
    }
};