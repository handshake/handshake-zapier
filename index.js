const customer = require('./triggers/customer');
const customerCreate = require('./creates/customer');
const customerGroup = require('./triggers/customer_group');
const authentication = require('./authentication');
const order = require('./creates/order');

const handleHTTPError = (response, z) => {
  if (response.status >= 400) {
    throw new Error(`Unexpected status code ${response.status}`);
  }
  return response;
};

const addApiKeyToHeader = (request, z, bundle) => {
  const basicHash = Buffer(`${bundle.authData.apiKey}:X`).toString('base64');
  request.headers.Authorization = `Basic ${basicHash}`;
  return request;
};

const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [addApiKeyToHeader],

  afterResponse: [
    handleHTTPError
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [customer.key]: customer,
    [customerGroup.key]: customerGroup
    // new_customer: {
    //   key: 'new_customer',
    //   noun: 'Customer',
    //   display: {
    //     label: 'New Customer',
    //     description: 'Triggers when a new customer is added'
    //   },
    //   operation: {
    //     perform: customerTrigger.triggerCustomer
    //   }
    // }
    // [newOrderTrigger.key]: newOrderTrigger,
    // [updatedOrderTrigger.key]: updatedOrderTrigger,
  },

  // If you want your searches to show up, you better include it here!
  searches: {
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [customerCreate.key]: customerCreate,
    [order.key]: order
  }
};

// Finally, export the app.
module.exports = App;
