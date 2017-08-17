"use strict";

var chai = require("chai"),
    chaiMatchPattern = require("chai-match-pattern"),
    sinon = require("sinon"),
    patterns = require("./patterns"),
    assert = chai.assert,
    hostname = "http://localhost:8080",
    lodash = require("lodash"),
    key = {body: {"app_id": "DC5299D1D5EAF9461B8906C1C53547C0EED1092ECEB84423CEEE13EF0DC7EB36", "app_key": "86701D66ADEDF102FF00232C7E3F07B766254F181ED8D41527369BF3BAEBC47D"}},
    promisedRequest = require("../utils/promisedRequest")(hostname),
    get = promisedRequest.get,
    post = promisedRequest.post;

const REQUESTS = patterns.REQUESTS,
    RESPONSES = patterns.RESPONSES;

chai.use(chaiMatchPattern);
chai.assert.matchPattern = function(val, exp) {
    chai.expect(val).to.matchPattern(exp);
};

module.exports = function() {
    before(function() {
        console.log("hostname: ", hostname);
    });

    context("/v1", function() {
        var opts = {};

        before(function() {
            return post("/authenticate", key)
            .then(function(obj) {
                assert.matchPattern(obj.body, RESPONSES.AUTHENTICATE.SUCCESS);
                assert.equal(obj.res.statusCode, 200);
            });
        });

        describe("Handshake", function() {
            it("POST echoTest without authenticating should return 401 and AUTH error", function() {
                return post("/v1/echoTest", {body: {text: "hello"}})
                .then(function(obj) {
                    assert.matchPattern(obj.body, RESPONSES.AUTHENTICATE.FAILURE);
                    assert.equal(obj.res.statusCode, 401);
                });
            });
            it("POST echoTest with bad token should return 401 and AUTH error", function() {
                return post("/v1/echoTest", {body: {token: "invalidtoken"}})
                .then(function(obj) {
                    assert.matchPattern(obj.body, RESPONSES.AUTHENTICATE.FAILURE);
                    assert.equal(obj.res.statusCode, 401);
                });
            });
            it("POST authenticate with bad app keys should return 401 and AUTH error", function() {
                return post("/authenticate", {body: {"app_id": "invalidid", "app_key": "invalidkey"}})
                .then(function(obj) {
                    assert.matchPattern(obj.body, RESPONSES.AUTHENTICATE.FAILURE);
                    assert.equal(obj.res.statusCode, 401);
                });
            });
            it("POST authenticate should return middleware token", function() {
                return post("/authenticate", key)
                .then(function(obj) {
                    assert.matchPattern(obj.body, RESPONSES.AUTHENTICATE.SUCCESS);
                    assert.equal(obj.res.statusCode, 200);
                });
            });
        });

        describe("Healthcheck", function() {
            it("GET health should return health true", function() {
                return get("/health")
                .then(function(obj) {
                    assert.matchPattern(obj.body, RESPONSES.HEALTH.SUCCESS);
                    assert.equal(obj.res.statusCode, 200);
                });
            });

            it("POST echoTest should return body", function() {
                return post("/v1/echoTest", lodash.merge(opts, {body: {text: "hello"}}))
                .then(function(obj) {
                    assert.propertyVal(obj.body, "text", "hello");
                    assert.equal(obj.res.statusCode, 200);
                });
            });

            it("GET non-existent route should return 404", function() {
                return get("/v1/doesNotExist", opts)
                .then(function(obj) {
                    assert.equal(obj.res.statusCode, 404);
                });
            });
        });
    });
};
