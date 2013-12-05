var Common = require("./Common");

function c(params, returns) {
    var contract = { params: params, returns: returns };

    return function (label, fn) {
        if (arguments["length"] === 1) {
            fn = label;
            label = undefined;
        }
        return exports.contractify(contract, fn, label);
    };
}
exports.c = c;

function contractify(contract, fun, label) {
    var paramContracts = contract.params.map(function (specifier) {
        var resolved = Common.byAlias(specifier);
        if (!resolved) {
            throw new Error("No contract by alias " + specifier);
        }
        return resolved;
    }), returnContract = Common.byAlias(contract.returns);

    return function () {
        var ret, i, name = Common.parseFunc(fun), contract_label = (typeof label === "string") ? label : "(no label)", args = Array.prototype.slice.apply(arguments), len;

        for (i = 0, len = args.length; i < len; i += 1) {
            if (paramContracts[i]) {
                paramContracts[i].apply(null, [
                    args[i],
                    [
                        "label: »",
                        contract_label,
                        "« ",
                        " function ",
                        name,
                        " [parameter ",
                        i + 1,
                        "] ",
                        args[i]
                    ].join("")
                ]);
            }
        }
        ret = fun.apply(this, Array.prototype.slice.apply(arguments));
        if (returnContract) {
            returnContract.apply(null, [
                ret,
                [
                    "label: »",
                    contract_label,
                    "« ",
                    " function ",
                    name,
                    " [return value]: ",
                    ret
                ].join("")
            ]);
            console.log("Bings!");
        }

        return ret;
    };
}
exports.contractify = contractify;

//# sourceMappingURL=Wrappers.js.map
