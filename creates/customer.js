const sample = require("../samples/sample_customer");
const customerGroup = require("../triggers/customer_group");
const common = require("../common");

const createCustomer = (z, bundle) => {
    return z.request({
        method: "POST",
        url: `${common.apiURL(bundle)}/customers`,
        body: JSON.stringify({
            id: bundle.inputData.id,
            name: bundle.inputData.name,
            contact: bundle.inputData.contact,
            email: bundle.inputData.email
        })
    }).then(response => JSON.parse(response.content));
};

module.exports = {
    key: "customer",
    noun: "Customer",

    display: {
        label: "Create Customer",
        description: "Creates a customer."
    },

    operation: {
        inputFields: [
            {key: "id", label:"ID", required: true},
            {key: "name", label:"Name", required: true},
            {key: "contact", label:"Contact", helpText: "Name of the primary contact at the customer account.",  required: true},
            {key: "email", label:"Email", required: true},
            {key: "customerGroup", label: "Customer Group", required: false, dynamic: "customerGroup.id.name"}

        ],
        perform: createCustomer,
        sample: sample
    }
};
