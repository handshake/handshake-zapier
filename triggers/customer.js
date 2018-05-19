const common = require("../common");
const triggers_common = require("./common");

const makeCustomerTrigger = (eventType, label, desc, important = false) => {
    return triggers_common.makeTrigger({
        resourceName: "customers",
        eventType: eventType,
        label: label,
        description: desc,
        important: important,
    });
}

module.exports = {
    customer_created: makeCustomerTrigger(
        "customer_created",
        "Customer Created",
        "Triggers when a new customer is created"
    ),
    customer_updated: makeCustomerTrigger(
        "customer_updated",
        "Customer Updated",
        "Triggers when a customer is updated"
    ),
};
