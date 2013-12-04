/**
 * Created by lindem on 12/4/13.
 */

var assert = require("assert"),
    SC = require("../index").Contracts.StringContracts,
    helper = require("./helper/helper"),
    throwTest = helper.throwTest,
    noThrowTest = helper.noThrowTest;

suite("StringContracts", function () {



    test("notEmpty [fail]", function () {
        throwTest(assert, function () {
            SC.notEmpty("");
        });
    });

    test("notEmpty [conformance]", function () {
        noThrowTest(assert, function () {
            SC.notEmpty("Hello, World");
        })
    });

});