const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    e_mail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    e_mail_provider: {
        type: String,
        required: true,
        trim: true
    },
    Ime: {
        type: String,
        required: true,
        trim: true
    },
    Poruka: {
        type: String,
        required: true,
        trim: true,
        maxLength: 500
    },
    timestamp: {
        type: Date,
        default: () => new Date()
    }
}, { 
    collection: 'FORMA',
    versionKey: false,
    timestamps: false
});

// Create a compound index for duplicate message detection
messageSchema.index({ 
    e_mail: 1, 
    Poruka: 1, 
    timestamp: 1 
}, { 
    unique: true,
    // Allow messages with the same content after 1 minute
    expireAfterSeconds: 60
});

// Pre-save middleware
messageSchema.pre('save', function(next) {
    if (this.e_mail) {
        this.e_mail = this.e_mail.toLowerCase().trim();
        this.e_mail_provider = this.e_mail.split('@')[1].split('.')[0];
    }
    
    if (this.Ime) this.Ime = this.Ime.trim();
    if (this.Poruka) this.Poruka = this.Poruka.trim();
    
    next();
});

module.exports = mongoose.model('FORMA', messageSchema); 