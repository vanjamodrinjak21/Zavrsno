const mongoose = require('mongoose');
const dbConfig = require('../config/database');

// Email Schema
const emailSchema = new mongoose.Schema({
    e_mail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return v && v.includes('@') && v.includes('.');
            },
            message: 'Invalid email format'
        }
    },
    e_mail_provider: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { 
    collection: 'EMAILS',
    versionKey: false
});

// Create a separate connection for EMAILS collection
const emailsDB = mongoose.createConnection(dbConfig.mongoURI, {
    dbName: 'ContactForm'
});

emailsDB.on('error', (err) => {
    console.error('EMAILS DB Connection error:', err);
});

emailsDB.once('open', () => {
    console.log('EMAILS DB Connected successfully');
});

const Email = emailsDB.model('EMAILS', emailSchema);

// Function to store email
async function storeEmail(email) {
    try {
        if (!email || !email.includes('@') || !email.includes('.')) {
            console.warn('Invalid email format, skipping storage:', email);
            return null;
        }
        
        const cleanEmail = email.toLowerCase().trim();
        const emailProvider = cleanEmail.split('@')[1].split('.')[0];
        
        console.log('Attempting to store email:', cleanEmail); // Debug log
        
        const result = await Email.findOneAndUpdate(
            { e_mail: cleanEmail },
            { 
                e_mail: cleanEmail,
                e_mail_provider: emailProvider,
                timestamp: new Date()
            },
            { 
                upsert: true, 
                new: true,
                runValidators: true
            }
        );
        console.log('Successfully stored email:', result); // Debug log
        return result;
    } catch (error) {
        console.error('Error storing email:', error);
        // Don't throw the error, just log it and continue
        return null;
    }
}

module.exports = { storeEmail, Email }; 