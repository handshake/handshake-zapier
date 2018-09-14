'use strict';

// Extracting error handling for the specific requests that need it
const parseResponse = (type, response) => {
  let results = [];

  if (response.status >= 200 && response.status < 300) {
  	z.console.log("Processed successfully")
    results = JSON.parse(response.content);
  } else {
  	z.console.log("Hit the error!")
  	errorMsg = JSON.parse(response.content).__all__[0];
    throw new Error(errorMsg);
  }

  return results;
};

const handleError = (error) => {
  if (typeof error === 'string') {
    throw new Error(error);
  }

  throw error;
};


module.exports = {
  parseResponse,
  handleError
};