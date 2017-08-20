"use strict";

var chai = require("chai"),
    chaiMatchPattern = require("chai-match-pattern"),
    sinon = require("sinon"),
    lodash = require("lodash"),
    errorMessage = require("../errors/errorMessage"),
    hostname = "http://localhost:3000",
    promisedRequest = require("../utils/promisedRequest")(hostname),
    assert = chai.assert,
    get = promisedRequest.get,
    post = promisedRequest.post;

chai.use(chaiMatchPattern);
chai.assert.matchPattern = function(val, exp) {
    chai.expect(val).to.matchPattern(exp);
};

module.exports = function(port) {
    context("/", function() {
        describe("Healthcheck", function() {
            it("GET health should return health true", function() {
                return get("/health")
                .then(function(obj) {
                    assert.matchPattern(obj.body, {
                        "health": true
                    });
                    assert.equal(obj.res.statusCode, 200);
                });
            });

            it("GET non-existent route should return 404", function() {
                return get("/doesNotExist")
                .then(function(obj) {
                    assert.equal(obj.res.statusCode, 404);
                });
            });
        });

        describe("Home", function() {
            it("GET / should contain logo.png", function() {
                return get("/")
                .then(function(obj) {
                    chai.expect(obj.res.body).to.include("logo.png");
                });
            });
        });
    });

    context("/v1", function() {
        var token;

        describe("v1/route", function() {
            it("POST v1/route should return status 200", function() {
                return post("v1/route", {
                    body: [
                        [22.330204, 114.159970],
                        [22.326432, 114.205522],
                        [22.335244, 114.176117]
                    ]
                })
                .then(function(obj) {
                    token = obj.res.body.token;
                    assert.equal(obj.res.statusCode, 200);
                });
            });

            it("POST v1/route should return error if there's no body passed", function() {
                return post("v1/route", {
                    body: null
                })
                .then(function(obj) {
                    assert.equal(obj.res.body.resultuimessage, errorMessage.API.MISSING_REQ_BODY);
                });
            });

            it("POST v1/route should return error if there's no destinations passed", function() {
                return post("v1/route", {
                    body: [
                        [22.330204, 114.159970]
                    ]
                })
                .then(function(obj) {
                    assert.equal(obj.res.body.resultuimessage, errorMessage.API.MISSING_DESTINATIONS);
                });
            });
        });

        describe("v1/route/token", function() {
            it("GET v1/route/token should return error if no token passed", function() {
                return get("v1/route/")
                .then(function(obj) {
                    assert.equal(obj.res.body.resultdescription, "");
                });
            });

            it("GET v1/route/token should return status 200", function() {
                return get("v1/route/token")
                .then(function(obj) {
                    assert.equal(obj.res.statusCode, 200);
                });
            });
        });

        describe("v1/route/token", function() {
            it("GET v1/route/token should return error if no token passed", function() {
                return get("v1/route/")
                .then(function(obj) {
                    assert.equal(obj.res.statusCode, 200);
                });
            });

            it("GET v1/route/token should return status code 200 for a valid token", function() {
                return get("v1/route/" + token)
                .then((obj) => {
                    assert.equal(obj.res.body.status, "in progress");
                });
            });

            it("GET v1/route/token should return status success route destination for valid token for second time", function() {
                return get("v1/route/" + token)
                .then((obj) => {
                    assert.equal(obj.res.body.status, "success");
                });
            });

            it("POST v1/route should return status 200 with route not found", function() {
                return post("v1/route", {
                    body: [
                        [22.330204, 114.159970],
                        [22.326432, 114.205522],
                        ["test", "test"]
                    ]
                })
                .then(function(obj) {
                    token = obj.res.body.token;
                    assert.equal(obj.res.statusCode, 200);
                });
            });


            it("GET v1/route/token should return status failure for missing routes", function() {
                return get("v1/route/" + token)
                .then(function(obj) {
                    assert.equal(obj.res.body.status, "failure");
                });
            });
        });
    });
};
