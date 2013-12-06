/**
 * Created by lindem on 12/5/13.
 */
///<reference path="./definitions/node.d.ts" />

import BasicContracts = require("./BasicContracts");
import TypeContracts = require("./TypeContracts");
import NumberContracts = require("./NumberContracts");
import StringContracts = require("./StringContracts");
import DateContracts = require("./DateContracts");

export function contractViolation(semanticName:string, error:string) {
    return new Error(["Contract Violation:", semanticName, error].join(" "));
}

export function violationMessage(msg:string):string {
    var newerr:string;
    if (/^Contract violation/.test(msg)) {
        newerr = msg.slice(20);

    } else {
        /* if this is called on any message not from a contract violation,
         it's an error. */
        throw new Error(msg);
    }
    return newerr;
}


export function parseFunc(func:Function):any {
    var name = func["name"];
    if (name === undefined) {
        try {
            name = func.toString().match(/^function\s*([^\s(]+)/)[1];
        } catch (e) {
            name = "(anonymous function)"
        }
    }
    return name;
}
export function byAlias(name:string):any {
    if (aliases[name] !== undefined) {
        return aliases[name];
    } else {
        return null;
    }
}
var aliases = {
    // to be extended as needed. these aliases are used to determine
    // a contract function by byAlias.
    // Basic
    "none": BasicContracts.none,
    "": BasicContracts.none,
    "fail": BasicContracts.fail,
    // satisfy if not undefined
    "def": BasicContracts.defined,
    // satisfy if neither null nor undefined
    "proper": BasicContracts.properValue,
    // Numbers
    "Z+0": NumberContracts.nonNegativeInteger,
    "Z+": NumberContracts.positiveInteger,
    "Z-": NumberContracts.negativeInteger,
    "Z": NumberContracts.integer,
    // I know, I know. It's not *really* R as in real numbers.
    // Bite me.
    "R+0": NumberContracts.nonNegativeNumber,
    "R+": NumberContracts.positiveNumber,
    "R-": NumberContracts.negativeNumber,
    "R": NumberContracts.properNumber,
    // Types
    "Function": TypeContracts.isFunction,
    "Number": TypeContracts.isNumber,
    "S": TypeContracts.isString,
    "S+": StringContracts.notEmpty,
    "Boolean": BasicContracts.realBoolean,
    "Array": TypeContracts.isArray,
    "Date": TypeContracts.isDate,
    "Future": DateContracts.isFuture,
    "Past": DateContracts.isPast
};
