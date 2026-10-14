const mongoose = require('mongoose');

let isConnectedToMongo = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartspend';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick check
    });
    isConnectedToMongo = true;
    console.log(`[SmartSpend DB] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnectedToMongo = false;
    console.warn(`[SmartSpend DB] MongoDB connection notice: ${error.message}`);
    console.log(`[SmartSpend DB] Activated resilient local file datastore (.data/smartspend.json) for zero-setup execution.`);
    return false;
  }
};

const getStatus = () => ({
  connected: isConnectedToMongo,
  mode: isConnectedToMongo ? 'MongoDB' : 'Resilient File Store'
});

module.exports = { connectDB, getStatus };
