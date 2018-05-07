const common = require("../common");
const triggers_common = require("./common");

/**
 *  Triggers on order created using standard order hook payload.
 */
const onHookReceived = (z, bundle) => {
    return [bundle.cleanedRequest];
};

/**
 *  Converts a standard orders API response to the webhook payload.
 */
const apiToHookFunc = (data) => {
    return {
        api_url: common.baseURL + data.resource_uri,
        domain: common.baseURL,
        account_hash: "61237ASDCASASD76767767=",
        order_id: data.objID,
        order_uuid: data.uuid,
        customer_id: data.customer.id,
        customer_name: data.customer.name,
        customer_uuid: data.customer.uuid,
        status: data.status,
        total_amount: data.totalAmount,
        total_amount_formatted: `$${ (data.totalAmount * 100).toFixed(2) }`,
        total_amount_in_cents: Math.round(data.totalAmount * 100),
        num_lines: data.lines.length,
        order_source: data.sourceType,
        external_id: data.externalID,
        old_status: data.status,
        is_new: false,
        // csv_export_url
        // html_export_url
        // web_url
    };
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
            performList: triggers_common.make_performList("orders", apiToHookFunc),
            perform: onHookReceived,

            sample: {
                uuid: 1,
                name: "Test"
            },

            outputFields: [
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
