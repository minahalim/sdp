"use strict";

module.exports = function(config) {

    var mongoose = require("mongoose"),
        errorMessage = require("../errors/errorMessage"),
        RouteDataModel,
        ShortestDistanceDataModel;


    function connect() {
        var databaseHostName = config.databaseHostName,
            databaseHostPort = config.dataabseHostPost,
            databaseUsername = config.databaseUsername,
            databasePassword = databasePassword,
            databaseName = config.databaseName,
            connectionString,
            db;

        if (databaseUsername && databasePassword) {
            connectionString = "mongodb://" + databaseUsername + ":" + databasePassword + "@" + databaseHostName + ":" + databaseHostPort + "/" + databaseName;
        } else {
            connectionString = "mongodb://" + databaseHostName + ":" + databaseHostPort + "/" + databaseName;
        }

        mongoose.connect(connectionString, {
            useMongoClient: true
        });

        db = mongoose.connection;

        db.on("error", function(error) {
            console.log(new Error(error));
        });

        db.once("open", function() {
            console.log("Finally we are connected to the database!");
        });

        return buildSchema();
    }

    function buildSchema() {
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
        return new DataModel(data).save().then(function(result) {
            return result;
        }).catch(function(error) {
            return error;
        });
    }

    function deleteEntry(DataModel, id) {
        return DataModel.findByIdAndRemove(id).then(function(result) {
            return result;
        }).catch(function(error) {
            return error;
        });
    }

    function updateEntry(DataModel, id, data) {
        return DataModel.update(id, {$set: data}).then(function(result) {
            return result;
        }).catch(function(error) {
            return error;
        });
    }

    function readEntry(DataModel, id) {
        return DataModel.findOne(id).then(function(result) {
            return result;
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
