const mongoose = require('mongoose');
const dbConfig = require('../../config/database');

// Connect to MongoDB
const emailsDB = mongoose.createConnection(dbConfig.mongoURI, dbConfig.options);

// Email Schema
const emailSchema = new mongoose.Schema({
    e_mail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
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

const Email = emailsDB.model('EMAILS', emailSchema);

// Function to store email
async function storeEmail(email) {
    try {
        const cleanEmail = email.toLowerCase().trim();
        const emailProvider = cleanEmail.split('@')[1].split('.')[0];
        
        await Email.findOneAndUpdate(
            { e_mail: cleanEmail },
            { 
                e_mail: cleanEmail,
                e_mail_provider: emailProvider,
                timestamp: new Date()
            },
            { upsert: true }
        );
    } catch (error) {
        console.error('Error storing email:', error);
    }
}

module.exports = { storeEmail, Email }; 