const sample = require("../samples/sample_order");
const common = require("../common");
const _ = require("lodash");

const updateOrderCategory = (z, bundle) => {

    const url = `${common.apiURL(bundle)}/orders/${bundle.inputData.id}`;
    let needs_put = false;

    // Fetch the existing order
    return z.request(url)
        

        // Overwrite it with the user's input
        .then(response => {
            let order_data = z.JSON.parse(response.content);
            let promise = Promise.resolve(order_data);

            // Insert order category URI if required
            if (bundle.inputData.category) {
                promise = promise.then(order_data => z.request({
                    url: `${common.apiURL(bundle)}/order_categories`,
                    params: {id: bundle.inputData.category},
                }).then(response => {
                    const cat_uri = z.JSON.parse(response.content).objects[0].resource_uri;
                    order_data.category = cat_uri;
                    needs_put = true;
                    return order_data;
                }));
            }
            return promise;
        })

        // PUT the updated payload back into the API if required
        .then(order_data => {
            return z.request({
                method: "PUT",
                url: url,
                body: order_data,
            }).then(response => z.JSON.parse(response.content));
        })
};

module.exports = {
    key: "order_update_category",
    noun: "Order",

    display: {
        label: "Update Order Category",
        description: "Update the order category.",
        important: true,
    },

    operation: {
        inputFields: [
            {
                key: "id",
                label: "Order ID",
                helpText: "The order must already exist in Handshake.",
                required: true
            },
            {
                key: "category",
                label: "Order Category",
                required: false,
                dynamic: "order_category.id.name",
            }
        ],
        perform: updateOrderCategory,
        sample: sample,
    },
};
