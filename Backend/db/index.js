const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Single Mongo URI for all collections
const { MONGO_URI_BOOK } = process.env;
const SINGLE_URI = MONGO_URI_BOOK;

if (!SINGLE_URI) {
  console.warn('⚠️ MONGO_URI_BOOK is not set');
}

// Single dedicated connection for all collections (users, books, reviews)
// Create immediately so models can bind to it via dbConn.model(...)
const dbConn = SINGLE_URI ? mongoose.createConnection(SINGLE_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  retryWrites: true,
  w: 'majority',
}) : null;

if (dbConn) {
  dbConn.on('connected', () => console.log('✅ Mongo DB connected'));
  dbConn.on('error', (err) => console.error('❌ Mongo DB connection error:', err?.message || err));
  dbConn.on('disconnected', () => console.warn('⚠️ Mongo DB disconnected'));
}

async function connectDb() {
  if (!dbConn) throw new Error('No Mongo URI configured');
  await dbConn.asPromise();
  console.log('✅ MongoDB connection established');
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
