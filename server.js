require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { connectDB } = require('./src/config/database');
const Message = require('./src/models/Message');
const { validateEmail, getEmailProvider } = require('./src/utils/email-validator');
const { storeEmail } = require('./src/utils/email-storage');
const { storeName } = require('./src/utils/name-storage');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:", "cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https:", "cdnjs.cloudflare.com", "https://*.microsoft.com"],
            imgSrc: ["'self'", "data:", "https:", "*.pexels.com"],
            connectSrc: ["'self'", "http://localhost:*", "https:", "https://*.microsoft.com"],
            fontSrc: ["'self'", "https:", "cdnjs.cloudflare.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "https:", "blob:"],
            frameSrc: ["'none'"],
            workerSrc: ["'self'", "blob:"],
            scriptSrcElem: ["'self'", "'unsafe-inline'", "https:", "cdnjs.cloudflare.com"]
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
}));

// MIME type handling
app.use((req, res, next) => {
    if (req.path.endsWith('.js')) {
        res.type('application/javascript');
    }
    next();
});

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

// Static files
app.use(express.static('public'));

// Contact form endpoint
app.post('/api/send-message', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        console.log('Received form data:', req.body); // Debug log

        // Validate inputs
        if (!name || !email || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'Please fill in all fields'
            });
        }

        // Clean the inputs
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = name.trim();
        const cleanMessage = message.trim();

        // Extract email provider
        const emailParts = cleanEmail.split('@');
        if (emailParts.length !== 2) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email format'
            });
        }
        const emailProvider = emailParts[1].split('.')[0];

        // Create new message with the correct schema field names
        const newMessage = new Message({
            Ime: cleanName,
            e_mail: cleanEmail,
            e_mail_provider: emailProvider,
            Poruka: cleanMessage,
            timestamp: new Date()
        });

        console.log('Saving message:', newMessage); // Debug log

        // Save message first
        const savedMessage = await newMessage.save();

        // Then store email and name
        try {
            await Promise.all([
                storeEmail(cleanEmail),
                storeName(cleanName)
            ]);
        } catch (storageError) {
            console.error('Storage error (non-critical):', storageError);
            // Continue even if storage fails
        }

        // Send success response
        res.status(200).json({
            status: 'success',
            message: 'Message sent successfully',
            data: savedMessage
        });
    } catch (error) {
        console.error('Error sending message:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'This message has already been sent. Please try again with a different message.'
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid data format'
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Error sending message. Please try again later.'
        });
    }
});

// Admin endpoint to view messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 });
        res.json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching messages' 
        });
    }
});

// Handle project routes
app.get('/projects/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    const projectPath = path.join(__dirname, 'public', 'projects', projectId);
    
    // If no extension is provided, assume .html
    const fullPath = projectId.includes('.') ? projectPath : `${projectPath}.html`;
    
    if (require('fs').existsSync(fullPath)) {
        res.sendFile(fullPath);
    } else {
        // If project file doesn't exist, redirect to home
        res.redirect('/#projects');
    }
});

// Handle root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
