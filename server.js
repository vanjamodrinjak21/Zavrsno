require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dbConfig = require('./config/database');
const messageRoutes = require('./src/routes/messages');

const app = express();
const port = process.env.PORT || 3002;

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware with increased limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory
app.use(express.static('public'));

// MongoDB connection with retry logic
const connectDB = async (retries = 5) => {
    while (retries) {
        try {
            await mongoose.connect(dbConfig.mongoURI, dbConfig.options);
            console.log('Connected to MongoDB Atlas');
            return;
        } catch (err) {
            console.error(`MongoDB connection error (${retries} retries left):`, err);
            retries -= 1;
            if (retries === 0) {
                process.exit(1);
            }
            // Wait for 5 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

// API Routes with error boundary
app.use('/api', (req, res, next) => {
    Promise.resolve(messageRoutes(req, res, next)).catch(next);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    
    // Handle MongoDB specific errors
    if (err.name === 'MongoServerError') {
        return res.status(503).json({
            status: 'error',
            message: 'Database service unavailable. Please try again later.'
        });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid data format'
        });
    }
    
    // Handle other errors
    res.status(500).json({
        status: 'error',
        message: 'Internal server error. Please try again later.'
    });
});

// Handle SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server with connection retry
const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    // Attempt to reconnect
    connectDB();
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
});

startServer(); 