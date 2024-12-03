const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { storeEmail } = require('../utils/email-storage');
const { storeName } = require('../utils/name-storage');
const { validateEmail } = require('../utils/email-validator');
const { validateName } = require('../utils/name-validator');

// Message submission route
router.post('/send-message', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Input validation
        if (!name || !email || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
        }

        // Clean inputs
        const cleanEmail = email.toLowerCase().trim();
        const cleanName = name.trim();
        const cleanMessage = message.trim();

        // Validate inputs
        if (!validateEmail(cleanEmail)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email format'
            });
        }

        if (!validateName(cleanName)) {
            return res.status(400).json({
                status: 'error',
                message: 'Name must be at least 2 characters long'
            });
        }

        if (cleanMessage.length > 500) {
            return res.status(400).json({
                status: 'error',
                message: 'Message is too long (max 500 characters)'
            });
        }

        const emailProvider = cleanEmail.split('@')[1].split('.')[0];

        // Create new message
        const newMessage = new Message({
            e_mail: cleanEmail,
            e_mail_provider: emailProvider,
            Ime: cleanName,
            Poruka: cleanMessage
        });

        // Save message
        const savedMessage = await newMessage.save();

        // Store email and name
        await Promise.all([
            storeEmail(cleanEmail),
            storeName(cleanName)
        ]);

        // Send success response
        return res.status(200).json({
            status: 'success',
            message: 'Message sent successfully',
            data: savedMessage
        });

    } catch (error) {
        console.error('Server error:', error);
        
        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid data format'
            });
        }
        
        if (error.name === 'MongoServerError') {
            return res.status(500).json({
                status: 'error',
                message: 'Database error, please try again'
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'An error occurred while processing your message'
        });
    }
});

module.exports = router; 