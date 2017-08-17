"use strict";

var app = require("../server"),
    http = require("http"),
    port = process.env.PORT || "8080",
    fs = require("fs"),
    request = require("request"),
    lodash = require("lodash"),
    dynamoResponses;

describe("API", function() {
    before(function(done) {
        var server = http.createServer(app);
        server.listen(port);
        server.on("listening", function() {
            done();
        });
    });
    require("../test_all/api")();
});
