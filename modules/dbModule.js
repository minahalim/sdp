"use strict";

module.exports = function(config) {

    var mongoose = require("mongoose"),
        errorMessage = require("../errors/errorMessage"),
        RouteDataModel,
        ShortestDistanceDataModel;


    function connect() {
        // default to a 'localhost' configuration:
        var connectionString = '127.0.0.1:27017/' + config.databaseName;
        // if OPENSHIFT env variables are present, use the available connection info:
        if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
          connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
          process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
          process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
          process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
          process.env.OPENSHIFT_APP_NAME;
        }

        mongoose.Promise = global.Promise;
        mongoose.connect(connectionString, {
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
