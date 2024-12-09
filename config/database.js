require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ContactForm';

if (typeof mongoURI !== 'string') {
    throw new Error('MongoDB URI must be a string');
}

module.exports = {
    mongoURI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'ContactForm'
    }
};