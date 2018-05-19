const sample = require("../samples/sample_customer_group");
const common = require("../common");

const getCustomerGroup = (z, bundle) => {
    return z.request({
        method: "GET",
        url: `${common.apiURL(bundle)}/customer_groups`,
    }).then(response => z.JSON.parse(response.content).objects);
}

module.exports = {
    key: "customerGroup",
    noun: "Customer Group",


    display: {
        label: "Get Customer Group",
        description: "Triggers on a new customer group.",
        hidden: true
    },

    operation: {
        inputFields: [],
        perform: getCustomerGroup,

        sample: sample
    }
    //outputFields: () => { return [];}
};
