const BASE_URL = process.env.BASE_URL || "https://app.handshake.com";
const API_PATH = process.env.API_PATH || "/api/v3";

const baseUrlForBundle = (bundle) => {
    return bundle.authData.subdomain &&
        `https://${bundle.authData.subdomain}.handshake.com` ||
        BASE_URL;
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
