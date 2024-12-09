const mongoose = require('mongoose');
const dbConfig = require('../config/database');

// Name Schema
const nameSchema = new mongoose.Schema({
    Ime: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v && v.length >= 2;
            },
            message: 'Name must be at least 2 characters long'
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { 
    collection: 'IMENA',
    versionKey: false
});

// Create a separate connection for IMENA collection
const namesDB = mongoose.createConnection(dbConfig.mongoURI, {
    dbName: 'ContactForm'
});

namesDB.on('error', (err) => {
    console.error('IMENA DB Connection error:', err);
});

namesDB.once('open', () => {
    console.log('IMENA DB Connected successfully');
});

const Name = namesDB.model('IMENA', nameSchema);

// Function to store name
async function storeName(name) {
    try {
        if (!name || name.trim().length < 2) {
            console.warn('Invalid name format, skipping storage:', name);
            return null;
        }
        
        const cleanName = name.trim();
        console.log('Attempting to store name:', cleanName); // Debug log
        
        const result = await Name.findOneAndUpdate(
            { Ime: cleanName },
            { 
                Ime: cleanName,
                timestamp: new Date()
            },
            { 
                upsert: true, 
                new: true,
                runValidators: true
            }
        );
        console.log('Successfully stored name:', result); // Debug log
        return result;
    } catch (error) {
        console.error('Error storing name:', error);
        // Don't throw the error, just log it and continue
        return null;
    }
}

module.exports = { storeName, Name };