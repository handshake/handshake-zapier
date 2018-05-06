const triggers_common = require("./common");

/**
 *  Triggers on order created using standard order hook payload.
 */
const onHookReceived = (z, bundle) => {
    // Wrap the dict the Handshake API returns for a detail URL
    return z.request({url: bundle.cleanedRequest.api_url})
        .then(response => [z.JSON.parse(response.content)]);
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

        performSubscribe: triggers_common.make_performSubscribe("order_created"),
        performUnsubscribe: triggers_common.unsubscribeHook,
        performList: triggers_common.make_performList("orders"),
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
