"use strict";

// Sample v2
// inherits all routes from v1 and will overwrite if having the same name
module.exports = function(config) {

    var lodash = require("lodash"),
        errorRouter = require("../errors/errorRouter"),
        v1 = require("./v1")(config),
        v2 = {};

    v2.createRouter = function(express, app) {
        var router = express.Router();

        router.post("/test", this.test);

        errorRouter(router);
        return router;
    };

    v2.test = function(req, res, next) {
        res.send("this is V2!");
    };

    return lodash.defaults(v2, v1);
};
