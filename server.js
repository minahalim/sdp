"use strict";

// Load extra environment variables from .env
require("dotenv").config({silent: true});

// Include modules
var express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    config = require("./config"),
    errorMessage = require("./errors/errorMessage"),
    helmet = require("helmet"),
    middleware = require("./routes/middleware"),

    app = express();


// Render images and styles from public folder
app.use(express.static(__dirname + "/public"));

// Use HTML templates
app.set("views", path.join(__dirname, "views"));
// Set EJS View Engine**
app.set("view engine", "ejs");
// Set HTML engine**
app.engine("html", require("ejs").renderFile);


app.use(helmet());
app.use(bodyParser.json());
app.use(middleware.setAgentOnReq);

// Include routes
require("./routes")(express, app);

module.exports = app;
