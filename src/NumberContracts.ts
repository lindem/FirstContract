/**
 * Created by lindem on 12/5/13.
 */
///<reference path="./definitions/node.d.ts" />

import Common = require("./Common");
import TypeContracts = require("./TypeContracts");

    export function notNaN(n:number, semantic:string) {
        if (isNaN(n)) {
            throw Common.contractViolation(semantic, "is NaN");
        }
        return n;
    }

    export function finity(n:number, semantic:string = "[Number]"):number {
        if (!isFinite(n)) {
            throw Common.contractViolation(semantic, "is not finite.");
        }
        return n;
    }

    export function integer(n:number, semantic:string = "[Number]"):number {
        if (n % 1 !== 0) {
            throw Common.contractViolation(semantic, " is not an integer.");
        }
        return n;
    }

    export function negativity(n:number, semantic:string = "" + n) {
        if (0 < n) {
            throw Common.contractViolation(semantic,
                "is a positive number.");
        }
    }

    export function positivity(n:number, semantic:string = "" + n) {
        if (0 > n) {
            throw Common.contractViolation(semantic,
                "is a negative number.");
        }
    }

    export function nonNegativity(n:number, semantic:string = "" + n):number {
        if (0 > n) {
            throw Common.contractViolation(semantic,
                "is a negative number.");
        }
        return n;
    }

    export function nonZero(n:number, semantic:string = "[Number]"):number {
        if (0 === n) {
            throw Common.contractViolation(semantic, "is zero.");
        }
        return n;
    }

    export function properNumber(n, semantic):number {
        TypeContracts.isNumber(n, semantic);
        finity(n, semantic);
        notNaN(n, semantic);
        return n;
    }

    export function negativeInteger(n, semantic):number {
        TypeContracts.isNumber(n, semantic);
        negativity(n, semantic);
        integer(n, semantic);
        return n;
    }

    export function positiveInteger(n, semantic):number {
        positivity(n, semantic);
        integer(n, semantic);
        return n;
    }

    export function nonNegativeInteger(n, semantic):number {
        properNumber(n, semantic);
        nonNegativity(n, semantic);
        integer(n, semantic);
        return n;
    }

    export function nonNegativeNumber(n, semantic):number {
        properNumber(n, semantic);
        nonNegativity(n, semantic);
        return n;
    }

    export function positiveNumber(n, semantic:string = "" + n) {
        properNumber(n, semantic);
        positivity(n, semantic);
        return n;
    }

    export function negativeNumber(n, semantic:string = "" + n) {
        properNumber(n, semantic);
        negativity(n, semantic);
        return n;
    }

