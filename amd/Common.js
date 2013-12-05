define(["require", "exports", "./BasicContracts", "./TypeContracts", "./NumberContracts", "./StringContracts", "./DateContracts"], function(require, exports, __BasicContracts__, __TypeContracts__, __NumberContracts__, __StringContracts__, __DateContracts__) {
    var BasicContracts = __BasicContracts__;
    var TypeContracts = __TypeContracts__;
    var NumberContracts = __NumberContracts__;
    var StringContracts = __StringContracts__;
    var DateContracts = __DateContracts__;

    function contractViolation(semanticName, error) {
        return new Error(["Contract Violation:", semanticName, error].join(" "));
    }
    exports.contractViolation = contractViolation;

    function violationMessage(msg) {
        var newerr;
        if (/^Contract violation/.test(msg)) {
            newerr = msg.slice(20);
        } else {
            throw new Error(msg);
        }
        return newerr;
    }
    exports.violationMessage = violationMessage;

    function parseFunc(func) {
        var name = func["name"];
        if (name === undefined) {
            try  {
                name = func.toString().match(/^function\s*([^\s(]+)/)[1];
            } catch (e) {
                name = "(anonymous function)";
            }
        }
        return name;
    }
    exports.parseFunc = parseFunc;
    function byAlias(name) {
        if (aliases[name] !== undefined) {
            return aliases[name];
        } else {
            return null;
        }
    }
    exports.byAlias = byAlias;
    var aliases = {
        "none": BasicContracts.none,
        "": BasicContracts.none,
        "def": BasicContracts.defined,
        "proper": BasicContracts.properValue,
        "Z+0": NumberContracts.nonNegativeInteger,
        "Z+": NumberContracts.positiveInteger,
        "Z-": NumberContracts.negativeInteger,
        "Z": NumberContracts.integer,
        "R+0": NumberContracts.nonNegativeNumber,
        "R+": NumberContracts.positiveNumber,
        "R-": NumberContracts.negativeNumber,
        "R": NumberContracts.properNumber,
        "Function": TypeContracts.isFunction,
        "Number": TypeContracts.isNumber,
        "S": TypeContracts.isString,
        "S+": StringContracts.notEmpty,
        "Boolean": BasicContracts.realBoolean,
        "Array": TypeContracts.isArray,
        "Date": TypeContracts.isDate,
        "Future": DateContracts.isFuture,
        "Past": DateContracts.isPast
    };
});
