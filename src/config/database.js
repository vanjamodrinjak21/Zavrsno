const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ContactForm';

const mongooseOptions = {
    dbName: 'ContactForm',
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    w: 'majority',
    autoIndex: process.env.NODE_ENV !== 'production'
};

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        const conn = await mongoose.connect(mongoURI, mongooseOptions);
        
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection errors
        conn.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
            isConnected = false;
        });

        conn.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            isConnected = false;
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            try {
                await conn.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('Error during MongoDB disconnection:', err);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

// Export connection status checker
const isDbConnected = () => isConnected;

module.exports = {
    connectDB,
    mongoURI,
    isDbConnected
}; 