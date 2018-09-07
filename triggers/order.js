const common = require("../common");
const triggers_common = require("./common");
const sample_updated = require("../samples/sample_trigger_order_updated");
const sample_created = require("../samples/sample_trigger_order_created");

const ORDER_STATUSES = [
    "Confirmed",
    "Processing",
    "Complete",
    "Seller review",
];

const makeOrderTrigger = (eventType, label, desc, important, hidden, inputFields, paramSample) => {
    return triggers_common.makeTrigger({
        resourceName: "orders",
        eventType: eventType,
        label: label,
        description: desc,
        important: important,
        hidden: hidden,
        inputFields: inputFields,
        sample: paramSample
    });
}

module.exports = {
    order_created: makeOrderTrigger(
        "order_created",
        "New Order",
        "Triggers when a new order is created.",
        true,
        false,
        [],
        sample_created
    ),
    order_updated: makeOrderTrigger(
        "order_updated",
        "Updated Order",
        "Triggers when an order is updated.",
        false,
        true,
        [],
        sample_updated
    ),
    
    // order_status_changed: makeOrderTrigger(
    //     "order_status_changed",
    //     "Order Status Changed",
    //     "Triggers when an order changes status.",
    //     true,
    //     false,
    //     [
    //         { 
    //             key: "status", 
    //             helpText: 'Which statuses this should trigger on.' ,
    //             choices: ORDER_STATUSES
    //         }
    //     ]
    // )
};


