const sample = require("../samples/sample_order");
const common = require("../common");

const sendEmail = (z, bundle) => {

    const objID = bundle.inputData.id;

    // If the user provided any 'to' or 'cc' email addresses, use them, otherwise just use defaults.
    const split = (x) => x && x.split(/\s*,\s*/) || [];
    const tos = split(bundle.inputData.to);
    const ccs = split(bundle.inputData.cc);
    const body = JSON.stringify((tos.length + ccs.length) && {to: tos, cc: ccs} || {});

    return z.request({
        method: "POST",
        url: `${common.apiURL(bundle)}/orders/${objID}/actions/send_email`,
        body: body,
    }).then(response => JSON.parse(response.content));
};

module.exports = {
    key: "order_send_email",
    noun: "Order",

    display: {
        label: "Email Order Confirmation",
        description: "Sends an order to a specified list of email addresses.",
        important: false,
    },

    operation: {
        inputFields: [
            {
                key: "id",
                label: "ID",
                required: true
            },
            {
                key: "to",
                label: "To Email",
                required: true
            },
            {
                key: "cc",
                label: "CC Email",
            }
        ],
        perform: sendEmail,
        sample: sample
    }
};
