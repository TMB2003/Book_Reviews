const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { MONGO_URI_BOOK, MONGO_URI } = process.env;
const SINGLE_URI = MONGO_URI_BOOK || MONGO_URI;

if (!SINGLE_URI) {
  console.warn('⚠️ MONGO_URI_BOOK (or MONGO_URI) is not set in environment');
}

// Lazily created, cached connection (safe for serverless cold starts)
let dbConn = null;

async function connectDb() {
  if (!SINGLE_URI) throw new Error('No Mongo URI configured');
  if (dbConn && dbConn.readyState === 1) return dbConn; // connected

  if (!dbConn) {
    dbConn = mongoose.createConnection(SINGLE_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority',
    });
    dbConn.on('connected', () => console.log('✅ Mongo DB connected'));
    dbConn.on('error', (err) => console.error('❌ Mongo DB connection error:', err?.message || err));
    dbConn.on('disconnected', () => console.warn('⚠️ Mongo DB disconnected'));
  }

  await dbConn.asPromise();
  console.log('✅ MongoDB connection established');
  return dbConn;
}

function checkConnections() {
  return { db: dbConn?.readyState };
}

module.exports = { dbConn, connectDb, checkConnections };
