/**
 * Created by lindem on 12/2/13.
 */
var assert = require('assert'),
    Contracts = require("./helper/proxy").Contracts,
    OC = Contracts.ObjectContracts,
    nonNegativeInteger = Contracts.NumberContracts.nonNegativeInteger,
    nonNegativeNumber = Contracts.NumberContracts.nonNegativeNumber,
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest;


suite("ObjectContracts", function () {
    test("allValuesContracts [nonNegativeInteger w/ fractionals]", function () {
        throwTest(assert, function () {
            var o = {
                "carbs": 0.4,
                "fat": 0,
                "protein": 0.1,
                "salt": 0.007
            };
            OC.allValuesContracts(o, ["Z+0"]);
        });
    });
    test("allValuesContracts [conformance]", function () {
        noThrowTest(assert, function () {
            var o = {
                "carbs": 0.4,
                "fat": 0,
                "protein": 0.1,
                "salt": 0.007
            };
            OC.allValuesContracts(o, ["R+0"]);
        });
    });
});