const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with retry logic
const connectWithRetry = () => {
    require('mongoose')
        .connect('mongodb+srv://momentforthephotographer:102UALNrK@contactform.wuj5g.mongodb.net/?retryWrites=true&w=majority&appName=ContactForm', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'ContactForm',
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            retryWrites: true
        })
        .then(() => {
            console.log('MongoDB connected successfully');
        })
        .catch(err => {
            console.error('MongoDB connection error:', err.message);
            console.log('Retrying in 5 seconds...');
            setTimeout(connectWithRetry, 5000);
        });
};

// Initial connection attempt
connectWithRetry();

// Basic route for health check
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;