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

        returnContract.apply(null, [ret]);

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
        function none(a) {
            return a;
        }
        BasicContracts.none = none;

        function fail(_a, semantic) {
            if (typeof semantic === "undefined") { semantic = ""; }
            throw Contracts.contractViolation(semantic, "prescribed automatic failure");
        }
        BasicContracts.fail = fail;

        function defined(a, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            if (undefined === a) {
                throw Contracts.contractViolation(semantic, "is undefined.");
            }
            return a;
        }
        BasicContracts.defined = defined;

        function notNull(a, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            if (null === a) {
                throw Contracts.contractViolation(semantic, "is null");
            }
            return a;
        }
        BasicContracts.notNull = notNull;

        function realBoolean(b, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            if (b !== false && b !== true) {
                throw Contracts.contractViolation(semantic, "is neither true nor false; evaluating to " + !!b);
            }
            return b;
        }
        BasicContracts.realBoolean = realBoolean;

        function properValue(a, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            Contracts.BasicContracts.defined(a, semantic);
            Contracts.BasicContracts.notNull(a, semantic);
        }
        BasicContracts.properValue = properValue;
    })(Contracts.BasicContracts || (Contracts.BasicContracts = {}));
    var BasicContracts = Contracts.BasicContracts;

    (function (TypeContracts) {
        function isNumber(a, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            if (typeof a !== 'number') {
                throw Contracts.contractViolation(semantic, "is not of type Number");
            }
            return a;
        }
        TypeContracts.isNumber = isNumber;

        function isString(a, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            if (typeof a !== 'string') {
                throw Contracts.contractViolation(semantic, "is not of type string");
            }
            return a;
        }
        TypeContracts.isString = isString;

        function isArray(a, semantic) {
            if (typeof semantic === "undefined") { semantic = "this argument"; }
            if (Object.prototype.toString.call(a) !== "[object Array]") {
                throw Contracts.contractViolation(semantic, "is not an Array");
            }
            return a;
        }
        TypeContracts.isArray = isArray;

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
        "none": Contracts.BasicContracts.none,
        "": Contracts.BasicContracts.none,
        "def": Contracts.BasicContracts.defined,
        "proper": Contracts.BasicContracts.properValue,
        "Z+0": Contracts.NumberContracts.nonNegativeInteger,
        "Z+": Contracts.NumberContracts.positiveInteger,
        "Z-": Contracts.NumberContracts.negativeInteger,
        "Z": Contracts.NumberContracts.integer,
        "R+0": Contracts.NumberContracts.nonNegativeNumber,
        "R+": Contracts.NumberContracts.positiveNumber,
        "R-": Contracts.NumberContracts.negativeNumber,
        "R": Contracts.NumberContracts.properNumber,
        "Function": Contracts.TypeContracts.isFunction,
        "Number": Contracts.TypeContracts.isNumber,
        "Boolean": Contracts.BasicContracts.realBoolean,
        "Array": Contracts.TypeContracts.isArray
    };
})(exports.Contracts || (exports.Contracts = {}));
var Contracts = exports.Contracts;

//# sourceMappingURL=FirstContract.js.map
