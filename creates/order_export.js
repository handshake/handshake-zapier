const sample = require("../samples/sample_create_order_export");
const common = require("../common");

const utils = require('../utils');
const parseResponse = utils.parseResponse;

const exportOrder = (z, bundle) => {
    const objID = bundle.inputData.id;
    const format = bundle.inputData.format;

    return z.request({
        method: "POST",
        url: `${common.apiURL(bundle)}/orders/${objID}/actions/export?format=${format}`,
        body: JSON.stringify({}),
    // }).then(response => JSON.parse(response.content));
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return JSON.parse(response.content);
      } else {
        errorMsg = JSON.parse(response.content).__all__[0];
        throw new Error(errorMsg);
      } 
    });
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
