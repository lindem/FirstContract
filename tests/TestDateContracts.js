/**
 * Created by lindem on 12/4/13.
 */

var assert = require('assert'),
    FirstContract = require("./helper/proxy"),
    Contracts = FirstContract.Contracts,
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest,
    DC = Contracts.DateContracts,
    c = FirstContract.c,

    contract = c(["Date", "Date"], "R"),
    difference = function (d1, d2) {
        return d1.getTime() - d2.getTime();
    },

    // 01. 01. 1970, 00:00 UTC...
    epoch = new Date(0),
    tomorrow = new Date(new Date().getTime() + 86400000),

    testfn = contract(difference);


suite("DateContracts", function () {
    test("date contract [null]", function () {
        throwTest(assert, function () {
            testfn(epoch, null);
        })
    });
    test("date contract [conformance]", function () {
        noThrowTest(assert, function () {
            testfn(new Date(), epoch);
        });
    });
    test("isFuture contract [fail]", function () {
        throwTest(assert, function () {
            DC.isFuture(epoch);
        });
    });
    test("isFuture contract [conformance]", function () {
        noThrowTest(assert, function () {
            DC.isFuture(tomorrow);
        });
    });
    test("isPast contract [fail]", function () {
        throwTest(assert, function () {
            DC.isPast(tomorrow);
        });
    });
    test("isPast contract [conformance]", function () {
        noThrowTest(assert, function () {
            DC.isPast(epoch);
        });
    });
});