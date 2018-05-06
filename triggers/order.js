const triggers_common = require("./common");

/**
 *  Triggers on order created using standard order hook payload.
 */
const onHookReceived = (z, bundle) => {
    // Wrap the dict the Handshake API returns for a detail URL
    return z.request({url: bundle.cleanedRequest.api_url})
        .then(response => [z.JSON.parse(response.content)]);
};

/**
 *  Generate a trigger for a SalesOrderWebhookSpec.
 */
const makeTrigger = (eventType, label, desc) => {
    return {
        key: eventType,
        noun: label,

        display: {
            label: label,
            description: desc,
        },

        operation: {
            inputFields: [

            ],

            type: "hook",

            performSubscribe: triggers_common.make_performSubscribe(eventType),
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
};

module.exports = {
    order_created: makeTrigger(
        "order_created",
        "Order Created",
        "Triggers when a new order is created"
    ),
    order_updated: makeTrigger(
        "order_updated",
        "Order Updated",
        "Triggers when an order is updated"
    ),
    order_status_changed: makeTrigger(
        "order_status_changed",
        "Order Status Changed",
        "Triggers when an order changes status"
    ),
};
