const express = require('express');
const router = express.Router();
const Email = require('../../models/Email');
const Ime = require('../../models/Ime');
const { sendWelcomeEmail, subscribeToNewsletter } = require('../../utils/emailService');
const Contact = require('../../models/Contact');

router.post('/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Store email
    try {
      const newEmail = await Email.findOneAndUpdate(
        { email: email },
        { email: email },
        { upsert: true, new: true, runValidators: true }
      );
      console.log('Successfully stored email:', newEmail);
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate email - this is actually okay for our use case
        console.log('Email already exists:', email);
      } else {
        throw error;
      }
    }

    // Store name
    if (name) {
      try {
        const newName = await Ime.create({ Ime: name });
        console.log('Successfully stored name:', newName);
      } catch (nameError) {
        console.error('Error storing name:', nameError);
        // Continue execution even if name storage fails
      }
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue execution even if email sending fails
    }

    // Subscribe to newsletter
    try {
      await subscribeToNewsletter(email);
    } catch (newsletterError) {
      console.error('Newsletter subscription error:', newsletterError);
      // Continue execution even if newsletter subscription fails
    }

    res.status(200).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { email, message } = req.body;
    
    // Add validation for message length
    if (!message || message.length > 500) { // Assuming 500 char limit
      return res.status(400).json({ 
        error: 'Message must be between 1 and 500 characters' 
      });
    }

    // Check for duplicate email
    const existingContact = await Contact.findOne({ email });
    if (existingContact) {
      return res.status(400).json({ 
        error: 'This email has already been submitted' 
      });
    }

    // Rest of the contact handling logic...
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 