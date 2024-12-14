require('dotenv').config();

const path = require('path');
const express = require('express');
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
const compression = require('compression');
const { promisify } = require('util');
const newsletterRoutes = require('./src/routes/newsletter');
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Verify environment variables were loaded
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'BREVO_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Configure Brevo
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
console.log('Brevo API key configured:', process.env.BREVO_API_KEY ? 'Yes' : 'No');

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
app.use(compression());

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const messageRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { status: 'error', message: 'Too many messages sent. Please try again later.' }
});

const apiRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: { 
        status: 'error', 
        message: 'Too many attempts. Please try again in 10 minutes.' 
    }
});

app.use('/api/send-message', messageRateLimit);
app.use('/api', apiRateLimit);

// Debug logging for API routes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

// Routes - move these before the catch-all route
app.use('/api/newsletter', newsletterRoutes);

// Static files with caching
const cacheTime = process.env.NODE_ENV === 'production' ? 86400000 : 0;
app.use(express.static('public', {
    maxAge: cacheTime,
    etag: true,
    lastModified: true
}));

// Contact form endpoint
app.post('/api/send-message', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return res.status(400).json({
                status: 'error',
                message: 'Please fill in all fields'
            });
        }

        const [cleanEmail, cleanName, cleanMessage] = await Promise.all([
            validateAndCleanEmail(email),
            validateAndCleanName(name),
            validateAndCleanMessage(message)
        ]);

        const newMessage = new Message({
            Ime: cleanName,
            e_mail: cleanEmail.address,
            e_mail_provider: cleanEmail.provider,
            Poruka: cleanMessage,
            timestamp: new Date()
        });

        const [savedMessage] = await Promise.all([
            newMessage.save(),
            storeEmail(cleanEmail.address),
            storeName(cleanName)
        ]).catch(error => {
            if (error.message.includes('storage')) {
                console.error('Storage error (non-critical):', error);
                return [newMessage];
            }
            throw error;
        });

        res.status(200).json({
            status: 'success',
            message: 'Message sent successfully',
            data: savedMessage
        });
    } catch (error) {
        handleApiError(error, res);
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
app.get('/projects/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const projectPath = path.join(__dirname, 'public', 'projects', projectId);
        const fullPath = projectId.includes('.') ? projectPath : `${projectPath}.html`;
        
        if (await existsAsync(fullPath)) {
            res.sendFile(fullPath, {
                maxAge: cacheTime,
                lastModified: true,
                etag: true
            });
        } else {
            res.redirect('/#projects');
        }
    } catch (error) {
        handleApiError(error, res);
    }
});

// Serve index for all other routes - this should be last
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
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

// Utility functions
function validateAndCleanEmail(email) {
    const cleanEmail = email.trim().toLowerCase();
    const emailParts = cleanEmail.split('@');
    
    if (emailParts.length !== 2 || !emailParts[1].includes('.')) {
        throw new ValidationError('Invalid email format');
    }

    return {
        address: cleanEmail,
        provider: emailParts[1].split('.')[0]
    };
}

function validateAndCleanName(name) {
    const cleanName = name.trim();
    if (cleanName.length < 2) {
        throw new ValidationError('Name must be at least 2 characters long');
    }
    return cleanName;
}

function validateAndCleanMessage(message) {
    const cleanMessage = message.trim();
    if (cleanMessage.length < 10) {
        throw new ValidationError('Message must be at least 10 characters long');
    }
    return cleanMessage;
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

function handleApiError(error, res) {
    console.error('API Error:', error);

    if (error.code === 11000) {
        return res.status(400).json({
            status: 'error',
            message: 'This message has already been sent. Please try again with a different message.'
        });
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Invalid data format'
        });
    }

    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' 
            ? 'Error processing request. Please try again later.'
            : error.message
    });
}

// Add this right after dotenv config
const requiredVars = [
  'MONGODB_URI',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'BREVO_API_KEY'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  console.error('Make sure these are set in Railway dashboard for production');
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

