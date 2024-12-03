const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { storeEmail } = require('../utils/email-storage');
const { storeName } = require('../utils/name-storage');

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
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred while processing your message'
        });
    }
});

module.exports = router; 