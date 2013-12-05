var Common = require("./Common");
var TypeContracts = require("./TypeContracts");

function notEmpty(s, semantic) {
    TypeContracts.isString(s);
    if (1 > s.length) {
        throw Common.contractViolation(semantic, "is the empty string.");
    }
    return s;
}
exports.notEmpty = notEmpty;

//# sourceMappingURL=StringContracts.js.map
