const sample = require("../samples/sample_order");
const common = require("../common");
const _ = require("lodash");

const ORDER_STATUSES = [
    "Open",
    "Hold for confirm",
    "Confirmed",
    "Processing",
    "Complete",
    "Buyer review",
    "Seller review",
];

const updateOrder = (z, bundle) => {

    const url = `${common.apiURL(bundle)}/orders/${bundle.inputData.id}`;
    let needs_put = false;
    let needs_status_change = !!bundle.inputData.status;

    // Fetch the existing order
    return z.request(url)

        // Overwrite it with the user's input
        .then(response => {
            let order_data = z.JSON.parse(response.content);
            let promise = Promise.resolve(order_data);

            // Update with user-defined properties if required
            if (!_.isEmpty(bundle.inputData.properties)) {
                order_data = Object.assign(order_data, bundle.inputData.properties);
                needs_put = true;
            }

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
            if (needs_put) {
                return z.request({
                    method: "PUT",
                    url: url,
                    body: order_data,
                }).then(response => z.JSON.parse(response.content));
            } else {
                return Promise.resolve(order_data);
            }
        })

        // Fire status change action if required
        .then(order_data => {
            if (needs_status_change) {
                return z.request({
                    method: "POST",
                    url: `${common.baseURL(bundle)}${order_data.resource_uri}/actions/changeStatus`,
                    body: JSON.stringify({
                        old: order_data.status,
                        new: bundle.inputData.status,
                    }),
                }).then(response => {
                    const new_status = z.JSON.parse(response.content).status;
                    order_data.status = new_status;
                    return order_data;
                });
            } else {
                return order_data;
            }
        });
};

module.exports = {
    key: "order_update",
    noun: "Order",

    display: {
        label: "Update Order",
        description: "Updates status, category and other fields on an order.",
        important: true,
    },

    operation: {
        inputFields: [
            {
                key: "id",
                label: "ID",
                required: true
            },
            {
                key: "status",
                label: "Order Status",
                required: false,
                choices: ORDER_STATUSES,
            },
            {
                key: "category",
                label: "Order Category",
                required: false,
                dynamic: "order_category.id.name",
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
