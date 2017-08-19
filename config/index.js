"use strict";

var lodash = require("lodash"),

    v1 = {
        path: "/v1",
        route: "/route",
        routeWithToken: "/route/:token",

        log: "/log"
    },
    v2 = lodash.defaults({
        path: "/v2"
    }, v1),

    common = {
        APPLICATION_NAME: "SDP",
        VERSION: {
            V1: v1,
            V2: v2
        },
        ALLOWED_ORIGINS: [
            "127.0.0.1",
            "localhost"
        ],
        REQUEST_TIMEOUT: 60000
    },

    environmentSpecific = {
        LOCAL: require("./envLocal"),
        DEVELOPMENT: require("./envDevelopment"),
        QA: require("./envQa"),
        STAGING: require("./envStaging"),
        PRODUCTION: require("./envProduction"),
        DOCKER: require("./envDocker")
    };

console.log("SDP NODE_ENV: ", process.env.NODE_ENV);

// Pick the related config based on the NODE_ENV
if (typeof environmentSpecific[process.env.NODE_ENV] !== "undefined") {
    module.exports = lodash.merge(common, environmentSpecific[process.env.NODE_ENV]);
} else {
    module.exports = lodash.merge(common, environmentSpecific["LOCAL"]);
}
