"use strict";

process.env.TEST = true;

var app = require("../server"),
    http = require("http"),
    port = process.env.PORT || "3000",
    fs = require("fs"),
    request = require("request"),
    lodash = require("lodash"),
    server;

describe("API", function() {
    before(function(done) {
        server = http.createServer(app);
        server.listen(port);
        server.on("listening", function() {
            done();
        });
    });

    require("./api")(port);
});
