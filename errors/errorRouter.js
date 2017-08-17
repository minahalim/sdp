"use strict";

// router-level specific error handling
module.exports = function(router) {
    // catch 404 and forward to error handler
    router.use(function(req, res, next) {
        var err = new Error("Invalid API Path");
        err.status = 404;
        next(err);
    });
};