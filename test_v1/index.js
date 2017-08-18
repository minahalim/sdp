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
            v1.validateCreateSSOUserInput({body: samples.REQUESTS.VALIDATE_CREATE_SSO_USER_INPUT.SUCCESS}, res, next);
            assert.matchPattern(res.send.args[0][0], patterns.RESPONSES.VALIDATE_CREATE_SSO_USER_INPUT.SUCCESS);
        });

        it("FAILURE_MISSING_PARAMETERS", function() {
            v1.validateCreateSSOUserInput({body: samples.REQUESTS.VALIDATE_CREATE_SSO_USER_INPUT.FAILURE_MISSING_PARAMETERS}, res, next);
            assert.instanceOf(next.args[0][0], Error);
            assert.strictEqual(next.args[0][0].message, errorMessage.API.MISSING_PARAMETERS);
        });
    });
});
