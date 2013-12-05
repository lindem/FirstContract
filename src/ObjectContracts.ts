/**
 * Created by lindem on 12/5/13.
 */
///<reference path="./definitions/node.d.ts" />

import Common = require("./Common");

/**
 * This contract is fulfilled if ALL VALUES of an object (that is, the
 * "right-hand-part" of the key:value-mapping) fulfill ALL of their
 * contracts. {contracts} is an array of contract aliases. The object's
 * prototype chain is not traversed.
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
export function allValuesContracts(a:any, contracts:string[]):any {
    var len:number = contracts.length,
        i:number,
        key:string;

    for (key in a) {
        if (a.hasOwnProperty(key)) {
            for (i = 0; i < len; i += 1) {
                Common.byAlias(contracts[i]).apply(null, [a[key]]);
            }
        }
    }
    return a;
}
