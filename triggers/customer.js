const common = require("../common");
const triggers_common = require("./common");

/**
 *  Converts a standard orders API response to the webhook payload.
 */
const apiToHookFunc = (z, bundle, data) => {
    const baseURL = common.baseURL(bundle);
    return Promise.resolve({
        api_url: baseURL + data.resource_uri,
        domain: baseURL,
        account_hash: "61237ASDCASASD76767767=",
        customer_id: data.id,
        customer_name: data.name,
        customer_uuid: data.uuid,
        customer_obj_id: data.objID,
        customer_email: data.email,
        category_id: data.customerGroup && data.customerGroup.id || null,
        external_id: data.externalID,
        // has_direct_access
        // user_group_ids
        // web_url
    });
};

const makeCustomerTrigger = (eventType, label, desc, important = false) => {
    return triggers_common.makeTrigger({
        resourceName: "customers",
        eventType: eventType,
        label: label,
        description: desc,
        apiToHookFunc: apiToHookFunc,
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
