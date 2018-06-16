const sample = require("../samples/sample_order");
const common = require("../common");

const exportOrder = (z, bundle) => {
    const objID = bundle.inputData.id;
    const format = bundle.inputData.format;

    return z.request({
        method: "POST",
        url: `${common.apiURL(bundle)}/orders/${objID}/actions/export?format=${format}`,
        body: JSON.stringify({}),
    }).then(response => JSON.parse(response.content));
};

module.exports = {
    key: "order_export",
    noun: "Order",

    display: {
        label: "Export Order",
        description: "Exports an order to HTML or CSV via the account's template.",
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
                key: "format",
                label: "Format",
                choices: {
                    html: "HTML",
                    csv: "CSV",
                },
                required: true,
            }
        ],
        perform: exportOrder,
        sample: sample
    }
};
