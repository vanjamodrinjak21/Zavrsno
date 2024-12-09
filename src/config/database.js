const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ContactForm';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoURI, {
            dbName: 'ContactForm'
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
    mongoURI
}; 