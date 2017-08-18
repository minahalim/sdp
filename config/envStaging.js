// NODE_ENV: STAGOMG

var googleMapsEndpoints = require("./googleMapsEndpoints");

module.exports = {
    MW_DIR: "./",
    LOG_DIR: "./logs",
    SERVER_URL: "http://localhost:8080", // Staging server URL

    googleApiKey: "AIzaSyCc7lkQ8knwThTvGHttJIyByKL4sjvbuWI", // If the key is not the same for the Staging
    mongooseDBURL: "mongodb://localhost:27017/", // MongoDB url for the staging
    databaseName: "sdp"	// Database name for the staging
};
