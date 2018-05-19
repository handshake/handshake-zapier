const sample = require("../samples/sample_order");
const common = require("../common");

const splitOrder = (z, bundle) => {
    const objID = bundle.inputData.id;
    const t = bundle.inputData.group_by_template.replace("[[", "{{").replace("]]", "}}");

    return z.request({
        method: "POST",
        url: `${common.apiURL(bundle)}/orders/${objID}/actions/split`,
        body: JSON.stringify({
            group_by_template: t,
            keep_original: !!bundle.inputData.keep_original,
            new_status: bundle.inputData.new_status,
            new_category_id: bundle.inputData.new_category_id,
        }),
    }).then(response => JSON.parse(response.content));
};

module.exports = {
    key: "order_split",
    noun: "Order",

    display: {
        label: "Split Order",
        description: "Splits an order by a user-defined key."
    },

    operation: {
        inputFields: [
            {
                key: "id",
                label: "ID",
                required: true
            },
            {
                key: "group_by_template",
                label: "Template to group lines by",
                required: true,
                default: "[[ line.item.manufacturer.id ]]",
            },
            {
                key: "keep_original",
                label: "Keep original order after split",
                type: "boolean",
                required: true,
                default: "yes",
            },
            {
                key: "new_status",
                label: "New Order Status",
                choices: {
                    "New": "New",
                    "Hold for Confirm": "Hold for Confirm",
                    "Confirmed": "Confirmed",
                    "Processing": "Processing",
                    "Complete": "Complete",
                },
            },
            {
                key: "new_category_id",
                label: "New Order Category ID",
                dynamic: "order_category.id.name",
            },
        ],
        perform: splitOrder,
        sample: sample
    }
};
