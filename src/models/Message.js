const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    Ime: {
        type: String,
        required: true,
        trim: true
    },
    e_mail: {
        type: String,
        required: true,
        trim: true
    },
    e_mail_provider: {
        type: String,
        required: true
    },
    Poruka: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema); 