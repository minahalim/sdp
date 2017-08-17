"use strict";

// Load extra environment variables from .env
require("dotenv").config({silent: true});

// Include modules
var express = require("express"),
    bodyParser = require("body-parser"),
    config = require("./config"),
    errorMessage = require("./errors/errorMessage"),
    helmet = require("helmet"),
    middleware = require("./routes/middleware"),

    app = express();


app.use(helmet());
app.use(bodyParser.json());
app.use(middleware.setAgentOnReq);

// Include routes
require("./routes")(express, app);

module.exports = app;
