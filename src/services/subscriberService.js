const Subscriber = require('../models/Subscriber');

async function storeSubscriber(email, language = 'hr') {
    try {
        // Check if subscriber already exists
        const existingSubscriber = await Subscriber.findOne({ email });
        
        if (existingSubscriber) {
            if (existingSubscriber.status === 'unsubscribed') {
                // Resubscribe if previously unsubscribed
                existingSubscriber.status = 'subscribed';
                existingSubscriber.language = language;
                await existingSubscriber.save();
                return existingSubscriber;
            }
            throw new Error('already_subscribed');
        }

        // Create new subscriber
        const subscriber = new Subscriber({
            email,
            language,
            status: 'subscribed'
        });

        await subscriber.save();
        return subscriber;
    } catch (error) {
        if (error.message === 'already_subscribed') {
            throw error;
        }
        console.error('Error storing subscriber:', error);
        throw new Error('database_error');
    }
}

async function unsubscribe(email) {
    try {
        const subscriber = await Subscriber.findOne({ email });
        if (!subscriber) {
            throw new Error('subscriber_not_found');
        }

        subscriber.status = 'unsubscribed';
        await subscriber.save();
        return subscriber;
    } catch (error) {
        console.error('Error unsubscribing:', error);
        throw error;
    }
}

module.exports = {
    storeSubscriber,
    unsubscribe
}; 