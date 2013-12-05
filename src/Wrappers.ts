/**
 * Created by lindem on 12/5/13.
 */
///<reference path="./definitions/node.d.ts" />

import Common = require("./Common");

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
export function c(params:any, returns:any):Function {
    var contract = {params: params, returns: returns};
    return function (fn:Function) {
        return contractify(contract, fn);
    }
}

export function contractify(contract:Contract, fun:Function):Function {
    var paramContracts = contract.params.map(function (specifier):Function {
            var resolved = Common.byAlias(specifier);
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
    return function ():any {
        var ret:any,
            i:number,
            len:number = arguments["length"],
            name:string = Common.parseFunc(fun),
            err:string;

        for (i = 0; i < len; i += 1) {
            if (paramContracts[i]) {
                try {
                    paramContracts[i].apply(null, [arguments[i],
                        ["function ", name, " [parameter ", i + 1, "]"].join("")
                    ]);
                } catch (e) {
                    /* if there is a Contract Violation, insert the function name
                     in front of the error message. */
                    err = Common.violationMessage(e.message);
                    e.message = ["Contract Violation:",
                        "function:", name,
                        "(parameter: ", i, "): "].join(" ");
                    //throw e;
                }
            }
        }
        ret = fun.apply(this, arguments);
        if (typeof returnContract === 'string') {
            returnContract = Common.byAlias(returnContract);
        }
        // call the contract on the return value.
        returnContract.apply(null, [ret]);
        // return the return value.
        return ret;
    }
}
