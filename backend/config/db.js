const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongodInstance = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri) {
      try {
        console.log(`Attempting to connect to configured MongoDB URI: ${mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@')}`);
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      } catch (externalErr) {
        console.warn(`Could not connect to external MongoDB: ${externalErr.message}. Falling back to high-performance MongoDB engine.`);
      }
    }

    // Fallback or default: Launch MongoMemoryServer instance for zero-friction hackathon execution
    console.log('Starting internal high-performance MongoDB instance...');
    mongodInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'learniq',
      },
    });
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`MongoDB Connected (In-Memory Engine): ${conn.connection.host} at ${memoryUri}`);
    return conn;
  } catch (error) {
    console.error(`Fatal MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error('Error closing database:', err);
  }
};

module.exports = { connectDB, closeDB };
