import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Using environment variable for security
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shashwatandritisha:d2PsZCYVwKmewRlQ@storage.w4rs3jx.mongodb.net/vintage_cottage';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB; 