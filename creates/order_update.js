const sample = require("../samples/sample_order");
const common = require("../common");

const updateOrder = (z, bundle) => {

    const url = `${common.apiURL(bundle)}/orders/${bundle.inputData.id}`;

    // Fetch the existing order
    return z.request(url)

        // Overwrite it with the user's input
        .then(response => {
            let order_data = z.JSON.parse(response.content);
            return Object.assign(order_data, bundle.inputData.properties)
        })

        // PUT the updated payload back into the API
        .then(order_data => z.request({
            method: "PUT",
            url: url,
            body: order_data,
        }))

        // Resolve to whatever the API responds with
        .then(response => z.JSON.parse(response.content));
};

module.exports = {
    key: "order_update",
    noun: "Order",

    display: {
        label: "Update Order",
        description: "Updates one or more fields on an order.",
    },

    operation: {
        inputFields: [
            {
                key: "id",
                label: "ID",
                required: true
            },
            {
                key: "properties",
                label: "Properties",
                dict: true,
            },
        ],
        perform: updateOrder,
        sample: sample,
    },
};
