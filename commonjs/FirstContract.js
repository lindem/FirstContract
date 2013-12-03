/**
* Created on 12/2/13.
* © 2013 Sol Venetus Software GmbH, Germany
*
* This software is provided under the MIT license. See the file LICENSE.TXT for
* details.
*/
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
function c(params, returns) {
    var contract = { params: params, returns: returns };
    return function (fn) {
        return exports.contractify(contract, fn);
    };
}
exports.c = c;

function contractify(contract, fun) {
    var paramContracts = contract.params.map(function (specifier) {
        var resolved = Contracts.byAlias(specifier);
        if (!resolved) {
            throw new Error("No contract by alias " + specifier);
        }
        return resolved;
    }), returnContract = contract.returns;

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
        var ret, i, len = arguments["length"];

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
    };
}
exports.contractify = contractify;

(function (Contracts) {
    var aliases;
    function contractViolation(semanticName, error) {
        return new Error(["Contract Violation:", semanticName, error].join(" "));
    }
    Contracts.contractViolation = contractViolation;

    function byAlias(name) {
        if (aliases[name] !== undefined) {
            return aliases[name];
        } else {
            return null;
        }
    }
    Contracts.byAlias = byAlias;

    (function (BasicContracts) {
        // The "carte blanche" contract. It's always fulfilled.
        function none(a) {
            return a;
        }
        BasicContracts.none = none;

        // The autofail contract.
        function fail(a, semantic) {
            if (typeof semantic === "undefined") { semantic = ""; }
            throw Contracts.contractViolation(semantic, "prescribed automatic failure");
        }
        BasicContracts.fail = fail;

        /**
        * This contract is fulfilled if the argument is not carrying the value
        * {undefined}.
        *
        * @param a
        * @param semantic
        * @returns {*}
        */
        function defined(a, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            if (undefined === a) {
                throw Contracts.contractViolation(semantic, "is undefined.");
            }
            return a;
        }
        BasicContracts.defined = defined;

        /**
        * This contract is fulfilled if the argument does not strictequal
        * {null}.
        * @param a
        * @param semantic
        * @returns {*}
        */
        function notNull(a, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            if (null === a) {
                throw Contracts.contractViolation(semantic, "is null");
            }
            return a;
        }
        BasicContracts.notNull = notNull;

        /**
        * The contract is fulfilled if the argument strictly equals {true} or
        * {false}.
        * @param b
        * @param semantic
        * @returns {boolean}
        */
        function realBoolean(b, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            if (b !== false && b !== true) {
                throw Contracts.contractViolation(semantic, "is neither true nor false; evaluating to " + !!b);
            }
            return b;
        }
        BasicContracts.realBoolean = realBoolean;

        /**
        * The contract is fulfilled for all values which are not strictly equal
        * {undefined} or {null}.
        * @param a
        * @param semantic
        */
        function properValue(a, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            Contracts.BasicContracts.defined(a, semantic);
            Contracts.BasicContracts.notNull(a, semantic);
        }
        BasicContracts.properValue = properValue;
    })(Contracts.BasicContracts || (Contracts.BasicContracts = {}));
    var BasicContracts = Contracts.BasicContracts;

    (function (TypeContracts) {
        /**
        * The contract is fulfilled for all values of the Number type.
        * The Oddballs {NaN}, {Infinity} and {-Infinity} also fulfill the
        * contract, because they *are* of type Number.
        * @param a
        * @param semantic
        * @returns {*}
        */
        function isNumber(a, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            if (typeof a !== 'number') {
                throw Contracts.contractViolation(semantic, "is not of type Number");
            }
            return a;
        }
        TypeContracts.isNumber = isNumber;

        /**
        * The contract is fulfilled for all values of type String.
        * The empty String {""} is still a String.
        * @param a
        * @param semantic
        * @returns {*}
        */
        function isString(a, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            if (typeof a !== 'string') {
                throw Contracts.contractViolation(semantic, "is not of type string");
            }
            return a;
        }
        TypeContracts.isString = isString;

        /**
        * The contract is fulfilled for all arrays, of course including the
        * empty one.
        * The {arguments} object is not an array and will break the contract.
        * @param a
        * @param semantic
        * @returns {*}
        */
        function isArray(a, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            if (Object.prototype.toString.call(a) !== "[object Array]") {
                throw Contracts.contractViolation(semantic, "is not an Array");
            }
            return a;
        }
        TypeContracts.isArray = isArray;

        /**
        * The contract is fulfilled for all functions.
        * @param a
        * @param semantic
        * @returns {*}
        */
        function isFunction(a, semantic) {
            if (Object.prototype.toString.call(a) !== '[object Function]') {
                throw Contracts.contractViolation(semantic, "is not a Function.");
            }
            return a;
        }
        TypeContracts.isFunction = isFunction;
    })(Contracts.TypeContracts || (Contracts.TypeContracts = {}));
    var TypeContracts = Contracts.TypeContracts;

    (function (ObjectContracts) {
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
        function allValuesContracts(a, contracts) {
            var len = contracts.length, i, key;

            for (key in a) {
                if (a.hasOwnProperty(key)) {
                    for (i = 0; i < len; i += 1) {
                        Contracts.byAlias(contracts[i]).apply(null, [a[key]]);
                    }
                }
            }
            return a;
        }
        ObjectContracts.allValuesContracts = allValuesContracts;
    })(Contracts.ObjectContracts || (Contracts.ObjectContracts = {}));
    var ObjectContracts = Contracts.ObjectContracts;
    (function (ArrayContracts) {
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
        function allElementsContracts(a, contracts) {
            var i, j, alen, contractslen;
            for (i = 0, alen = a.length; i < alen; i += 1) {
                for (j = 0, contractslen = contracts.length; j < contractslen; j += 1) {
                    Contracts.byAlias(contracts[j]).apply(this, [a[i]]);
                }
            }
            return a;
        }
        ArrayContracts.allElementsContracts = allElementsContracts;
    })(Contracts.ArrayContracts || (Contracts.ArrayContracts = {}));
    var ArrayContracts = Contracts.ArrayContracts;
    (function (NumberContracts) {
        function notNaN(n, semantic) {
            if (isNaN(n)) {
                throw Contracts.contractViolation(semantic, "is NaN");
            }
            return n;
        }
        NumberContracts.notNaN = notNaN;

        function finity(n, semantic) {
            if (typeof semantic === "undefined") { semantic = "[Number]"; }
            if (!isFinite(n)) {
                throw Contracts.contractViolation(semantic, " is not finite.");
            }
            return n;
        }
        NumberContracts.finity = finity;

        function integer(n, semantic) {
            if (typeof semantic === "undefined") { semantic = "[Number]"; }
            if (n % 1 !== 0) {
                throw Contracts.contractViolation(semantic, " is not an integer.");
            }
            return n;
        }
        NumberContracts.integer = integer;

        function negativity(n, semantic) {
            if (typeof semantic === "undefined") { semantic = "" + n; }
            if (0 < n) {
                throw Contracts.contractViolation(semantic, "is a positive number.");
            }
        }
        NumberContracts.negativity = negativity;

        function positivity(n, semantic) {
            if (typeof semantic === "undefined") { semantic = "" + n; }
            if (0 > n) {
                throw Contracts.contractViolation(semantic, "is a negative number.");
            }
        }
        NumberContracts.positivity = positivity;

        function nonNegativity(n, semantic) {
            if (typeof semantic === "undefined") { semantic = "" + n; }
            if (0 > n) {
                throw Contracts.contractViolation(semantic, "is a negative number.");
            }
            return n;
        }
        NumberContracts.nonNegativity = nonNegativity;

        function nonZero(n, semantic) {
            if (typeof semantic === "undefined") { semantic = "[Number]"; }
            if (0 === n) {
                throw Contracts.contractViolation(semantic, "is zero.");
            }
            return n;
        }
        NumberContracts.nonZero = nonZero;

        function properNumber(n, semantic) {
            Contracts.TypeContracts.isNumber(n, semantic);
            Contracts.NumberContracts.finity(n, semantic);
            Contracts.NumberContracts.notNaN(n, semantic);
            return n;
        }
        NumberContracts.properNumber = properNumber;

        function negativeInteger(n, semantic) {
            Contracts.TypeContracts.isNumber(n, semantic);
            Contracts.NumberContracts.negativity(n, semantic);
            Contracts.NumberContracts.integer(n, semantic);
            return n;
        }
        NumberContracts.negativeInteger = negativeInteger;

        function positiveInteger(n, semantic) {
            Contracts.NumberContracts.positivity(n, semantic);
            Contracts.NumberContracts.integer(n, semantic);
            return n;
        }
        NumberContracts.positiveInteger = positiveInteger;

        function nonNegativeInteger(n, semantic) {
            Contracts.NumberContracts.properNumber(n, semantic);
            Contracts.NumberContracts.nonNegativity(n, semantic);
            Contracts.NumberContracts.integer(n, semantic);
            return n;
        }
        NumberContracts.nonNegativeInteger = nonNegativeInteger;

        function nonNegativeNumber(n, semantic) {
            Contracts.NumberContracts.properNumber(n, semantic);
            Contracts.NumberContracts.nonNegativity(n, semantic);
            return n;
        }
        NumberContracts.nonNegativeNumber = nonNegativeNumber;

        function positiveNumber(n, semantic) {
            if (typeof semantic === "undefined") { semantic = "" + n; }
            Contracts.NumberContracts.properNumber(n, semantic);
            Contracts.NumberContracts.positivity(n, semantic);
            return n;
        }
        NumberContracts.positiveNumber = positiveNumber;

        function negativeNumber(n, semantic) {
            if (typeof semantic === "undefined") { semantic = "" + n; }
            Contracts.NumberContracts.properNumber(n, semantic);
            Contracts.NumberContracts.negativity(n, semantic);
            return n;
        }
        NumberContracts.negativeNumber = negativeNumber;
    })(Contracts.NumberContracts || (Contracts.NumberContracts = {}));
    var NumberContracts = Contracts.NumberContracts;
    aliases = {
        // to be extended as needed. these aliases are used to determine
        // a contract function by byAlias.
        // Basic
        "none": Contracts.BasicContracts.none,
        "": Contracts.BasicContracts.none,
        // satisfy if not undefined
        "def": Contracts.BasicContracts.defined,
        // satisfy if neither null nor undefined
        "proper": Contracts.BasicContracts.properValue,
        // Numbers
        "Z+0": Contracts.NumberContracts.nonNegativeInteger,
        "Z+": Contracts.NumberContracts.positiveInteger,
        "Z-": Contracts.NumberContracts.negativeInteger,
        "Z": Contracts.NumberContracts.integer,
        // I know, I know. It's not *really* R as in real numbers.
        // Bite me.
        "R+0": Contracts.NumberContracts.nonNegativeNumber,
        "R+": Contracts.NumberContracts.positiveNumber,
        "R-": Contracts.NumberContracts.negativeNumber,
        "R": Contracts.NumberContracts.properNumber,
        // Types
        "Function": Contracts.TypeContracts.isFunction,
        "Number": Contracts.TypeContracts.isNumber,
        "Boolean": Contracts.BasicContracts.realBoolean,
        "Array": Contracts.TypeContracts.isArray
    };
})(exports.Contracts || (exports.Contracts = {}));
var Contracts = exports.Contracts;

//# sourceMappingURL=FirstContract.js.map
