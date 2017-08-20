"use strict";

module.exports = {
    logExceptOnTest: function(string) {
        if (process.env.TEST !== true) {
            console.log(string);
        }
    }
};
