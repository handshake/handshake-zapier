const SERVER_ADDR = process.env.SERVER_ADDR || "app.handshake.com";
const API_PATH = process.env.API_PATH || "/api/v3";

const baseUrlForBundle = (bundle) => {
    return `https://${bundle.authData.server || SERVER_ADDR}`;
};

const apiUrlForBundle = (bundle) => {
    return baseUrlForBundle(bundle) + API_PATH;
};

const hookUrlForBundle = (bundle) => {
    return baseUrlForBundle(bundle) + "/webhooks/zapier";
};

// Common settings across the app
module.exports = {
    baseURL: baseUrlForBundle,
    hookURL: hookUrlForBundle,
    apiURL: apiUrlForBundle,
};
