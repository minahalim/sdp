// NODE_ENV: PRODUCTION

var googleMapsEndpoints = require("./googleMapsEndpoints");

module.exports = {
    MW_DIR: "./",
    LOG_DIR: "./logs",
    SERVER_URL: "http://localhost:8080", // Production server URL

    googleApiKey: "AIzaSyCc7lkQ8knwThTvGHttJIyByKL4sjvbuWI", // If the key is not the same for the Production
    mongooseDBURL: process.env.OPENSHIFT_sdp_DB_URL, // MongoDB url for the Production
    databaseName: process.env.OPENSHIFT_APP_NAME	// Database name for the Production
};
