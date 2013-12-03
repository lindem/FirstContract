/**
 * Created by lindem on 12/2/13.
 */
var Contracts = require("../FirstContract").Contracts,
    OC = Contracts.ObjectContracts,
    nonNegativeInteger = Contracts.NumberContracts.nonNegativeInteger,
    nonNegativeNumber = Contracts.NumberContracts.nonNegativeNumber,
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest;


module.exports = {
    "test allValuesContracts [nonNegativeInteger w/ fractionals]": function (test) {
        throwTest(test, function () {
            var o = {
                "carbs": 0.4,
                "fat": 0,
                "protein": 0.1,
                "salt": 0.007
            };
            OC.allValuesContracts(o, ["Z+0"]);
        });
    },
    "test allValuesContracts [conformance]": function (test) {
        noThrowTest(test, function () {
            var o = {
                "carbs": 0.4,
                "fat": 0,
                "protein": 0.1,
                "salt": 0.007
            };
            OC.allValuesContracts(o, ["R+0"]);
        });
    }
};