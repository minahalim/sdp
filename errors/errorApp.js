"use strict";

var lodash = require("lodash");

// app-level specific error handling
module.exports = function(config) {

    // catch 404 and forward to error handler
    function doesNotExist(req, res, next) {
        var error = new Error("The URL you were trying to access does not exist");
        error.status = 404;
        next(error);
    }

    // error handlers
    function errorHandler(err, req, res, next) {
        var msg = {
                result: 0,
                resultcode: 500,
                errorcode: "MW_500",
                resultdescription: "Internal server error",
                resultuilanguage: "Eng",
                resultuimessage: "Internal server error"
            },
            htmlMsg = null;

        if (typeof err.message === "string" && err.message.startsWith("[AUTH]")) {
            err.status = 401;
            res.status(401);
        } else if (typeof err.message === "string" && err.message.startsWith("[API]")) {
            err.status = 400;
            res.status(400);
        } else if (err.status === 404) {
            res.status(404);
        } else if (err instanceof Error && typeof err.status === "undefined") {
            err.status = 500;
            res.status(200);
        } else if (err instanceof SyntaxError && err.status === 400 && typeof err.body !== "undefined") {
            req.body = err.body;
            res.status(400);
        } else {
            res.status(200);
        }

        if (err instanceof Error) {
            if (err.url) {
                err.message += " " + err.url;
            }

            if (process.env.NODE_ENV === "DEVELOPMENT" || process.env.NODE_ENV === "LOCAL") {
                msg.stacktrace = err.stack;
            }

            msg.resultcode = err.status;
            msg.errorcode = "MW_" + err.status;
            msg.resultdescription = err.message;
            msg.resultuimessage = err.message;
        } else if (typeof err === "object") {
            msg = lodash.defaults(err, msg);
        } else {
            // err not Error or Object
            msg.resultdescription = err;
            msg.resultuimessage = err;
        }

        if (err.returnHtmlMsg) {
            // returnHtmlMsg must have %s where error message should be
            htmlMsg = err.returnHtmlMsg.replace("%s", JSON.stringify(lodash.omit(msg, "returnHtmlMsg")));
        }

        if (htmlMsg) {
            res.send(htmlMsg);
        } else {
            res.send(msg);
        }

        console.error(JSON.stringify(msg), {
            type: "ERROR",
            resultcode: msg.resultcode,
            errorcode: msg.errorcode,
            ip: req.ip,
            route: req.originalUrl,
            agent: {name: req.useragent.family, version: {major: req.useragent.major, minor: req.useragent.minor, patch: req.useragent.patch}},
            device: {name: req.useragent.device.family, version: {major: req.useragent.device.major, minor: req.useragent.device.minor, patch: req.useragent.device.patch}},
            os: {name: req.useragent.os.family, version: {major: req.useragent.os.major, minor: req.useragent.os.minor, patch: req.useragent.os.patch}}
        });
    }


    return {
        doesNotExist,
        errorHandler
    };
};
