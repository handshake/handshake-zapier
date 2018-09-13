const sample = require("../samples/sample_order_category");
const common = require("../common");

const getOrderCategories = (z, bundle) => {
    return z.request({
        method: "GET",
        url: `${common.apiURL(bundle)}/order_categories`,
    }).then(response => z.JSON.parse(response.content).objects);
}

module.exports = {
    key: "order_category",
    noun: "Order",

    display: {
        label: "Get Order Categories",
        description: "Exists only to support dynamic drop-down",
        hidden: true
    },

    operation: {
        inputFields: [],
        perform: getOrderCategories,
        sample: sample
    }
};
