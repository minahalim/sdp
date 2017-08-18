// NODE_ENV: QA

var googleMapsEndpoints = require("./googleMapsEndpoints");

module.exports = {
    MW_DIR: "./",
    LOG_DIR: "./logs",
    SERVER_URL: "http://localhost:8080", // QA server URL

    googleApiKey: "AIzaSyCc7lkQ8knwThTvGHttJIyByKL4sjvbuWI", // If the key is not the same for the QA
    mongooseDBURL: "mongodb://localhost:27017/", // MongoDB url for the QA
    databaseName: "sdp"	// Database name for the QA
};
