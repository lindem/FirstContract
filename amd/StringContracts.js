define(["require", "exports", "./Common", "./TypeContracts"], function(require, exports, __Common__, __TypeContracts__) {
    var Common = __Common__;
    var TypeContracts = __TypeContracts__;

    function notEmpty(s, semantic) {
        TypeContracts.isString(s);
        if (1 > s.length) {
            throw Common.contractViolation(semantic, "is the empty string.");
        }
        return s;
    }
    exports.notEmpty = notEmpty;
});
