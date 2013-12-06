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

    return function (label:any, fn?:Function) {

        if (arguments["length"] === 1) {
            // if there is no label provided,
            // it's been called with just a function.
            fn = label;
            label = undefined;
        }
        return contractify(contract, fn, label);
    }
}

export function contractify(contract:Contract, fun:Function, label:string):Function {
    var paramContracts = contract.params.map(function (specifier):Function {
            var resolved = Common.byAlias(specifier);
            if (!resolved) {
                throw new Error("No contract by alias " + specifier);
            }
            return resolved;
        }),
        returnContract = Common.byAlias(contract.returns);

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
            name:string = Common.parseFunc(fun),
            contract_label = (typeof label === "string") ? label : "(no label)",
            args = Array.prototype.slice.apply(arguments),
            len:number;

        for (i = 0, len = args.length; i < len; i += 1) {
            if (paramContracts[i]) {
                paramContracts[i].apply(null, [args[i],
                    [
                        "label: »", contract_label, "« ",
                        " function ", name,
                        " [parameter ", i + 1, "] ",
                        args[i]
                    ].join("")
                ]);
            }
        }
        ret = fun.apply(this, Array.prototype.slice.apply(arguments));
        if (returnContract) {
            // call the contract on the return value.
            returnContract.apply(null, [ret,
            [
                "label: »", contract_label, "« ",
                " function ", name,
                " [return value]: ",
                ret
            ].join("")
            ]);
        }
        // return the return value.
        return ret;
    }
}
