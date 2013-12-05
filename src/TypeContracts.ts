/**
 * Created by lindem on 12/5/13.
 */
///<reference path="./definitions/node.d.ts" />

import Common = require("./Common");


export function isDate(a:any, semantic:string = "this argument"):Date {
    if (Object.prototype.toString.call(a) !== '[object Date]') {
        throw Common.contractViolation(semantic, "is not a date");
    }
    return a;
}

/**
 * The contract is fulfilled for all values of the Number type.
 * The Oddballs {NaN}, {Infinity} and {-Infinity} also fulfill the
 * contract, because they *are* of type Number.
 * @param a
 * @param semantic
 * @returns {*}
 */
export function isNumber(a:any, semantic:string = "this argument"):number {
    if (typeof a !== 'number') {
        throw Common.contractViolation(semantic, "is not of type Number");
    }
    return a;
}

/**
 * The contract is fulfilled for all values of type String.
 * The empty String {""} is still a String.
 * @param a
 * @param semantic
 * @returns {*}
 */
export function isString(a:any, semantic:string = "this argument"):string {
    if (typeof a !== 'string') {
        throw Common.contractViolation(semantic, "is not of type string");
    }
    return a;
}

/**
 * The contract is fulfilled for all arrays, of course including the
 * empty one.
 * The {arguments} object is not an array and will break the contract.
 * @param a
 * @param semantic
 * @returns {*}
 */
export function isArray(a:any, semantic:string = "this argument"):any[] {
    if (Object.prototype.toString.call(a) !== "[object Array]") {
        throw Common.contractViolation(semantic, "is not an Array");
    }
    return a;
}

/**
 * The contract is fulfilled for all functions.
 * @param a
 * @param semantic
 * @returns {*}
 */
export function isFunction(a:any, semantic:string):Function {
    if (Object.prototype.toString.call(a) !== '[object Function]') {
        throw Common.contractViolation(semantic, "is not a Function.");
    }
    return a;
}