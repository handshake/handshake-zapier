// triggers on order created with a certain tag
const triggerOrderCreated = (z, bundle) => {
    const responsePromise = z.request({
        url: "https://jsonplaceholder.typicode.com/posts",
        params: {
            tag: bundle.inputData.tagName
        }
    });
    return responsePromise
        .then(response => z.JSON.parse(response.content));
};

module.exports = {
    key: "order_created",
    noun: "Order created",

    display: {
        label: "Get Order created",
        description: "Triggers on a new order created."
    },

    operation: {
        inputFields: [

        ],
        perform: triggerOrderCreated,

        sample: {
            id: 1,
            name: "Test"
        },

        outputFields: [
            {key: "id", label: "ID"},
            {key: "name", label: "Name"}
        ]
    }
};
