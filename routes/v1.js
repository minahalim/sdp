"use strict";

module.exports = function(config) {

    var _ = require("lodash"),
        guid = require("guid"),
        errorRouter = require("../errors/errorRouter"),
        errorMessage = require("../errors/errorMessage"),
        googleMapsModule = require("../modules/googleMapsModule")(config),
        db = require("../modules/dbModule")(config),
        versionConfig = config.VERSION.V1,
        v1 = {},
        dataModel,
        RouteDataModel,
        ShortestDistanceDataModel;

    // Connect to the databse!
    dataModel = db.connect();
    RouteDataModel = dataModel.RouteDataModel;
    ShortestDistanceDataModel = dataModel.ShortestDistanceDataModel;

    //
    // Route handlers
    //

    v1.createRouter = function(express, app) {
        var router = express.Router();

        router.post(versionConfig.route, this.route);
        router.get(versionConfig.routeWithToken, this.routeWithToken);

        errorRouter(router);

        return router;
    };

    v1.route = function(req, res, next) {
        var uniqueId = guid.create().value,
            responseObject = {},
            originAndDestinations,
            origin,
            destinations,
            routeDocumentId;

        if (req.body.length === 0 || req.body.length === undefined) {
            return next(new Error(errorMessage.API.MISSING_REQ_BODY));
        }

        if (req.body.length < 2) {
            return next(new Error(errorMessage.API.MISSING_DESTINATIONS));
        }

        originAndDestinations = req.body;
        origin = [originAndDestinations.shift()];
        destinations = originAndDestinations;

        db.addEntry(RouteDataModel, {
            origins: origin,
            destinations: destinations
        }).then(function(data) {
            routeDocumentId = data._id;

            db.addEntry(ShortestDistanceDataModel, {
                token: uniqueId,
                status: "not started",
                routeDocumentId: routeDocumentId
            }).then(function() {
                res.send({"token": uniqueId});
            });
        });
    };

    v1.routeWithToken = function(req, res, next) {
        var routesNotFound,
            calculatedPath,
            errorResult;

        if (!req.params.token) {
            return next(new Error(errorMessage.API.MISSING_TOKEN));
        }
        // Get the routeDocumentID from the shortestDistanceModel
        db.readEntry(ShortestDistanceDataModel, {
            token: req.params.token
        }).then(function(data) {
            // Handling if the token is not in the database
            if (!data) {
                return next(new Error(errorMessage.DB.INVALID_TOKEN));
            }

            // if the data already found in the database
            // maybe the user is revisiting so no need to recalculate
            // or the api already done calculating and updated the status
            // or the api returned an error already
            if (data.status !== "not started")  {
                // Success or Failuer Status
                return res.send(_.merge({}, {"status": data.status}, data.result || {"error": data.error}));
            }

            // If the token is valid but the path not yet calculated
            // get the route from the routeModel
            db.readEntry(RouteDataModel, {
                _id: data.routeDocumentId
            }).then(function(result) {
                // update the shortestDistanceModel document with the data and the status

                // get the calculations for the routes using Google Maps Matrix Api
                return googleMapsModule.getShortestDrivingPath(
                    result.origins,
                    result.destinations
                ).then(function(googleResponse) {
                    // Check if routes not found ? return failure
                    routesNotFound = googleMapsModule.routesNotFound(googleResponse);

                    if (routesNotFound > 0) {
                        v1.handleError(errorMessage.API.ROUTES_NOT_FOUND + routesNotFound, req);
                        res.send({
                            status: "failure",
                            error: errorMessage.API.ROUTES_NOT_FOUND + routesNotFound
                        });
                        return;
                    }

                    if (googleResponse.status === "OK") {
                        // After getting the paths from google do the real calculations for the result returned
                        calculatedPath = googleMapsModule.calculateTotalDrivingPath(googleResponse, result.origins, result.destinations);

                        v1.handleSuccess(calculatedPath, req);

                        if (process.env.TEST) {
                            res.send({status: "in progress"});
                        }
                    }
                }).catch(function(error) {
                    v1.handleError(error, req);
                });
            });

            db.updateEntry(ShortestDistanceDataModel, {token: req.params.token}, {
                status: "in progress"
            });

            if (!process.env.TEST) {
                res.send({status: "in progress"});
                return;
            }
        }).catch(function(error) {
            res.send(error);
        });
    };

    v1.handleSuccess = function(result, req) {
        var finalResult;

        finalResult = _.merge(
            {},
            {"status": "success"},
            {"result": result}
        );

        // update the shortestDistanceModel document with the data and the status
        db.updateEntry(ShortestDistanceDataModel, {token: req.params.token}, finalResult);
    };

    v1.handleError = function(error, req) {
        var errorResult;

        errorResult = {
            status: "failure",
            error: error || error.json["error_message"]
        };

        // update the shortestDistanceModel document with the data and the status
        db.updateEntry(ShortestDistanceDataModel, {token: req.params.token}, errorResult);
    };

    return v1;
};
