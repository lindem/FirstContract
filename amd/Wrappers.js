define(["require", "exports", "./Common"], function(require, exports, __Common__) {
    var Common = __Common__;

    function c(params, returns) {
        var contract = { params: params, returns: returns };

        return function (label, fn, thisp) {
            var arglen = arguments["length"];

            if (arglen === 2) {
                if (typeof arguments[0] === "function") {
                    fn = arguments[0];
                    thisp = arguments[1];
                    label = undefined;
                }
            }

            if (arglen === 1) {
                fn = label;
                label = undefined;
            }
            return exports.contractify(contract, fn, label, thisp);
        };
    }
    exports.c = c;

    function contractify(contract, fun, label, thisp) {
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
            ret = fun.apply((thisp ? thisp : this), Array.prototype.slice.apply(arguments));
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
            }

            return ret;
        };
    }
    exports.contractify = contractify;
});
