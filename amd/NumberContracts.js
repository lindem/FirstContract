define(["require", "exports", "./Common", "./TypeContracts"], function(require, exports, __Common__, __TypeContracts__) {
    var Common = __Common__;
    var TypeContracts = __TypeContracts__;

    function notNaN(n, semantic) {
        if (isNaN(n)) {
            throw Common.contractViolation(semantic, "is NaN");
        }
        return n;
    }
    exports.notNaN = notNaN;

    function finity(n, semantic) {
        if (typeof semantic === "undefined") { semantic = "[Number]"; }
        if (!isFinite(n)) {
            throw Common.contractViolation(semantic, "is not finite.");
        }
        return n;
    }
    exports.finity = finity;

    function integer(n, semantic) {
        if (typeof semantic === "undefined") { semantic = "[Number]"; }
        if (n % 1 !== 0) {
            throw Common.contractViolation(semantic, " is not an integer.");
        }
        return n;
    }
    exports.integer = integer;

    function negativity(n, semantic) {
        if (typeof semantic === "undefined") { semantic = "" + n; }
        if (0 < n) {
            throw Common.contractViolation(semantic, "is a positive number.");
        }
    }
    exports.negativity = negativity;

    function positivity(n, semantic) {
        if (typeof semantic === "undefined") { semantic = "" + n; }
        if (0 > n) {
            throw Common.contractViolation(semantic, "is a negative number.");
        }
    }
    exports.positivity = positivity;

    function nonNegativity(n, semantic) {
        if (typeof semantic === "undefined") { semantic = "" + n; }
        if (0 > n) {
            throw Common.contractViolation(semantic, "is a negative number.");
        }
        return n;
    }
    exports.nonNegativity = nonNegativity;

    function nonZero(n, semantic) {
        if (typeof semantic === "undefined") { semantic = "[Number]"; }
        if (0 === n) {
            throw Common.contractViolation(semantic, "is zero.");
        }
        return n;
    }
    exports.nonZero = nonZero;

    function properNumber(n, semantic) {
        TypeContracts.isNumber(n, semantic);
        exports.finity(n, semantic);
        exports.notNaN(n, semantic);
        return n;
    }
    exports.properNumber = properNumber;

    function negativeInteger(n, semantic) {
        TypeContracts.isNumber(n, semantic);
        exports.negativity(n, semantic);
        exports.integer(n, semantic);
        return n;
    }
    exports.negativeInteger = negativeInteger;

    function positiveInteger(n, semantic) {
        exports.positivity(n, semantic);
        exports.integer(n, semantic);
        return n;
    }
    exports.positiveInteger = positiveInteger;

    function nonNegativeInteger(n, semantic) {
        exports.properNumber(n, semantic);
        exports.nonNegativity(n, semantic);
        exports.integer(n, semantic);
        return n;
    }
    exports.nonNegativeInteger = nonNegativeInteger;

    function nonNegativeNumber(n, semantic) {
        exports.properNumber(n, semantic);
        exports.nonNegativity(n, semantic);
        return n;
    }
    exports.nonNegativeNumber = nonNegativeNumber;

    function positiveNumber(n, semantic) {
        if (typeof semantic === "undefined") { semantic = "" + n; }
        exports.properNumber(n, semantic);
        exports.positivity(n, semantic);
        return n;
    }
    exports.positiveNumber = positiveNumber;

    function negativeNumber(n, semantic) {
        if (typeof semantic === "undefined") { semantic = "" + n; }
        exports.properNumber(n, semantic);
        exports.negativity(n, semantic);
        return n;
    }
    exports.negativeNumber = negativeNumber;
});
