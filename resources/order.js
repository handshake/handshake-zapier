const common = require("../common");
const apiBaseURL = (bundle) => `${common.apiURL(bundle)}/orders`;

// get a single order
const getOrder = (z, bundle) => {
    return z.request({url: `${apiBaseURL(bundle)}/${bundle.inputData.id}`})
        .then(response => [z.JSON.parse(response.content)]);
};

// get a list of orders
const listOrders = (z, bundle) => {
    const responsePromise = z.request({
        url: apiBaseURL(bundle),
        params: {
            order_by: "-mtime"
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
            description: "Gets an order."
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
            description: "Lists the orders.",
            hidden: true
        },
        operation: {
            perform: listOrders
        }
    },

    search: {
        key: "order_search",
        noun: "Order",
        display: {
            label: "Find Order",
            hidden: true,
            description: "Finds an order by searching for its ID."
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
