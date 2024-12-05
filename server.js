const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Define MongoDB Schemas
const formaSchema = new mongoose.Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    __v: { type: Number, default: 0 }
}, {
    collection: 'FORMA'
});

const emailSchema = new mongoose.Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    email: { type: String, required: true, unique: true },
    formCount: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    __v: { type: Number, default: 0 }
}, {
    collection: 'EMAILS'
});

const imenaSchema = new mongoose.Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    __v: { type: Number, default: 0 }
}, {
    collection: 'IMENA'
});

// Create models
const Forma = mongoose.model('Forma', formaSchema);
const Email = mongoose.model('Email', emailSchema);
const Imena = mongoose.model('Imena', imenaSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection with retry logic
const connectWithRetry = () => {
    mongoose
        .connect('mongodb+srv://momentforthephotographer:102UALNrK@contactform.wuj5g.mongodb.net/?retryWrites=true&w=majority&appName=ContactForm', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'ContactForm',
            serverSelectionTimeoutMS: 5000,
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

connectWithRetry();

// Contact form endpoint
app.post('/api/send-message', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Create forma document first
        const forma = new Forma({
            name,
            email,
            message
        });

        // Save forma document
        await forma.save();

        // Try to save or update email document
        let emailDoc = await Email.findOne({ email });
        
        if (emailDoc) {
            // If email exists, increment the form count
            emailDoc = await Email.findOneAndUpdate(
                { email },
                { $inc: { formCount: 1 } },
                { new: true }
            );
        } else {
            // If email doesn't exist, create new document with formCount = 1
            emailDoc = new Email({ 
                email,
                formCount: 1
            });
            await emailDoc.save();
        }

        // Always save name
        const imenaDoc = new Imena({
            name
        });
        await imenaDoc.save();

        console.log('Saved to collections:', {
            forma,
            email: emailDoc,
            imena: imenaDoc
        });

        res.json({
            status: 'success',
            message: 'Poruka je uspješno poslana!',
            data: {
                forma: {
                    _id: forma._id,
                    name: forma.name,
                    email: forma.email,
                    message: forma.message,
                    createdAt: forma.createdAt,
                    __v: forma.__v
                },
                email: {
                    _id: emailDoc._id,
                    email: emailDoc.email,
                    formCount: emailDoc.formCount,
                    createdAt: emailDoc.createdAt,
                    __v: emailDoc.__v
                },
                imena: {
                    _id: imenaDoc._id,
                    name: imenaDoc.name,
                    createdAt: imenaDoc.createdAt,
                    __v: imenaDoc.__v
                }
            }
        });
    } catch (error) {
        console.error('Error saving to collections:', error);
        res.status(500).json({
            status: 'error',
            message: 'Došlo je do greške prilikom spremanja poruke.',
            error: error.message
        });
    }
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;