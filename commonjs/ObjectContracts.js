var Common = require("./Common");

function allValuesContracts(a, contracts) {
    var len = contracts.length, i, key;

    for (key in a) {
        if (a.hasOwnProperty(key)) {
            for (i = 0; i < len; i += 1) {
                Common.byAlias(contracts[i]).apply(null, [a[key]]);
            }
        }
    }
    return a;
}
exports.allValuesContracts = allValuesContracts;

//# sourceMappingURL=ObjectContracts.js.map
