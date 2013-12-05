var Common = require("./Common");

function c(params, returns) {
    var contract = { params: params, returns: returns };
    return function (fn) {
        return exports.contractify(contract, fn);
    };
}
exports.c = c;

function contractify(contract, fun) {
    var paramContracts = contract.params.map(function (specifier) {
        var resolved = Common.byAlias(specifier);
        if (!resolved) {
            throw new Error("No contract by alias " + specifier);
        }
        return resolved;
    }), returnContract = contract.returns;

    return function () {
        var ret, i, len = arguments["length"], name = Common.parseFunc(fun), err;

        for (i = 0; i < len; i += 1) {
            if (paramContracts[i]) {
                try  {
                    paramContracts[i].apply(null, [
                        arguments[i],
                        ["function ", name, " [parameter ", i + 1, "]"].join("")
                    ]);
                } catch (e) {
                    err = Common.violationMessage(e.message);
                    e.message = [
                        "Contract Violation:",
                        "function:",
                        name,
                        "(parameter: ",
                        i,
                        "): "
                    ].join(" ");
                }
            }
        }
        ret = fun.apply(this, arguments);
        if (typeof returnContract === 'string') {
            returnContract = Common.byAlias(returnContract);
        }

        returnContract.apply(null, [ret]);

        return ret;
    };
}
exports.contractify = contractify;

//# sourceMappingURL=Wrappers.js.map
