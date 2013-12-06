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

    /*
        the function is the result of a partial function application of
        contractify. see contractify below for description of the arguments
        to it.

     */

    return function (label:any, fn?:any, thisp?:any) {
        var arglen = arguments["length"];
        /*
            argument parsing. Easy to botch.
            the intention is that people should be able to call this the
            following ways:

            fun(label, func, thisp) [handled by general case]
            fun(label, func) [handled by general case]
            fun(func, thisp) [handled by explicit check, see below]
            fun(func) [handled by explicit check, see below]

            label is always a string, and if it's present, always param 1.
            if a string is param 1, the next param is a Function.
            if a function is param 1, the next param is either undefined or thisp.
         */

        if (arglen === 2) {
            // fun(func, thisp)
            if (typeof arguments[0] === "function") {
                fn = arguments[0];
                thisp = arguments[1];
                label = undefined;
            }
            // fun(label, func) is handled by the general case.
        }

        if (arglen === 1) {
            // if there is no label provided,
            // it's been called with just a function.
            fn = label;
            label = undefined;
        }
        return contractify(contract, fn, label, thisp);
    }
}

/**
 * This is the main wrapper. The result of this function is another function,
 * which wraps the target function with contract behavior.
 *
 * As long as the contract is upheld, the function acts exactly like the
 * contracted function.
 *
 * The argument "thisp" of this call is to set the execution context explicitly,
 * which is important for contracting just single calls to methods after the
 * methods have already been defined.
 *
 * contractify(..., object.func, ..., object).
 *
 * the "c" function provides an easy frontend to contractify.
 *
 *
 * @param contract -- the contract description.
 * @param fun -- the function for which the contract is created.
 * @param label -- a label, which, if given, is enclosed in error messages.
 * @param thisp -- execution context for the function.
 * @returns {function(): *}
 */

export function contractify(contract:Contract, fun:Function, label:string, thisp:any):Function {
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
        ret = fun.apply((thisp? thisp : this), Array.prototype.slice.apply(arguments));
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
