const sample = require("../samples/sample_customer");
const common = require("../common");

const triggerCustomer = (z, bundle) => {
    const responsePromise = z.request({
        method: "GET",
        url: `${common.baseURL}/api/latest/customers`,
        params: {
            sort_by: "-ctime"
        }
    });
    return responsePromise
        .then(response => z.JSON.parse(response.content).objects);
};

module.exports = {
    key: "customer",
    noun: "Customer",

    display: {
        label: "Get Customer",
        description: "Triggers on a new customer."
    },

    operation: {
        inputFields: [],
        perform: triggerCustomer,

        sample: sample
    }
    //outputFields: () => { return [];}
};
