// NODE_ENV: PRODUCTION

var googleMapsEndpoints = require("./googleMapsEndpoints");

module.exports = {
    MW_DIR: "./",
    LOG_DIR: "./logs",
    SERVER_URL: "http://localhost:8080", // Production server URL

    googleApiKey: "AIzaSyCc7lkQ8knwThTvGHttJIyByKL4sjvbuWI", // If the key is not the same for the Production
    mongooseDBURL: "mongodb://lalamove:l@l@m0v3@localhost:27017/", // MongoDB url for the Production
    databaseName: "sdp"	// Database name for the Production
};
