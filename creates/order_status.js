const common = require("../common");
const sample = require('../samples/sample_order');

const updateStatus = (z, bundle) => {
  const promise = z.request({
    method: 'GET',
    url: `${common.apiURL(bundle)}/orders/{{bundle.inputData.id}}`
  });

  return promise.then(response => {
    oldStatus = JSON.parse(response.content).status;
    const responsePromise = z.request({
      method: 'POST',
      url: `${common.apiURL(bundle)}/orders/{{bundle.inputData.id}}/actions/changeStatus`,
      body: JSON.stringify({
        old: oldStatus,
        new: bundle.inputData.new_status
      })
    });
  return responsePromise
    .then(response => JSON.parse(response.content));
  })
};

module.exports = {
  key: 'order',
  noun: 'Order',

  display: {
    label: 'Update Order Status',
    description: 'Update an order status.',
    important: true
  },

  operation: {
    inputFields: [
      { 
        key: 'id', 
        label: 'ID', 
        helpText: "The order must already exist in Handshake.",
        required: true},
      {
        key: 'new_status', 
        label:'New Status', 
        choices: {
          'New': 'New',
          'Hold for Confirm': 'Hold for Confirm',
          'Confirmed': 'Confirmed',
          'Processing': 'Processing',
          'Complete': 'Complete'
        },
        required: true
      }
    ],
    perform: updateStatus,
    sample: sample
  }
};