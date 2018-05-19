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


/**
 *  Returns a function that can be used for the `performList` in a trigger.
 */
const make_performList = (resourceName, apiToHookFunc) => {
    /**
     *  Poll the server to get sample data during Zap authoring.
     */
    const poll = (z, bundle) => {
        const options = {
            url: `${common.apiURL(bundle)}/${resourceName}`,
            params: {
                limit: 1,
            }
        };

        return z.request(options)
            .then((response) => {
                const data = z.JSON.parse(response.content)["objects"][0];
                return apiToHookFunc(z, bundle, data);
            })
            .then(payload => [payload]);
    };

    return poll;
};

/**
 *  Generate a trigger.
 */
const makeTrigger = (params) => {
    return {
        key: params.eventType,
        noun: params.label,

        display: {
            label: params.label,
            description: params.description,
            important: params.important || false,
        },

        operation: {
            inputFields: [
            ],

            type: "hook",

            performSubscribe: make_performSubscribe(params.eventType),
            performUnsubscribe: unsubscribeHook,
            performList: make_performList(params.resourceName, params.apiToHookFunc),
            perform: onHookReceived,

            sample: {
                uuid: 1,
                name: "Test"
            },

            outputFields: [
            ]
        }
    };
};


module.exports = {
    makeTrigger: makeTrigger,
};
