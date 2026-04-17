import mongoose from 'mongoose';
import { ENV } from './env.js';
let cachedConnection = null;

export const connectDB = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }
    try {
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log('Connected to MongoDB');
        cachedConnection = conn;
        return conn;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}