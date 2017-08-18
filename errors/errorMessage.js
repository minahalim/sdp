"use strict";

var lodash = require("lodash"),
    messages = {
        API: {
            MISSING_REQ_BODY: "Missing Request Body",
            MISSING_ORIGN: "Missing Origin",
            MISSING_DESTINATIONS: "Missing Destinations",
            MISSINT_TOKEN: "Missing Token",
            ROUTES_NOT_FOUND: "Some routes are not found: "
        },
        DB: {
            CANNOT_CONNECT: "Cannot connect to the database",
            INVALID_TOKEN: "The token provided is invalid",
            INVALID_ROUTE_DOCUMENT_ID: "The route document id is not valid"
        }
    };

module.exports = lodash.forIn(messages, (value, key) => {
    lodash.forIn(value, (v, k) => messages[key][k] = `[${key}] ${v}`);
});
