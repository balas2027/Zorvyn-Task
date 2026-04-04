const mongoose = require("mongoose");

let connectionPromise = null;

const buildMongoUri = () => {
  const mongoUser = process.env.MONGODB_USERNAME;
  const mongoPassword = process.env.MONGODB_PASSWORD;
  const mongoHost = process.env.MONGODB_HOST;
  const mongoDatabase = process.env.MONGODB_DATABASE || "finance-tracker";
  const mongoAppName = process.env.MONGODB_APP_NAME || "Finance-Tracking";

  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  if (mongoUser && mongoPassword && mongoHost) {
    return `mongodb+srv://${encodeURIComponent(mongoUser)}:${encodeURIComponent(mongoPassword)}@${mongoHost}/${mongoDatabase}?appName=${encodeURIComponent(mongoAppName)}`;
  }

  return null;
};

const connectToMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    const mongoUri = buildMongoUri();

    if (!mongoUri) {
      throw new Error(
        "Missing MongoDB connection env vars. Set MONGODB_URI or MONGODB_USERNAME/MONGODB_PASSWORD/MONGODB_HOST.",
      );
    }

    connectionPromise = mongoose.connect(mongoUri).then((connection) => {
      console.log("Connected to MongoDB");
      return connection;
    });
  }

  return connectionPromise;
};

module.exports = { connectToMongo };
