const serverless = require('serverless-http');
const app = require('../app');
const { connectDb } = require('../db');

let handler; // cached between invocations in the same lambda instance

async function buildHandler() {
  await connectDb();
  return serverless(app);
}

module.exports = async (req, res) => {
  if (!handler) {
    handler = await buildHandler();
  }
  return handler(req, res);
};
