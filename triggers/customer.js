const sample = require('../samples/sample_customer');

const pollingCustomer = (z, bundle) => {
  const responsePromise = z.request({
    method: 'GET',
    url: `https://glen.dev.handshake.com/api/latest/customers`,
    params: {
      sort_by: '-ctime'
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content).objects);
};

const subscribeHook = (z, bundle) => {
  const data = {
    url: bundle.targetUrl,
    event: bundle.event
  }

  const options = {
    url: 'http://glen.dev.handshake.com/webooks/zapier',
    method: 'POST',
    body: JSON.stringify(data)
  }

  return z.request(options)
    .then((response) => JSON.parse(response.content));
};

const unsubscribeHook = (z, bundle) => {
  const hookId = bundle.subscribeData.uuid;

  const options = {
    url: 'http://glen.dev.handshake.com/webooks/zapier/${hookId}',
    method: 'DELETE'
  };

  return z.request(options)
    .then((response) => JSON.parse(response.content));

};

const getCustomer = (z, bundle) => {
  const customer = {
    id: bundle.inputData.id,
    name:  bundle.inputData.name,
    email:  bundle.inputData.email,
    contact:  bundle.inputData.contact,
    paymentTerms:  bundle.inputData.paymentTerms,
    shippingMethod:  bundle.inputData.shippingMethod,

  };

  return [customer];
}

module.exports = {
  key: 'customer',
  noun: 'Customer',

  display: {
    label: 'Get Customer',
    description: 'Triggers on a new customer.'
  },

  operation: {
    type: hook,
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,

    inputFields: [],
    perform: getCustomer,
    performList: pollingCustomer,

    sample: sample
  }
  //outputFields: () => { return [];}
};
