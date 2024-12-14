const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure Brevo API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.ContactsApi();

const errorMessages = {
    hr: {
        alreadySubscribed: 'Ova email adresa je već pretplaćena na newsletter'
    },
    en: {
        alreadySubscribed: 'This email is already subscribed to our newsletter'
    }
};

async function addSubscriber(email, language = 'hr') {
    try {
        const createContact = new SibApiV3Sdk.CreateContact();
        createContact.email = email;
        createContact.attributes = {
            LANGUAGE: language
        };
        createContact.listIds = [3]; // Brevo contact list ID

        const response = await apiInstance.createContact(createContact);
        console.log(`Successfully added subscriber: ${email}`);
        return response;
    } catch (error) {
        console.log('Brevo API Error:', error.response?.text || error.message);
        // Handle duplicate subscriber error
        if (error.response?.text?.includes('Contact already exist')) {
            throw new Error(errorMessages[language].alreadySubscribed);
        }
        console.error('Error adding subscriber to Brevo:', error);
        throw error;
    }
}

module.exports = {
    addSubscriber
}; 