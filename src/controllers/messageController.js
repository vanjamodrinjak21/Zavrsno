const Message = require('../models/Message');
const { storeEmail } = require('../utils/email-storage');
const { storeName } = require('../utils/name-storage');

exports.sendMessage = async (req, res) => {
    try {
        console.log('Received form data:', req.body); // Debug log
        
        // Extract data from request body
        const { name: Ime, email: e_mail, message: Poruka } = req.body;

        // Validate inputs
        if (!Ime || !e_mail || !Poruka) {
            return res.status(400).json({
                message: 'Please fill in all fields'
            });
        }

        // Clean and prepare data
        const cleanEmail = e_mail.trim().toLowerCase();
        const cleanName = Ime.trim();
        const cleanMessage = Poruka.trim();

        // Extract email provider
        const emailParts = cleanEmail.split('@');
        if (emailParts.length !== 2) {
            return res.status(400).json({
                message: 'Invalid email format'
            });
        }
        const e_mail_provider = emailParts[1].split('.')[0];

        // Create new message with exact schema field names
        const newMessage = new Message({
            Ime: cleanName,
            e_mail: cleanEmail,
            e_mail_provider,
            Poruka: cleanMessage
        });

        console.log('Saving message:', newMessage); // Debug log

        // Save message and store email/name in parallel
        await Promise.all([
            newMessage.save(),
            storeEmail(cleanEmail),
            storeName(cleanName)
        ]);

        res.status(200).json({
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Error sending message:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Please try again in a few moments.'
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        res.status(500).json({
            message: 'Error sending message. Please try again later.'
        });
    }
}; 