const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Email = require('../models/Email');
const { isValidEmailDomain } = require('../utils/email-validator');
const { storeEmail } = require('../utils/email-storage');
const { storeName } = require('../utils/name-storage');

// Message submission route with duplicate check
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

        // Clean and validate inputs
        const cleanEmail = email.toLowerCase().trim();
        const cleanName = name.trim();
        const cleanMessage = message.trim();

        // Validate email domain
        if (!isValidEmailDomain(cleanEmail)) {
            return res.status(400).json({
                status: 'error',
                message: 'Neispravna email adresa! Molimo koristite hrvatsku email adresu (.hr domenu) ili Gmail.'
            });
        }

        // Create new message
        const newMessage = new Message({
            e_mail: cleanEmail,
            e_mail_provider: cleanEmail.split('@')[1].split('.')[0],
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

// Get all emails route
router.get('/emails', async (req, res) => {
    try {
        const emails = await Email.find()
            .sort({ lastContact: -1 });

        res.json({
            status: 'success',
            data: emails
        });

    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Search emails route
router.get('/emails/search/:query', async (req, res) => {
    try {
        const query = req.params.query.toLowerCase();
        
        const emails = await Email.find({
            $or: [
                { email: { $regex: query, $options: 'i' } },
                { provider: { $regex: query, $options: 'i' } }
            ]
        }).sort({ lastContact: -1 });

        res.json({
            status: 'success',
            data: emails
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router; 