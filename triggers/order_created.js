const common = require("../common");

/**
 *  Triggers on order created using standard order hook payload.
 */
const onHookReceived = (z, bundle) => {
    // Wrap the dict the Handshake API returns for a detail URL
    return z.request({url: bundle.cleanedRequest.api_url})
        .then(response => [z.JSON.parse(response.content)]);
};

/**
 *  Create a new webhook subscription with the Handshake server.
 */
const subscribeHook = (z, bundle) => {
    const options = {
        url: common.hookURL,
        method: "POST",
        body: JSON.stringify({
            target_url: bundle.targetUrl,
            event: module.exports.key,
        }),
    };

    return z.request(options)
        .then((response) => JSON.parse(response.content));
};

/**
 *  Delete an existing webhook subscription on the Handshake server.
 */
const unsubscribeHook = (z, bundle) => {
    const options = {
        url: common.hookURL,
        method: "DELETE",
        body: {target_url: bundle.targetUrl},
    };

    // The response for a 200 OK doesn't contain any data
    return z.request(options)
        .then((response) => []);
};

/**
 *  Poll the server to get sample data during Zap authoring.
 */
const poll = (z, bundle) => {
    const options = {
        url: `${ common.apiURL }/orders`,
        params: {
            limit: 1,
        }
    };

    return z.request(options)
        .then((response) => z.JSON.parse(response.content)["objects"]);
};

module.exports = {
    key: "order_created",
    noun: "Order Created",

    display: {
        label: "Order Created",
        description: "Triggers on a new order created."
    },

    operation: {
        inputFields: [

        ],
        type: "hook",

        performSubscribe: subscribeHook,
        performUnsubscribe: unsubscribeHook,
        performList: poll,
        perform: onHookReceived,

        sample: {
            uuid: 1,
            name: "Test"
        },

        outputFields: [
            {key: "uuid", label: "UUID"},
            {key: "order_id", label: "Order ID"}
        ]
    }
};
