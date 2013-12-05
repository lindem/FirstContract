define(["require", "exports", "./ArrayContracts", "./BasicContracts", "./DateContracts", "./NumberContracts", "./ObjectContracts", "./StringContracts", "./TypeContracts", "./Wrappers", "./Common"], function(require, exports, ___ArrayContracts__, ___BasicContracts__, ___DateContracts__, ___NumberContracts__, ___ObjectContracts__, ___StringContracts__, ___TypeContracts__, ___Wrappers__, ___Common__) {
    var _ArrayContracts = ___ArrayContracts__;
    var _BasicContracts = ___BasicContracts__;
    var _DateContracts = ___DateContracts__;
    var _NumberContracts = ___NumberContracts__;
    var _ObjectContracts = ___ObjectContracts__;
    var _StringContracts = ___StringContracts__;
    var _TypeContracts = ___TypeContracts__;

    var _Wrappers = ___Wrappers__;
    var _Common = ___Common__;

    (function (Contracts) {
        Contracts.ArrayContracts = _ArrayContracts;
        Contracts.BasicContracts = _BasicContracts;
        Contracts.DateContracts = _DateContracts;
        Contracts.NumberContracts = _NumberContracts;
        Contracts.ObjectContracts = _ObjectContracts;
        Contracts.StringContracts = _StringContracts;
        Contracts.TypeContracts = _TypeContracts;
        Contracts.byAlias = _Common.byAlias;
        Contracts.Wrappers = _Wrappers;
    })(exports.Contracts || (exports.Contracts = {}));
    var Contracts = exports.Contracts;

    exports.c = _Wrappers.c;
    exports.contractify = _Wrappers.contractify;
});
