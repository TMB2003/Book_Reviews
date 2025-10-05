const serverless = require('serverless-http');
const app = require('../app');
const { connectDb } = require('../db');

// Initialize the HTTP handler immediately to avoid cold-start delays
let handler = serverless(app);

// Kick off DB connection in the background (once per runtime)
let dbInitPromise;
function ensureDbInit() {
  if (!dbInitPromise) {
    dbInitPromise = connectDb().catch((err) => {
      console.error('DB init error (non-blocking):', err && err.message ? err.message : err);
    });
  }
}

module.exports = async (req, res) => {
  // Do not block health checks on DB connection
  if (!req.url || !req.url.startsWith('/api/health')) {
    ensureDbInit();
  }
  return handler(req, res);
};
