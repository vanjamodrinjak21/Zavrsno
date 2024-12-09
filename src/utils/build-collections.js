const mongoose = require('mongoose');
const dbConfig = require('../config/database');
const { Email } = require('./email-storage');
const { Name } = require('./name-storage');

// Connect to MongoDB
mongoose.connect(dbConfig.mongoURI, dbConfig.options);

// Original Message Schema (just for reading existing messages)
const messageSchema = new mongoose.Schema({
    e_mail: String,
    Ime: String
}, { 
    collection: 'FORMA'
});

const Message = mongoose.model('FORMA', messageSchema);

async function buildCollections() {
    try {
        // Clear existing collections
        await Promise.all([
            Email.deleteMany({}),
            Name.deleteMany({})
        ]);

        // Get all messages
        const messages = await Message.find({}, { e_mail: 1, Ime: 1 });
        console.log(`Found ${messages.length} messages`);

        // Process each message
        for (const message of messages) {
            const promises = [];

            if (message.e_mail) {
                const cleanEmail = message.e_mail.toLowerCase().trim();
                const emailProvider = cleanEmail.split('@')[1].split('.')[0];
                promises.push(
                    Email.findOneAndUpdate(
                        { e_mail: cleanEmail },
                        { 
                            e_mail: cleanEmail,
                            e_mail_provider: emailProvider,
                            timestamp: new Date()
                        },
                        { upsert: true }
                    )
                );
            }

            if (message.Ime) {
                const cleanName = message.Ime.trim();
                promises.push(
                    Name.findOneAndUpdate(
                        { Ime: cleanName },
                        { 
                            Ime: cleanName,
                            timestamp: new Date()
                        },
                        { upsert: true }
                    )
                );
            }

            await Promise.all(promises);
        }

        console.log('Collections built successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error building collections:', error);
        process.exit(1);
    }
}

// Run the build
buildCollections(); 