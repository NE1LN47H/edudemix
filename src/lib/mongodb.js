
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

const globalWithMongoose = globalThis;

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = {
    connection: null,
    promise: null,
  };
}

const cached = globalWithMongoose.mongoose;

export default async function connectToDatabase() {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.connection = await cached.promise;

  return cached.connection;
}
