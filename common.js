const BASE_URL = process.env.BASE_URL || "https://app.handshake.com";
const API_PATH = process.env.API_PATH || "/api/v3";

// Common settings across the app
module.exports = {
    baseURL: BASE_URL,
    hookURL: BASE_URL + "/webhooks/zapier",
    apiURL: BASE_URL + API_PATH,
};
