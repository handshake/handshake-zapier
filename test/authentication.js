'use strict';
const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);


describe('basic authentication', () => {
  // Put your test TEST_APIKEY in a .env file.
  // The inject method will load them and make them available to use in your
  // tests.
  zapier.tools.env.inject();

  it('should authenticate', (done) => {
    const bundle = {
      authData: {
        apiKey: process.env.TEST_APIKEY,
        //password: process.env.TEST_PASSWORD
      }
    };

    appTester(App.authentication.test, bundle)
      .then((response) => {
        response.status.should.equal(200);
        done();
      })
      .catch(done);
  });

});
