"use strict";

var request = require("request");

function base(baseUrl, method) {
    return function(url, opts) {
        opts = opts || {};
        return new Promise(function(resolve, reject) {
            request({
                baseUrl,
                url,
                method: method,
                json: true,
                jar: true,
                body: opts.body || {}
            }, function(err, res, body) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({body, res});
                }
            });
        });
    };
}

module.exports = function(baseUrl) {
    return {
        get: base(baseUrl, "get"),
        post: base(baseUrl, "post")
    };
};
