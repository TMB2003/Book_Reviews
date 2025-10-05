const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { MONGO_URI_BOOK } = process.env.MONGO_URI_BOOK;
const SINGLE_URI = MONGO_URI_BOOK;

if (!SINGLE_URI) {
  console.warn('⚠️ No Mongo URI found. Set one of: MONGO_URI_BOOK, MONGODB_URI, MONGO_URI, MONGO_URL');
}

// Single dedicated connection for all collections (users, books, reviews)
const dbConn = SINGLE_URI ? mongoose.createConnection(SINGLE_URI, {}) : null;

if (dbConn) {
  dbConn.on('connected', () => console.log('✅ Mongo DB connected'));
  dbConn.on('error', (err) => console.error('❌ Mongo DB connection error:', err));
  dbConn.on('disconnected', () => console.warn('⚠️ Mongo DB disconnected'));
}

async function connectDb() {
  try {
    if (!dbConn) throw new Error('No Mongo URI configured');
    await dbConn.asPromise();
    console.log('✅ MongoDB connection established');
  } catch (err) {
    console.error('❌ Mongo connection error:', err.message);
    // In serverless environments avoid exiting the entire process
    // so that the platform can handle retries or show proper errors
    throw err;
  }
}

process.on('SIGINT', async () => {
  if (dbConn) await dbConn.close();
  console.log('🛑 MongoDB connection closed due to app termination');
  process.exit(0);
});

function checkConnections() {
  return { db: dbConn?.readyState };
}

module.exports = { dbConn, connectDb, checkConnections };
