import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns {Promise<typeof mongoose | null>}
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillsetu';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Connection Warning]: Could not connect to ${mongoUri}. (${error.message})`);
    console.warn('[MongoDB Notice]: The server will continue running. In mock mode, the frontend functions standalone.');
    return null;
  }
};
