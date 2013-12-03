/**
 * Created by lindem on 12/2/13.
 */
///<reference path="../definitions/node.d.ts" />


export interface Contract {
    params: any[];
    returns: any;
}

/**
 * Shorthand for the (longer) contractify call. It's just syntactic sugar.
 *
 * instead of having
 * var sum = contractify({params: ["R", "R"], returns: "R"}, function (sum) {return a+b;});
 *
 * one can now write
 *
 * var binaryNumericFunction = c(["R", "R"], "R"),
 *     sum = binaryNumericFunction(
 *         function sum(a, b) {
 *             return a + b;
 *         });
 *
 * and therefore reuse different contracts, as long as the arity of the functions
 * does not vary.
 *
 * @param params []
 * @param returns {*}
 * @returns {function(Function): function(): *}
 */
export function c(params: any, returns: any) {
    var contract = {params: params, returns: returns};
    return function (fn: Function) {
        return contractify(contract, fn);
    }
}

export function contractify(contract:Contract, fun:Function) {
    var paramContracts = contract.params.map(function (specifier):Function {
            var resolved = Contracts.byAlias(specifier);
            if (!resolved) {
                throw new Error("No contract by alias " + specifier);
            }
            return resolved;
        }),
        returnContract = contract.returns;

    /*
     return a closure which does the following:
     - first, it checks all arguments according to the requested contracts.
     - second, it executes the function which is supposed to fulfill the
     contract. The this reference is preserved.
     - third, the return value of the function is checked against its
     contract.
     - fourth, the return value of the underlying function is returned.
     */
    return function () {
        var ret:any,
            i:number,
            len:number = arguments["length"];

        for (i = 0; i < len; i += 1) {
            if (paramContracts[i]) {
                paramContracts[i].apply(null, [arguments[i]]);
            }
        }
        ret = fun.apply(this, arguments);
        if (typeof returnContract === 'string') {
            returnContract = Contracts.byAlias(returnContract);
        }
        // call the contract on the return value.
        returnContract.apply(null, [ret]);
        // return the return value.
        return ret;
    }
}

export module Contracts {
    var aliases;
    export function contractViolation(semanticName:string, error:string):Error {
        return new Error(["Contract Violation:", semanticName, error].join(" "));
    }

    export function byAlias(name:string) {
        if (aliases[name] !== undefined) {
            return aliases[name];
        } else {
            return null;
        }
    }

    export module BasicContracts {
        // The "carte blanche" contract. It's always fulfilled.
        export function none(a:any):any {
            return a;
        }

        // The autofail contract.
        export function fail(a:any, semantic:string = ""):any {
            throw Contracts.contractViolation(semantic, "prescribed automatic failure");
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
                throw contractViolation(semantic, "is undefined.")
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
                throw contractViolation(semantic, "is null");
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
                throw contractViolation(semantic,
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
            Contracts.BasicContracts.defined(a, semantic);
            Contracts.BasicContracts.notNull(a, semantic);
        }
    }

    export module TypeContracts {
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
                throw contractViolation(semantic, "is not of type Number");
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
                throw contractViolation(semantic, "is not of type string");
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
                throw contractViolation(semantic, "is not an Array");
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
                throw contractViolation(semantic, "is not a Function.");
            }
            return a;
        }
    }

    export module ObjectContracts {
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
                        Contracts.byAlias(contracts[i]).apply(null, [a[key]]);
                    }
                }
            }
            return a;
        }
    }
    export module ArrayContracts {
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
        export function allElementsContracts(a:any[],
                                             contracts:string[]): any[] {
            var i:number,
                j:number,
                alen:number,
                contractslen:number;
            for (i = 0, alen = a.length; i < alen; i += 1) {
                for (j = 0, contractslen = contracts.length;
                     j < contractslen;
                     j += 1) {
                    Contracts.byAlias(contracts[j]).apply(this, [a[i]]);
                }
            }
            return a;
        }
    }
    export module NumberContracts {
        export function notNaN(n:number, semantic:string) {
            if (isNaN(n)) {
                throw contractViolation(semantic, "is NaN");
            }
            return n;
        }

        export function finity(n:number, semantic:string = "[Number]"):number {
            if (!isFinite(n)) {
                throw contractViolation(semantic, " is not finite.");
            }
            return n;
        }

        export function integer(n:number, semantic:string = "[Number]"):number {
            if (n % 1 !== 0) {
                throw contractViolation(semantic, " is not an integer.");
            }
            return n;
        }

        export function negativity(n:number, semantic:string = "" + n) {
            if (0 < n) {
                throw contractViolation(semantic,
                    "is a positive number.");
            }
        }

        export function nonNegativity(n:number, semantic:string = "" + n):number {
            if (0 > n) {
                throw contractViolation(semantic,
                    "is a negative number.");
            }
            return n;
        }

        export function nonZero(n:number, semantic:string = "[Number]"):number {
            if (0 === n) {
                throw contractViolation(semantic, "is zero.");
            }
            return n;
        }

        export function properNumber(n, semantic):number {
            Contracts.TypeContracts.isNumber(n, semantic);
            Contracts.NumberContracts.finity(n, semantic);
            Contracts.NumberContracts.notNaN(n, semantic);
            return n;
        }

        export function nonNegativeInteger(n, semantic):number {
            Contracts.TypeContracts.isNumber(n, semantic);
            Contracts.NumberContracts.properNumber(n, semantic);
            Contracts.NumberContracts.nonNegativity(n, semantic);
            Contracts.NumberContracts.integer(n, semantic);
            return n;
        }

        export function nonNegativeNumber(n, semantic):number {
            Contracts.TypeContracts.isNumber(n, semantic);
            Contracts.NumberContracts.properNumber(n, semantic);
            Contracts.NumberContracts.nonNegativity(n, semantic);
            return n;
        }
    }
    aliases = {
        // to be extended as needed. these aliases are used to determine
        // a contract function by byAlias.
        // Basic
        "none": Contracts.BasicContracts.none,
        "": Contracts.BasicContracts.none,
        // Numbers
        "Z+0": Contracts.NumberContracts.nonNegativeInteger,
        "Z": Contracts.NumberContracts.integer,
        // I know, I know. It's not *really* R as in real numbers.
        // Bite me.
        "R+0": Contracts.NumberContracts.nonNegativeNumber,
        "R": Contracts.NumberContracts.properNumber,
        // Types
        "Function": Contracts.TypeContracts.isFunction,
        "Number": Contracts.TypeContracts.isNumber,
        "Boolean": Contracts.BasicContracts.realBoolean,
        "Array": Contracts.TypeContracts.isArray
    };
}

/*
module.exports.Contracts = Contracts;
module.exports.contractify = contractify;
*/