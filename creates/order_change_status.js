const sample = require("../samples/sample_order");
const common = require("../common");

const updateStatus = (z, bundle) => {
    const apiURL = common.apiURL(bundle);

    return z.request({
        method: "GET",
        url: `${apiURL}/orders/{{bundle.inputData.id}}`,
    }).then(response => z.request({
        method: "POST",
        url: `${apiURL}/orders/{{bundle.inputData.id}}/actions/changeStatus`,
        body: JSON.stringify({
            old: z.JSON.parse(response.content).status,
            new: bundle.inputData.new_status
        })
    })).then(response => z.JSON.parse(response.content));
};

module.exports = {
    key: "order_change_status",
    noun: "Order",

    display: {
        label: "Update Order Status",
        description: "Updates an order status.",
        important: true,
    },

    operation: {
        inputFields: [
            { key: "id", label: "ID", required: true},
            {
                key: "new_status",
                label:"New Status",
                choices: {
                    "New": "New",
                    "Hold for Confirm": "Hold for Confirm",
                    "Confirmed": "Confirmed",
                    "Processing": "Processing",
                    "Complete": "Complete"
                },
                required: true
            }
        ],
        perform: updateStatus,
        sample: sample
    }
};
