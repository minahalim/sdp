"use strict";

var sinon = require("sinon"),
    sinonStubPromise = require("sinon-stub-promise"),
    chai = require("chai"),
    lodash = require("lodash"),
    chaiMatchPattern = require("chai-match-pattern"),
    config = require("../config"),
    errorMessage = require("../errors/errorMessage"),
    proxyquire = require("proxyquire"),
    assert = chai.assert;

sinonStubPromise(sinon);

chai.use(chaiMatchPattern);
chai.assert.matchPattern = function(val, exp) {
    chai.expect(val).to.matchPattern(exp);
};

describe("API", function() {
    var res = {send: function() {}},
        req = {
            test: "test"
        },
        next,
        v1;

    // Test cases
    context("v1.validateCreateSSOUserInput", function() {
        it("SUCCESS", function() {

        });

        it("FAILURE_MISSING_PARAMETERS", function() {

        });
    });
});
