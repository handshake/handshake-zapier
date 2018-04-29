const sample = require('../samples/sample_customer');

const triggerCustomer = (z, bundle) => {
  const responsePromise = z.request({
    method: 'GET',
    url: `https://app.handshake.com/api/latest/customers`,
    params: {
      sort_by: '-ctime'
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content).objects);
};

module.exports = {
  key: 'customer',
  noun: 'Customer',

  display: {
    label: 'Get Customer',
    description: 'Triggers on a new customer.'
  },

  operation: {
    inputFields: [],
    perform: triggerCustomer,

    sample: sample
  }
  //outputFields: () => { return [];}
};
