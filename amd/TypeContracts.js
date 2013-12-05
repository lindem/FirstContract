define(["require", "exports", "./Common"], function(require, exports, __Common__) {
    var Common = __Common__;

    function isDate(a, semantic) {
        if (typeof semantic === "undefined") { semantic = "this argument"; }
        if (Object.prototype.toString.call(a) !== '[object Date]') {
            throw Common.contractViolation(semantic, "is not a date");
        }
        return a;
    }
    exports.isDate = isDate;

    function isNumber(a, semantic) {
        if (typeof semantic === "undefined") { semantic = "this argument"; }
        if (typeof a !== 'number') {
            throw Common.contractViolation(semantic, "is not of type Number");
        }
        return a;
    }
    exports.isNumber = isNumber;

    function isString(a, semantic) {
        if (typeof semantic === "undefined") { semantic = "this argument"; }
        if (typeof a !== 'string') {
            throw Common.contractViolation(semantic, "is not of type string");
        }
        return a;
    }
    exports.isString = isString;

    function isArray(a, semantic) {
        if (typeof semantic === "undefined") { semantic = "this argument"; }
        if (Object.prototype.toString.call(a) !== "[object Array]") {
            throw Common.contractViolation(semantic, "is not an Array");
        }
        return a;
    }
    exports.isArray = isArray;

    function isFunction(a, semantic) {
        if (Object.prototype.toString.call(a) !== '[object Function]') {
            throw Common.contractViolation(semantic, "is not a Function.");
        }
        return a;
    }
    exports.isFunction = isFunction;
});
