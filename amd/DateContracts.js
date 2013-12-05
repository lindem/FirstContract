define(["require", "exports", "./Common", "./TypeContracts"], function(require, exports, __Common__, __TypeContracts__) {
    var Common = __Common__;
    var TypeContracts = __TypeContracts__;

    function isFuture(d, semantic) {
        if (typeof semantic === "undefined") { semantic = "this Date"; }
        var now;
        TypeContracts.isDate(d);
        now = Date.now();

        if (d.getTime() < now) {
            throw Common.contractViolation(semantic, "is in the past.");
        }
        return d;
    }
    exports.isFuture = isFuture;

    function isPast(d, semantic) {
        if (typeof semantic === "undefined") { semantic = "this Date"; }
        var now;
        TypeContracts.isDate(d);
        now = Date.now();

        if (d.getTime() > now) {
            throw Common.contractViolation(semantic, "is in the future.");
        }
        return d;
    }
    exports.isPast = isPast;
});
