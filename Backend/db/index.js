const mongoose = require("mongoose");

const { MONGO_URI_BOOK } = process.env;

if (!MONGO_URI_BOOK) {
  throw new Error("⚠️ MONGO_URI_BOOK is not set in environment variables.");
}

// Use global object to store cached connection (important for serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
  if (cached.conn) {
    console.log("🔁 Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🕓 Creating new MongoDB connection...");
    cached.promise = mongoose.connect(MONGO_URI_BOOK, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // fail fast if not reachable
    }).then((mongooseInstance) => {
      console.log("✅ MongoDB connected");
      return mongooseInstance;
    }).catch((err) => {
      console.error("❌ Mongo connection error:", err.message);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectDb };
