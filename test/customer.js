'use strict';
const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

//These are automated tests for the customer create and customer trigger.
//They will run every time the `zapier test` command is executed.
describe('customer trigger', () => {
  zapier.tools.env.inject();


  it('should get a customer', (done) => {
    const bundle = {
      authData: {
        apiKey: process.env.TEST_APIKEY
      },
      cleanedRequest: {
        id: 123,
        name: "Zapier Customer",
        email:  "zapier@handshake.com",
        contact:  "Zapier Conact",
        paymentTerms:  "NET30",
        shippingMethod: "FEXEX"
      }
    };
    appTester(App.triggers.customer.operation.perform, bundle)
      .then((response) => {
        response.length.should.eql(1);
        response.should.be.an.instanceOf(Array);
        
        const customer = response[0];

        customer.id.should.eq(123);
        customer.name.should.eq("Zapier Customer");
        customer.email.should.eq("zapier@handshake.com");
        customer.contact.should.eq("Zapier Conact");
        customer.paymentTerms.should.eq("NET30");
        customer.shippingMethod.should.eq("FEDEX");

        done();
      })
      .catch(done);
  });

  it('should load customers via polling', (done) => {
    const bundle = {
      authData: {
        apiKey: process.env.TEST_APIKEY
      }

      appTester(App.triggers.customer.operation.performList, bundle)
        .then((response) => {
          response.length.should.be.greaterThan(1);

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
