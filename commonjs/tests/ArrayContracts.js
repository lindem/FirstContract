/**
 * Created by lindem on 12/2/13.
 */
var Contracts = require("../FirstContract").Contracts,
    AC = Contracts.ArrayContracts,
    nonNegativeInteger = Contracts.byAlias("Z+0"),
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest;

module.exports = {
    "test allValuesContracts [NaN]": function (test) {
        var arr = [1, 2, 3, 4, 5, NaN];
        throwTest(test, function () {
            AC.allElementsContracts(arr, ["Z+0"]);
        });
    },
    "test allElementsContracts [conformance]": function (test) {
        var arr = [1, 2, 3, 4, 5];
        noThrowTest(test, function () {
            AC.allElementsContracts(arr, ["Z+0"]);
        });
    }
};