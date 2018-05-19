const sample = require("../samples/sample_order");
const common = require("../common");

const deleteOrder = (z, bundle) => {
    return z.request({
        method: "DELETE",
        url: `${common.apiURL(bundle)}/orders/${bundle.inputData.id}`,
    }).then(response => {
        return {deleted_id: bundle.inputData.id};
    });
};

module.exports = {
    key: "order_delete",
    noun: "Order",

    display: {
        label: "Delete Order",
        description: "Deletes an order.",
    },

    operation: {
        inputFields: [
            {
                key: "id",
                label: "ID",
                required: true
            },
        ],
        perform: deleteOrder,
        sample: sample,
    },
};
