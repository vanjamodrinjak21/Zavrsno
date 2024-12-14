const express = require('express');
const router = express.Router();
const { addSubscriber } = require('../services/newsletterService');
const { storeSubscriber, unsubscribe } = require('../services/subscriberService');
const { sendWelcomeEmail } = require('../services/emailService');

router.post('/subscribe', async (req, res) => {
    try {
        const { email, language = 'hr' } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: language === 'hr' ? 
                    'Molimo unesite email adresu' : 
                    'Please enter an email address'
            });
        }

        // Store in database
        await storeSubscriber(email, language);

        // Add to Brevo
        await addSubscriber(email, language);

        // Send welcome email
        const userData = {
            email,
            name: email.split('@')[0],
            id: Buffer.from(email).toString('base64'),
            language
        };

        await sendWelcomeEmail(userData);

        res.status(200).json({ 
            success: true,
            message: language === 'hr' ? 
                'Hvala na prijavi! Uskoro ćete primiti potvrdni email.' : 
                'Thank you for subscribing! You will receive a confirmation email shortly.'
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        
        if (error.message === 'already_subscribed') {
            return res.status(400).json({
                success: false,
                error: language === 'hr' ? 
                    'Ova email adresa je već u našoj bazi pretplatnika' : 
                    'This email is already in our subscriber database'
            });
        }

        if (error.message === 'database_error') {
            return res.status(500).json({
                success: false,
                error: language === 'hr' ? 
                    'Došlo je do tehničke pogreške. Molimo pokušajte ponovno kasnije.' : 
                    'A technical error occurred. Please try again later.'
            });
        }

        res.status(500).json({ 
            success: false,
            error: language === 'hr' ? 
                'Nažalost, došlo je do pogreške. Molimo pokušajte ponovno za nekoliko trenutaka.' : 
                'Sorry, something went wrong. Please try again in a moment.',
            details: process.env.NODE_ENV === 'production' ? undefined : error.message
        });
    }
});

router.post('/unsubscribe', async (req, res) => {
    try {
        const { email, language = 'hr' } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: language === 'hr' ? 'Email je obavezan' : 'Email is required'
            });
        }

        await unsubscribe(email);

        res.status(200).json({ 
            success: true,
            message: language === 'hr' ? 
                'Uspješno ste se odjavili s newslettera' : 
                'Successfully unsubscribed from newsletter'
        });

    } catch (error) {
        console.error('Newsletter unsubscribe error:', error);
        
        if (error.message === 'subscriber_not_found') {
            return res.status(404).json({
                success: false,
                error: language === 'hr' ? 
                    'Email adresa nije pronađena' : 
                    'Email address not found'
            });
        }

        res.status(500).json({ 
            success: false,
            error: language === 'hr' ? 
                'Greška pri odjavi s newslettera' : 
                'Error unsubscribing from newsletter'
        });
    }
});

module.exports = router; 