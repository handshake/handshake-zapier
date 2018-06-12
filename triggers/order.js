const common = require("../common");
const triggers_common = require("./common");

const makeOrderTrigger = (eventType, label, desc, important) => {
    return triggers_common.makeTrigger({
        resourceName: "orders",
        eventType: eventType,
        label: label,
        description: desc,
        important: important,
    });
}

module.exports = {
    order_created: makeOrderTrigger(
        "order_created",
        "New Order",
        "Triggers when a new order is created.",
        true
    ),
    order_updated: makeOrderTrigger(
        "order_updated",
        "Updated Order",
        "Triggers when an order is updated.",
        true
    ),
    order_status_changed: makeOrderTrigger(
        "order_status_changed",
        "Order Status Changed",
        "Triggers when an order changes status.",
        true
    ),
};
