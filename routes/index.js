"use strict";

var config = require("../config"),
    v1 = require("./v1"),
    errorApp = require("../errors/errorApp");

function healthCheck(req, res, next) {
    res.json({
        health: true
    });
}

function home(req, res, next) {
    res.render("index.html");
}

module.exports = function(express, app) {
    var v1Router = v1(config).createRouter(express, app),
        error = errorApp(config);

    // Root
    app.get("/health", healthCheck);

    app.get("/", home);

    app.use(config.VERSION.V1.path, v1Router);

    // Errors
    app.use(error.errorHandler);
};
