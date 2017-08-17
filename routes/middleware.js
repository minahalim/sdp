"use strict";

var useragent = require("useragent");

function setAgentOnReq(req, res, next) {
    req.useragent = useragent.parse(req.headers["user-agent"]);
    next();
}

module.exports = {
    setAgentOnReq
};
