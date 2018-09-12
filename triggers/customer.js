const common = require("../common");
const triggers_common = require("./common");
const sample_created = require("../samples/sample_trigger_customer_created");
const sample_updated = require("../samples/sample_trigger_customer_updated");

const makeCustomerTrigger = (eventType, label, desc, important = false, hidden, paramSample) => {
    return triggers_common.makeTrigger({
        resourceName: "customers",
        eventType: eventType,
        label: label,
        description: desc,
        important: important,
        hidden: hidden,
        sample: paramSample
    });
}

module.exports = {
    customer_created: makeCustomerTrigger(
        "customer_created",
        "New Customer",
        "Triggers when a new customer is created.",
        true,
        true, 
        sample_created
    ),
    customer_updated: makeCustomerTrigger(
        "customer_updated",
        "Updated Customer",
        "Triggers when a customer is updated.",
        false,
        true,
        sample_updated
    ),
};
