/**
 * Created by lindem on 12/5/13.
 */
///<reference path="./definitions/node.d.ts" />

import Common = require("./Common");


    /**
     * This contract is fulfilled if ALL VALUES of an array fulfill ALL of
     * their contracts. {contracts} is an array of contract aliases, each
     * being checked for every element in the array.
     *
     * Note that this can result in a large number of contracts being
     * checked, all of which have the power to make the overall contract
     * fail.
     *
     * This contract does not have an own error message. The individual
     * subcontract's one is used.
     *
     * @param a
     * @param contracts
     * @returns {*}
     */
    export function allElementsContracts(a:any[], contracts:string[]):any[] {
        var i:number,
            j:number,
            alen:number,
            contractslen:number;
        for (i = 0, alen = a.length; i < alen; i += 1) {
            for (j = 0, contractslen = contracts.length;
                 j < contractslen;
                 j += 1) {
                Common.byAlias(contracts[j]).apply(this, [a[i]]);
            }
        }
        return a;
    }
