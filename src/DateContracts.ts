/**
 * Created by lindem on 12/5/13.
 */
///<reference path="./definitions/node.d.ts" />

import Common = require("./Common");
import TypeContracts = require("./TypeContracts");

export function isFuture(d:Date, semantic:string = "this Date"):Date {
    var now;
    TypeContracts.isDate(d);
    now = Date.now();
    // XXX maybe one could imagine a certain tolerance is needed?
    if (d.getTime() < now) {
        throw Common.contractViolation(semantic, "is in the past.")
    }
    return d;
}

export function isPast(d:Date, semantic:string = "this Date"):Date {
    var now;
    TypeContracts.isDate(d);
    now = Date.now();
    // XXX maybe one could imagine a certain tolerance is needed?
    if (d.getTime() > now) {
        throw Common.contractViolation(semantic, "is in the future.")
    }
    return d;
}