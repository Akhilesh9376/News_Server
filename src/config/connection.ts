import mongoose from 'mongoose';
import dotenv from 'dotenv' ;
dotenv.config(); 
async function connectDb() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/news-app';
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
}

export default connectDb ;