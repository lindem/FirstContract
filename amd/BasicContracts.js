define(["require", "exports", "./Common"], function(require, exports, __Common__) {
    var Common = __Common__;

    function none(a) {
        return a;
    }
    exports.none = none;

    function fail(_a, semantic) {
        if (typeof semantic === "undefined") { semantic = ""; }
        throw Common.contractViolation(semantic, "prescribed automatic failure");
    }
    exports.fail = fail;

    function defined(a, semantic) {
        if (typeof semantic === "undefined") { semantic = "this argument"; }
        if (undefined === a) {
            throw Common.contractViolation(semantic, "is undefined.");
        }
        return a;
    }
    exports.defined = defined;

    function notNull(a, semantic) {
        if (typeof semantic === "undefined") { semantic = "this argument"; }
        if (null === a) {
            throw Common.contractViolation(semantic, "is null");
        }
        return a;
    }
    exports.notNull = notNull;

    function realBoolean(b, semantic) {
        if (typeof semantic === "undefined") { semantic = "this argument"; }
        if (b !== false && b !== true) {
            throw Common.contractViolation(semantic, "is neither true nor false; evaluating to " + !!b);
        }
        return b;
    }
    exports.realBoolean = realBoolean;

    function properValue(a, semantic) {
        if (typeof semantic === "undefined") { semantic = "this argument"; }
        exports.defined(a, semantic);
        exports.notNull(a, semantic);
    }
    exports.properValue = properValue;
});
