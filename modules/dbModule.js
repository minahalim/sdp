"use strict";

module.exports = function(config) {

    var mongoose = require("mongoose"),
        errorMessage = require("../errors/errorMessage"),
        RouteDataModel,
        ShortestDistanceDataModel;


    function connect() {
        var connectionString = "mongodb://mongodb-1-f4vkn:27017/" + config.databaseName,
            connect,
            db;

        // if OPENSHIFT env variables are present, use the available connection info:
        if (process.env.OPENSHIFT_MONGODB_DB_URL) {
            connectionString = process.env.OPENSHIFT_MONGODB_DB_URL +
            process.env.OPENSHIFT_APP_NAME;
        }

        // Connect to mongodb
        connect = function() {
            mongoose.connect(connectionString);
        };

        connect();

        db = mongoose.connection;

        db.on("error", function(error) {
            console.log("Error loading the db - " + error);
        });

        db.on("disconnected", connect);

        return buildSchema(mongoose);
    };

    function buildSchema(mongoose) {
        var Schema = mongoose.Schema,
            routeSchema = new Schema({
                origins: Array,
                destinations: Array
            }, {
                collection: "routeData"
            }),
            shortestDistanceSchema = new Schema({
                token: String,
                result: Object,
                status: String,
                routeDocumentId: String,
                error: String
            }, {
                collection: "shortestDistanceData"
            });

        RouteDataModel = mongoose.model("RouteDataModel", routeSchema);
        ShortestDistanceDataModel = mongoose.model("ShortestDistanceDataModel", shortestDistanceSchema);

        return {
            RouteDataModel: RouteDataModel,
            ShortestDistanceDataModel: ShortestDistanceDataModel
        };
    }

    function addEntry(DataModel, data) {
        return new DataModel(data).save().then(function(data) {
            return data;
        }).catch(function(error) {
            return error;
        });
    }

    function deleteEntry(DataModel, id) {
        return DataModel.findByIdAndRemove(id).then(function(data) {
            return data;
        }).catch(function(error) {
            return error;
        });
    }

    function updateEntry(DataModel, id, data) {
        return DataModel.update(id, {$set: data}).then(function(data) {
            return data;
        }).catch(function(error) {
            return error;
        });
    }

    function readEntry(DataModel, id) {
        return DataModel.findOne(id).then(function(data) {
            return data;
        }).catch(function(error) {
            return error;
        });
    }

    return {
        connect: connect,
        addEntry: addEntry,
        deleteEntry: deleteEntry,
        updateEntry: updateEntry,
        readEntry: readEntry
    };

};
