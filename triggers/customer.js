const common = require("../common");
const triggers_common = require("./common");

const makeCustomerTrigger = (eventType, label, desc, important = false, hidden) => {
    return triggers_common.makeTrigger({
        resourceName: "customers",
        eventType: eventType,
        label: label,
        description: desc,
        important: important,
        hidden: hidden
    });
}

module.exports = {
    customer_created: makeCustomerTrigger(
        "customer_created",
        "New Customer",
        "Triggers when a new customer is created.",
        true,
        false
    ),
    customer_updated: makeCustomerTrigger(
        "customer_updated",
        "Updated Customer",
        "Triggers when a customer is updated.",
        false,
        true
    ),
};
