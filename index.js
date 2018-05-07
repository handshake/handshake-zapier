const authentication = require("./authentication");
const customerCreate = require("./creates/customer");
const customerGroupTrigger = require("./triggers/customer_group");
const orderCreate = require("./creates/order");
const orderTriggers = require("./triggers/order");
const customerTriggers = require("./triggers/customer");

const handleHTTPError = (response, z) => {
    if (response.status >= 400) {
        throw new Error(`Unexpected status code ${response.status}`);
    }
    return response;
};

const addApiKeyToHeader = (request, z, bundle) => {
    const basicHash = Buffer(`${bundle.authData.apiKey}:X`).toString("base64");
    request.headers.Authorization = `Basic ${basicHash}`;
    return request;
};

const App = {
    // This is just shorthand to reference the installed dependencies you have. Zapier will
    // need to know these before we can upload
    version: require("./package.json").version,
    platformVersion: require("zapier-platform-core").version,
    authentication: authentication,

    // beforeRequest & afterResponse are optional hooks into the provided HTTP client
    beforeRequest: [addApiKeyToHeader],

    afterResponse: [
        handleHTTPError
    ],

    // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
    resources: {
    },

    // If you want your trigger to show up, you better include it here!
    triggers: {
        [customerTriggers.customer_created.key]: customerTriggers.customer_created,
        [customerTriggers.customer_updated.key]: customerTriggers.customer_updated,
        [orderTriggers.order_created.key]: orderTriggers.order_created,
        [orderTriggers.order_updated.key]: orderTriggers.order_updated,
        [orderTriggers.order_status_changed.key]: orderTriggers.order_status_changed,
        [customerGroupTrigger.key]: customerGroupTrigger,
    },

    // If you want your searches to show up, you better include it here!
    searches: {
    },

    // If you want your creates to show up, you better include it here!
    creates: {
        [customerCreate.key]: customerCreate,
        [orderCreate.key]: orderCreate,
    }
};

// Finally, export the app.
module.exports = App;
