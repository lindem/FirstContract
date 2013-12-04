/**
 * Created by lindem on 12/2/13.
 */
var assert = require('assert'),
    Contracts = require("./helper/proxy").Contracts,
    AC = Contracts.ArrayContracts,
    nonNegativeInteger = Contracts.byAlias("Z+0"),
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest;

suite("ArrayContracts", function () {
    test("test allValuesContracts [NaN]", function () {
        var arr = [1, 2, 3, 4, 5, NaN];
        throwTest(assert, function () {
            AC.allElementsContracts(arr, ["Z+0"]);
        });
    });
    test("test allElementsContracts [conformance]", function () {
        var arr = [1, 2, 3, 4, 5];
        noThrowTest(assert, function () {
            AC.allElementsContracts(arr, ["Z+0"]);
        });
    });
});