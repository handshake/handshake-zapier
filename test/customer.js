'use strict';
const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

//These are automated tests for the Issue create and Issue Trigger.
//They will run every time the `zapier test` command is executed.
describe('customer trigger', () => {
  zapier.tools.env.inject();

  // Make sure there's an open issue to fetch here!
  it('should get a customer', (done) => {
    const bundle = {
      authData: {
        apiKey: process.env.TEST_APIKEY
      }
    };
    appTester(App.triggers.customer.operation.perform, bundle)
      .then((response) => {
        response.should.be.an.instanceOf(Array);
        done();
      })
      .catch(done);
  });

  it('should create a customer', (done) => {
    const bundle = {
      authData: {
        apiKey: process.env.TEST_APIKEY,
      },
      inputData: {
        id: '123',
        name: 'Zapier',
        contact: 'Zapier test',
        email: 'zapier@test.com'
      }
    };
    appTester(App.creates.customer.operation.perform, bundle)
      .then((response) => {
        done();
      })
      .catch(done);
  });
});
