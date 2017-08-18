// NODE_ENV: DEVELOPMENT

var googleMapsEndpoints = require("./googleMapsEndpoints");

module.exports = {
    MW_DIR: "./",
    LOG_DIR: "./logs",
    SERVER_URL: "http://localhost:8080", // Development server URL

    googleApiKey: "AIzaSyCc7lkQ8knwThTvGHttJIyByKL4sjvbuWI", // If the key is not the same for the Development
    mongooseDBURL: "mongodb://dl3SxSxOibUxhi2T:userBEM@127.0.0.1:27017/", // MongoDB url for the Development
    databaseName: "sdp"	// Database name for the Development
};
