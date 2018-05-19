const authentication = require("./authentication");

// Resources
const OrderResource = require('./resources/order');

// Creates
const CustomerCreate = require("./creates/customer");
const OrderChangeStatus = require("./creates/order_change_status");
const OrderExport = require("./creates/order_export");
const OrderSendEmail = require("./creates/order_send_email");
const OrderSplit = require("./creates/order_split");
const OrderDelete = require("./creates/order_delete");

// Triggers
const OrderTriggers = require("./triggers/order");
const CustomerTriggers = require("./triggers/customer");
const CustomerGroupTrigger = require("./triggers/customer_group");

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
    // resources: {
    //     [OrderResource.key]: OrderResource,
    // },

    triggers: {
        [OrderTriggers.order_created.key]: OrderTriggers.order_created,
        [OrderTriggers.order_updated.key]: OrderTriggers.order_updated,
        [OrderTriggers.order_status_changed.key]: OrderTriggers.order_status_changed,
        [CustomerTriggers.customer_created.key]: CustomerTriggers.customer_created,
        [CustomerTriggers.customer_updated.key]: CustomerTriggers.customer_updated,
        [CustomerGroupTrigger.key]: CustomerGroupTrigger,
    },

    searches: {
        [OrderResource.search.key]: OrderResource.search,
    },

    creates: {
        [OrderChangeStatus.key]: OrderChangeStatus,
        [OrderExport.key]: OrderExport,
        [OrderSendEmail.key]: OrderSendEmail,
        [OrderSplit.key]: OrderSplit,
        [OrderDelete.key]: OrderDelete,
        [CustomerCreate.key]: CustomerCreate,
    }
};

// Finally, export the app.
module.exports = App;
