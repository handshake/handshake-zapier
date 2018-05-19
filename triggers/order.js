const common = require("../common");
const triggers_common = require("./common");

/**
 *  Converts a standard orders API response to the webhook payload.
 */
const apiToHookFunc = (z, bundle, data) => {
    let baseURL = common.baseURL(bundle)
    let apiURL = baseURL + data.resource_uri;

    // Fetch the actual category if there is one
    let cat_promise = (typeof data.category === "string") &&
        z.request(baseURL + data.category).
        then(response => z.JSON.parse(response.content)) ||
        Promise.resolve(null);

    return cat_promise.then(category => {
        return {
            api_url: apiURL,
            domain: baseURL,
            account_hash: "61237ASDCASASD76767767=",
            order_id: data.objID,
            order_uuid: data.uuid,
            customer_id: data.customer && data.customer.id || null,
            customer_name: data.customer && data.customer.name || null,
            customer_uuid: data.customer && data.customer.uuid || null,
            status: data.status,
            total_amount: data.totalAmount,
            total_amount_formatted: `$${ (data.totalAmount * 100).toFixed(2) }`,
            total_amount_in_cents: Math.round(data.totalAmount * 100),
            num_lines: data.lines.length,
            order_source: data.sourceType,
            external_id: data.externalID,
            old_status: data.status,
            is_new: false,
            csv_export_url: `${apiURL}/actions/export?format=csv`,
            html_export_url: `${apiURL}/actions/export?format=html`,
            category_id: category && category.id || null,
            manufacturer_id: null,
        };
    });
};

const makeOrderTrigger = (eventType, label, desc, important) => {
    return triggers_common.makeTrigger({
        resourceName: "orders",
        eventType: eventType,
        label: label,
        description: desc,
        apiToHookFunc: apiToHookFunc,
        important: important,
    });
}

module.exports = {
    order_created: makeOrderTrigger(
        "order_created",
        "Order Created",
        "Triggers when a new order is created",
        true
    ),
    order_updated: makeOrderTrigger(
        "order_updated",
        "Order Updated",
        "Triggers when an order is updated",
        true
    ),
    order_status_changed: makeOrderTrigger(
        "order_status_changed",
        "Order Status Changed",
        "Triggers when an order changes status",
        true
    ),
};
