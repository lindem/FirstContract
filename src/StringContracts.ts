/**
 * Created by lindem on 12/5/13.
 */
///<reference path="./definitions/node.d.ts" />

import Common = require("./Common");
import TypeContracts = require("./TypeContracts");

export function notEmpty(s: string, semantic: string): string {
    TypeContracts.isString(s);
    if (1 > s.length) {
        throw Common.contractViolation(semantic, "is the empty string.");
    }
    return s;
}