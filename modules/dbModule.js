"use strict";

module.exports = function(config) {

    var mongoose = require("mongoose"),
        errorMessage = require("../errors/errorMessage"),
        RouteDataModel,
        ShortestDistanceDataModel;


    function connect() {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.mongooseDBURL + config.databaseName, {
            useMongoClient: true
        }, function(error) {
            if (!error) {
                console.log("Database connected!");
            }
        }).catch(function(error) {
            console.log(new Error(errorMessage.DB.CANNOT_CONNECT));
            process.exit(1);
        });
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
