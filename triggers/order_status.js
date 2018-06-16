const common = require("../common");
const triggers_common = require("./common");

const ORDER_STATUSES = [
    "Confirmed",
    "Processing",
    "Complete",
    "Seller review"
];

const performList  = (z, bundle) => {
    return z.request({
        method: "GET",
        url: `${common.baseURL(bundle)}/webhooks/sample/order_status_changed/latest`,
        params: {
            include_temp_auth: !!bundle.authData.include_temp_auth,
        }
    }).then((response) => {
        response = z.JSON.parse(response.content)
        if(bundle.inputData.status && bundle.inputData.status === response.status){
            return [response];
        } else {
            response.status = bundle.inputData.status
            return [response];
        }
        // return response.status < 300 ? [z.JSON.parse(response.content)] : [];
    }).catch((err) => {
        return [];
    });
};

module.exports = {
    key: 'order_status_changed',
    noun: 'Order Status Changed',

    display: {
        label: "Order Status Changed",
        description: "Triggers when an order changes to a specific status",
        important: true,
        hidden: false
    },

    operation: {
        
        inputFields: [
            {
                key: "status", 
                helpText: 'Which statuses this should trigger on.',
                choices: ORDER_STATUSES
            }
        ],

        type: 'hook',

        performSubscribe: triggers_common.make_performSubscribe("order_status_changed"),
        performUnsubscribe: triggers_common.unsubscribeHook,
        performList: performList,
        perform: triggers_common.onStatusChangeHookReceived,

        sample: {
            uuid: 1,
            name: "Test"
        },

        outputFields: []
    }
}