require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

module.exports = {
    mongoURI: MONGODB_URI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        tls: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
        retryWrites: true,
        maxPoolSize: 10,
        minPoolSize: 2,
        ssl: true,
        sslValidate: false,
        family: 4
    }
}; 