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
app.use(cors({
    origin: ['https://kratkimetar.com', 'http://kratkimetar.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// MongoDB connection with retry logic
const connectDB = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(dbConfig.mongoURI, options);
        console.log('Connected to MongoDB Atlas');

        // Handle MongoDB connection errors after initial connection
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
            setTimeout(connectDB, 5000);
        });

    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

// Connect to MongoDB before starting the server
connectDB().then(() => {
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
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
}); 