const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const {
  MONGO_URI_USER,
  MONGO_URI_BOOK,
  MONGO_URI_REVIEW
} = process.env;

// Warn if any URIs are missing
if (!MONGO_URI_USER || !MONGO_URI_BOOK || !MONGO_URI_REVIEW) {
  console.warn('⚠️ Ensure MONGO_URI_USER, MONGO_URI_BOOK, and MONGO_URI_REVIEW are set in the .env file');
}

// Create connections (only if URIs exist)
const userConn = MONGO_URI_USER ? mongoose.createConnection(MONGO_URI_USER, {}) : null;
const bookConn = MONGO_URI_BOOK ? mongoose.createConnection(MONGO_URI_BOOK, {}) : null;
const reviewConn = MONGO_URI_REVIEW ? mongoose.createConnection(MONGO_URI_REVIEW, {}) : null;

// Optional: Add event listeners for debugging
function attachListeners(conn, name) {
  if (!conn) return;
  conn.on('connected', () => console.log(`✅ ${name} DB connected`));
  conn.on('error', (err) => console.error(`❌ ${name} DB connection error:`, err));
  conn.on('disconnected', () => console.warn(`⚠️ ${name} DB disconnected`));
}

attachListeners(userConn, 'User');
attachListeners(bookConn, 'Book');
attachListeners(reviewConn, 'Review');

// Connect all and wait
async function connectAll() {
  try {
    const connections = [userConn, bookConn, reviewConn].filter(Boolean);
    await Promise.all(connections.map(conn => conn.asPromise()));
    console.log('✅ All MongoDB connections established (user, book, review)');
  } catch (err) {
    console.error('❌ Mongo connection error:', err.message);
    process.exit(1);
  }
}

// Optional: Graceful shutdown
process.on('SIGINT', async () => {
  const connections = [userConn, bookConn, reviewConn].filter(Boolean);
  await Promise.all(connections.map(conn => conn.close()));
  console.log('🛑 MongoDB connections closed due to app termination');
  process.exit(0);
});

// Optional: Check connection health
function checkConnections() {
  return {
    user: userConn?.readyState,
    book: bookConn?.readyState,
    review: reviewConn?.readyState
  };
}

module.exports = {
  userConn,
  bookConn,
  reviewConn,
  connectAll,
  checkConnections
};
