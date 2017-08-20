"use strict";

var lodash = require("lodash");

// app-level specific error handling
module.exports = function(config) {

    // error handlers
    function errorHandler(err, req, res, next) {
        var msg = {
                errorcode: "MW_500",
                resultdescription: "Internal server error",
                resultuilanguage: "Eng",
                resultuimessage: "Internal server error"
            };

        res.status(200);

        if (err.status === 404) {
            res.status(404);
        }

        if (err instanceof Error) {
            if ((process.env.NODE_ENV === "DEVELOPMENT" || process.env.NODE_ENV === "LOCAL") && !process.env.TEST) {
                msg.stacktrace = err.stack;
            }

            msg.resultcode = err.status;
            msg.errorcode = "MW_" + err.status;
            msg.resultdescription = err.message;
            msg.resultuimessage = err.message;
        }

        res.send(msg);

        process.env.TEST === true ? console.error(JSON.stringify(msg), {
            type: "ERROR",
            errorcode: msg.errorcode,
            ip: req.ip,
            route: req.originalUrl,
            agent: {name: req.useragent.family, version: {major: req.useragent.major, minor: req.useragent.minor, patch: req.useragent.patch}},
            device: {name: req.useragent.device.family, version: {major: req.useragent.device.major, minor: req.useragent.device.minor, patch: req.useragent.device.patch}},
            os: {name: req.useragent.os.family, version: {major: req.useragent.os.major, minor: req.useragent.os.minor, patch: req.useragent.os.patch}}
        }) : null;
    }


    return {
        errorHandler
    };
};
