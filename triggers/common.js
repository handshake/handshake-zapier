// Logic that is common to the handling of all webhooks

const common = require("../common");

/**
 *  Returns a function that can be used for the `performSubscribe` in a trigger.
 */
const make_performSubscribe = (eventName) => {

    /**
     *  Create a new webhook subscription with the Handshake server.
     */
    const subscribeHook = (z, bundle) => {
        const options = {
            url: common.hookURL(bundle),
            method: "POST",
            body: JSON.stringify({
                target_url: bundle.targetUrl,
                event: eventName,
                include_temp_auth: !!bundle.authData.include_temp_auth,
            }),
        };

        return z.request(options)
            .then((response) => JSON.parse(response.content));
    };

    return subscribeHook;
};

/**
 *  Delete an existing webhook subscription on the Handshake server.
 *
 *  All hooks can use this common logic.
 */
const unsubscribeHook = (z, bundle) => {
    const options = {
        url: common.hookURL(bundle),
        method: "DELETE",
        body: {target_url: bundle.targetUrl},
    };

    // The response for a 200 OK doesn't contain any data
    return z.request(options)
        .then((response) => []);
};


/**
 *  Just return the hook payload whenever one arrives.  Reaching back out to API is expensive.
 */
const onHookReceived = (z, bundle) => {
    return [bundle.cleanedRequest]; 
};

const onStatusChangeHookReceived = (z, bundle) => {
    if(bundle.inputData.status && bundle.inputData.status === bundle.cleanedRequest.status){
        z.console.log("bundle.inputData.status ===" + bundle.inputData.status);
        z.console.log("bundle.cleanedRequest.status ===" + bundle.cleanedRequest.status);
        return [bundle.cleanedRequest];
    } else if(!bundle.inputData.status){
        // If there is no status to filter on, then just return the request regardless)
        z.console.log("bundle.inputData.status ===" + bundle.inputData.status);
        z.console.log("bundle.cleanedRequest.status ===" + bundle.cleanedRequest.status);
        return [bundle.cleanedRequest];
    } else {
        // If the status doesn't match the filter, but the filter exists, then don't return anything so the
        // trigger doesn't run
        return [];
    }
}


/**
 *  Returns a function that can be used for the `performList` in a trigger.
 */
const make_performList = (eventType) => {

    /**
     *  Request sample data from the server for this event_type.
     */
    return (z, bundle) => {
        return z.request({
            method: "GET",
            url: `${common.baseURL(bundle)}/webhooks/sample/${eventType}/latest`,
            params: {
                include_temp_auth: !!bundle.authData.include_temp_auth,
            }
        }).then((response) => {
            return response.status < 300 ? [z.JSON.parse(response.content)] : [];
        }).catch((err) => {
            return [];
        });
    };
};

/**
 *  Generate a trigger.
 */
const makeTrigger = (params) => {
    return {
        key: params.eventType,
        noun: params.noun,

        display: {
            label: params.label,
            description: params.description,
            important: params.important || false,
            hidden: params.hidden
        },

        operation: {
            
            inputFields: params.inputFields,
            

            type: "hook",

            performSubscribe: make_performSubscribe(params.eventType),
            performUnsubscribe: unsubscribeHook,
            performList: make_performList(params.eventType),
            perform: onHookReceived,

            sample: params.sample,

            outputFields: [
            ]
        }
    };
};


module.exports = {
    makeTrigger: makeTrigger,
    make_performSubscribe: make_performSubscribe,
    make_performList: make_performList,
    unsubscribeHook: unsubscribeHook,
    onStatusChangeHookReceived: onStatusChangeHookReceived
};
