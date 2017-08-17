"use strict";

var app,
    http = require("http"),
    port = process.env.PORT || "8080",
    fs = require("fs"),
    nock = require("nock"),
    request = require("request"),
    proxyquire = require("proxyquire"),
    lodash = require("lodash"),
    dynamoResponses;

before(function() {
    // nock.recorder.rec({
    //     "output_objects": true,
    //     "dont_print": true,
    //     "enable_reqheaders_recording": true
    // });
    var nockDefs = nock.loadDefs("./test_all/nock.json"),
        filteredNockDefs = nockDefs.filter(n => n.scope !== "http://localhost:9000" && n.scope !== "http://localhost:8080")
                                    .map(n => {
                                        if (n.scope === "https://loginstg.astro.com.my:443" || n.scope === "https://des-aws-stg.astro.com.my:443") {
                                            delete n.body.siginfo;
                                        }
                                        if (n.reqheaders) {
                                            delete n.reqheaders;
                                        }
                                        return n;
                                    }),
        nocks = nock.define(filteredNockDefs);

    // set all lastaccesseddate to "2016-01-01.T00:00:00+08:00" to match it
    dynamoResponses = nockDefs.filter(n => n.scope === "http://localhost:9000")
                                .map(n => {
                                    if (n.body.Item) {
                                        if (n.body.Item.lastaccesseddate) {
                                            n.body.Item.lastaccesseddate = "2016-01-01.T00:00:00+08:00";
                                        }
                                        if (n.body.Item.registrationdate) {
                                            n.body.Item.registrationdate = "2016-01-01.T00:00:00+08:00";
                                        }
                                        if (n.body.Item.switchoutdate) {
                                            n.body.Item.switchoutdate = "2016-01-01.T00:00:00+08:00";
                                        }
                                    }
                                    return n;
                                });
    // nocks.forEach(n => n.log(data => console.error("===== nock: " + data)));
});

after(function() {
    // fs.writeFileSync("nock.json", JSON.stringify(nock.recorder.play(), null, "  "));
});


describe("API", function() {
    before(function(done) {
        this.timeout(3000);

        // Global mock on aws-sdk
        app = proxyquire("../server", {
            "aws-sdk": {
                "@global": true,
                "config": {update: () => {}},
                "DynamoDB": function() {
                    var methods = [
                            "putItem",
                            "createTable",
                            "listTables",
                            "deleteTable",
                            "deleteItem",
                            "getItem",
                            "query",
                            "deleteItem",
                            "describeTable",
                            "scan"
                        ],
                        funcs = {},
                        responseIndex;

                    // create method for each dynamodb call
                    methods.forEach(method => {
                        funcs[method] = (params, cb) => {
                            responseIndex = dynamoResponses.findIndex(resp => {
                                if (params.Item) {
                                    if (params.Item.lastaccesseddate) {
                                        params.Item.lastaccesseddate = "2016-01-01.T00:00:00+08:00";
                                    }
                                    if (params.Item.registrationdate) {
                                        params.Item.registrationdate = "2016-01-01.T00:00:00+08:00";
                                    }
                                    if (params.Item.switchoutdate) {
                                        params.Item.switchoutdate = "2016-01-01.T00:00:00+08:00";
                                    }
                                }

                                if (!lodash.isEqual(resp.body, params)) {
                                    return false;
                                }
                                return resp.reqheaders["x-amz-target"] && resp.reqheaders["x-amz-target"].toLowerCase().endsWith(method.toLowerCase());
                            });

                            if (responseIndex !== -1) {
                                cb(undefined, dynamoResponses[responseIndex].response);
                                dynamoResponses.splice(responseIndex, 1);
                            } else {
                                cb(new Error("AWS: response not found"), undefined);
                            }
                        };
                    });

                    return funcs;
                }
            }
        });

        var server = http.createServer(app);
        server.listen(port);
        server.on("listening", function() {
            done();
        });
    });
    require("./api")();
});
