'use strict';

// Extracting error handling for the specific requests that need it
const parseResponse = (type, response) => {
  let results = [];

  if (response.status >= 200 && response.status < 300) {
    results = JSON.parse(response.content);
  } else {
    throw new Error(response.content);
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