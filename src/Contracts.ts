/**
 * Created by lindem on 12/2/13.
 */
///<reference path="../definitions/node.d.ts" />

function contractViolation(semanticName:string, error:string):Error {
    return new Error(["Contract Violation:", semanticName, error].join(" "));
}

export class BasicContracts {
    static defined(a: any, semantic: string) {
        if (undefined === a) {
            throw contractViolation(semantic, "is undefined");
        }
    }
}

export class TypeContracts {
    static isNumber(a: any, semantic: string) {
        if (typeof a !== 'number') {
            throw contractViolation(semantic, "is not of type Number");
        }
    }
}

export class ElementaryNumberContracts {

    static notNaN(n:number, semantic:string) {
        if (isNaN(n)) {
            throw contractViolation(semantic, "is NaN");
        }
        return n;
    }

    static finity(n:number, semantic:string = "[Number]"):number {
        if (!isFinite(n)) {
            throw contractViolation(semantic, " is not finite.");
        }
        return n;
    }

    static integer(n:number, semantic:string = "[Number]"):number {
        if (n % 1 !== 0) {
            throw contractViolation(semantic, " is not an integer.");
        }
        return n;
    }

    static negativity(n:number, semantic:string = "[Number]") {
        if (0 < n) {
            throw contractViolation(semantic,
                "is a positive number.");
        }
    }

    static nonNegativity(n:number, semantic:string = "[Number]"):number {
        if (0 >= n) {
            throw contractViolation(semantic,
                "is a negative number.");
        }
        return n;
    }

    static nonZero(n:number, semantic:string = "[Number]"):number {
        if (0 === n) {
            throw contractViolation(semantic, "is zero.");
        }
        return n;
    }
}

export class NumberContracts {
    static properNumberContract(n, semantic): number {
        TypeContracts.isNumber(n, semantic);
        ElementaryNumberContracts.finity(n, semantic);
        ElementaryNumberContracts.notNaN(n, semantic);
        return n;
    }
    static nonNegativeInteger(n, semantic): number {
        TypeContracts.isNumber(n, semantic);
        NumberContracts.properNumberContract(n, semantic);
        ElementaryNumberContracts.nonNegativity(n, semantic);
        ElementaryNumberContracts.integer(n, semantic);
        return n;
    }
    static nonNegativeNumber(n, semantic): number {
        TypeContracts.isNumber(n, semantic);
        NumberContracts.properNumberContract(n, semantic);
        ElementaryNumberContracts.nonNegativity(n, semantic);
        return n;
    }
}