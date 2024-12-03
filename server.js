require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dbConfig = require('./config/database');
const messageRoutes = require('./src/routes/messages');

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration for production
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(dbConfig.mongoURI, dbConfig.options);
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Start server
const startServer = async () => {
    try {
        await connectDB();

        // API Routes
        app.use('/api', messageRoutes);

        // Handle SPA routing
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('Server error:', err);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error. Please try again later.'
            });
        });

        // Start server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

// Handle MongoDB connection errors
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
});

startServer(); 