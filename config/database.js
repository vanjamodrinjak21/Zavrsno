require('dotenv').config();

const mongoURI = 'mongodb+srv://momentforthephotographer:102UALNrK@contactform.wuj5g.mongodb.net/?retryWrites=true&w=majority&appName=ContactForm';

if (typeof mongoURI !== 'string') {
    throw new Error('MongoDB URI must be a string');
}

module.exports = {
    url: mongoURI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'ContactForm'
    }
};