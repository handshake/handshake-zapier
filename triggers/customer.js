const common = require("../common");
const triggers_common = require("./common");

/**
 *  Converts a standard orders API response to the webhook payload.
 */
const apiToHookFunc = (data) => {
    return {
        api_url: common.baseURL + data.resource_uri,
        domain: common.baseURL,
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
    };
};

const makeCustomerTrigger = (eventType, label, desc) => {
    return triggers_common.makeTrigger("customers", eventType, label, desc, apiToHookFunc);
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
