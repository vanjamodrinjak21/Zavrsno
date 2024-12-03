require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

module.exports = {
    mongoURI: MONGODB_URI,
    options: {
        serverApi: {
            version: '1',
            strict: true,
            deprecationErrors: true
        }
    }
}; 