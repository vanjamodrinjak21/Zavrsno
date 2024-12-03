const mongoose = require('mongoose');
const dbConfig = require('../../config/database');

// Connect to MongoDB
const namesDB = mongoose.createConnection(dbConfig.mongoURI, dbConfig.options);

// Name Schema
const nameSchema = new mongoose.Schema({
    Ime: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { 
    collection: 'IMENA',
    versionKey: false
});

const Name = namesDB.model('IMENA', nameSchema);

// Function to store name
async function storeName(name) {
    try {
        const cleanName = name.trim();
        
        await Name.findOneAndUpdate(
            { Ime: cleanName },
            { 
                Ime: cleanName,
                timestamp: new Date()
            },
            { upsert: true }
        );
    } catch (error) {
        console.error('Error storing name:', error);
    }
}

module.exports = { storeName, Name };