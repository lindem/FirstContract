/**
 * Created by lindem on 12/5/13.
 */
///<reference path="./definitions/node.d.ts" />

import Common = require("./Common")

// The "carte blanche" contract. It's always fulfilled.
export function none(a:any):any {
    return a;
}

// The autofail contract.
// The inspection for unused local symbols is disabled because of the
// parameter, which is unused.
//noinspection JSUnusedLocalSymbols
export function fail(_a:any, semantic:string = ""):any {
    throw Common.contractViolation(semantic, "prescribed automatic failure");
}

/**
 * This contract is fulfilled if the argument is not carrying the value
 * {undefined}.
 *
 * @param a
 * @param semantic
 * @returns {*}
 */
export function defined(a:any, semantic:string = "this argument"):any {
    if (undefined === a) {
        throw Common.contractViolation(semantic, "is undefined.")
    }
    return a;
}

/**
 * This contract is fulfilled if the argument does not strictequal
 * {null}.
 * @param a
 * @param semantic
 * @returns {*}
 */
export function notNull(a:any, semantic:string = "this argument"):any {
    if (null === a) {
        throw Common.contractViolation(semantic, "is null");
    }
    return a;
}

/**
 * The contract is fulfilled if the argument strictly equals {true} or
 * {false}.
 * @param b
 * @param semantic
 * @returns {boolean}
 */
export function realBoolean(b:boolean, semantic:string = "this argument"):boolean {
    if (b !== false && b !== true) {
        throw Common.contractViolation(semantic,
            "is neither true nor false; evaluating to " + !!b)
    }
    return b;
}

/**
 * The contract is fulfilled for all values which are not strictly equal
 * {undefined} or {null}.
 * @param a
 * @param semantic
 */
export function properValue(a:any, semantic:string = "this argument"):any {
    defined(a, semantic);
    notNull(a, semantic);
    return a;
}
