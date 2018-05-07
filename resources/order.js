const common = require("../common");
const apiBaseURL = `${common.apiURL}/orders`;

// get a single order
const getOrder = (z, bundle) => {
    return z.request({url: `${apiBaseURL}/${bundle.inputData.id}`})
        .then(response => [z.JSON.parse(response.content)]);
};

// get a list of orders
const listOrders = (z) => {
    const responsePromise = z.request({
        url: apiBaseURL,
        params: {
            order_by: "-ctime"
        }
    });
    return responsePromise
        .then(response => z.JSON.parse(response.content).objects);
};

// create a order
const createOrder = (z, bundle) => {
    const responsePromise = z.request({
        method: "POST",
        url: "https://jsonplaceholder.typicode.com/posts",
        body: {
            name: bundle.inputData.name // json by default
        }
    });
    return responsePromise
        .then(response => z.JSON.parse(response.content));
};

module.exports = {
    key: "order",
    noun: "Order",

    get: {
        display: {
            label: "Get Order",
            description: "Gets a order."
        },
        operation: {
            inputFields: [
                {key: "id", required: true}
            ],
            perform: getOrder
        }
    },

    list: {
        display: {
            label: "New Order",
            description: "Lists the orders."
        },
        operation: {
            perform: listOrders
        }
    },

    search: {
        display: {
            label: "Find Order",
            description: "Finds an order by searching."
        },
        operation: {
            inputFields: [
                {key: "id", required: true}
            ],
            perform: getOrder,
        },
    },

    create: {
        display: {
            label: "Create Order",
            description: "Creates a new order."
        },
        operation: {
            inputFields: [
                {key: "name", required: true}
            ],
            perform: createOrder
        },
    },

    sample: {
        id: 1,
        name: "Test"
    },

    outputFields: [
        {key: "objID", label: "ID"},
        {key: "totalAmount", label: "Total Amount"},
        {key: "customer", label: "Customer"},
        {key: "lines", label: "Lines"},
    ]
};
