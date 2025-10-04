const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { MONGO_URI_USER, MONGO_URI_BOOK, MONGO_URI_REVIEW } = process.env;

if (!MONGO_URI_USER || !MONGO_URI_BOOK || !MONGO_URI_REVIEW) {
  console.warn('Ensure MONGO_URI_USER, MONGO_URI_BOOK, MONGO_URI_REVIEW exist in .env');
}

const userConn = mongoose.createConnection(MONGO_URI_USER || '', {});
const bookConn = mongoose.createConnection(MONGO_URI_BOOK || '', {});
const reviewConn = mongoose.createConnection(MONGO_URI_REVIEW || '', {});

async function connectAll() {
  try {
    await Promise.all([
      userConn.asPromise(),
      bookConn.asPromise(),
      reviewConn.asPromise(),
    ]);
    console.log('MongoDB connections established (user, book, review)');
  } catch (err) {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  }
}

module.exports = { userConn, bookConn, reviewConn, connectAll };
