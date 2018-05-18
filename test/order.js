"use strict";
const should = require("should");
const zapier = require("zapier-platform-core");
const App = require("../index");
const appTester = zapier.createAppTester(App);

//These are automated tests for the Issue create and Issue Trigger.
//They will run every time the `zapier test` command is executed.
describe("order update", () => {
    zapier.tools.env.inject();

    // Make sure there"s an open issue to fetch here!
    it("should update an order", (done) => {
        const bundle = {
            authData: {
                apiKey: process.env.TEST_APIKEY
            },
            inputData: {
                id: "142",
                new_status: "Complete"
            }
        };
        appTester(App.creates.order.operation.perform, bundle)
            .then((response) => {
                done();
            })
            .catch(done);
    });
});
