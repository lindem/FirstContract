define(["require", "exports", "./Common"], function(require, exports, __Common__) {
    var Common = __Common__;

    function allElementsContracts(a, contracts) {
        var i, j, alen, contractslen;
        for (i = 0, alen = a.length; i < alen; i += 1) {
            for (j = 0, contractslen = contracts.length; j < contractslen; j += 1) {
                Common.byAlias(contracts[j]).apply(this, [a[i]]);
            }
        }
        return a;
    }
    exports.allElementsContracts = allElementsContracts;
});
