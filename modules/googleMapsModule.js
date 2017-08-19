"use strict";

module.exports = function(config) {

    var _ = require("lodash"),
        googleMaps = require("@google/maps");

    function getShortestDrivingPath(origin, destinations) {
        return new Promise(function(resolve, reject) {
            var googleMapsClient = googleMaps.createClient({
                key: config.googleApiKey
            });

            googleMapsClient.distanceMatrix({
                origins: origin,
                destinations: destinations,
                mode: "driving"
            }, function(err, response) {
                if (!err) {
                    resolve(JSON.stringify(response.json));
                } else {
                    return reject(err);
                }
            });
        });
    }

    function routesNotFound(result) {
        return _.filter(result.rows[0].elements, function(row) {
            return row.status === "ZERO_RESULTS";
        }).length;
    }

    function calculateTotalDrivingPath(route, origins, destinations) {
        var sortedRoute = [],
            totalDistance = 0,
            totalTime = 0;

        if (route.rows) {
            // Sort routes
            route = _(route.rows[0].elements)
                        .map(function(v, k) { // Add key to the routes
                            return _.merge({}, v, {key: k});
                        })
                        .filter(function(obj) {
                            return obj.status === "OK";
                        })
                        .sortBy(function(obj) {
                            return obj.distance.value;
                        }).value();

            // Get the routes by order
            sortedRoute = route.map(function(obj) {
                return destinations[obj.key];
            });

            // Add the origin at the beginning of the sortedRoute
            sortedRoute.unshift(origins[0]);

            // Calculate total distance
            totalDistance = _.sumBy(route, function(obj) {
                return obj.distance.value;
            });

            // Calculate total time
            totalTime = _.sumBy(route, function(obj) {
                return obj.duration.value;
            });

            return {
                "path": sortedRoute,
                "total_distance": totalDistance,
                "total_time": totalTime
            };
        }
    }

    return {
        getShortestDrivingPath: getShortestDrivingPath,
        calculateTotalDrivingPath: calculateTotalDrivingPath,
        routesNotFound: routesNotFound
    };
};
