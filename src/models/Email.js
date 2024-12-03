const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    provider: {
        type: String,
        required: true,
        trim: true
    },
    firstContact: {
        type: Date,
        default: Date.now
    },
    lastContact: {
        type: Date,
        default: Date.now
    },
    messageCount: {
        type: Number,
        default: 1
    }
}, { 
    collection: 'EMAILS',
    versionKey: false
});

module.exports = mongoose.model('Email', emailSchema, 'EMAILS'); 