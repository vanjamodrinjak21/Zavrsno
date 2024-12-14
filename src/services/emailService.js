const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

// Create email transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendWelcomeEmail(userData) {
    try {
        // Select template based on language
        const templateName = userData.language === 'hr' ? 'newsletter-welcome-hr.html' : 'newsletter-welcome-en.html';
        const templatePath = path.join(__dirname, '../templates', templateName);
        const template = await fs.readFile(templatePath, 'utf-8');

        // Compile template with Handlebars
        const compiledTemplate = handlebars.compile(template);
        const html = compiledTemplate({
            userName: userData.name,
            unsubscribeLink: `https://kratkimetar.com/unsubscribe/${userData.id}`,
            preferencesLink: `https://kratkimetar.com/email-preferences/${userData.id}`
        });

        // Email options using Brevo SMTP
        const mailOptions = {
            from: {
                name: 'Kratki Metar',
                address: process.env.SMTP_USER
            },
            to: userData.email,
            subject: userData.language === 'hr' ? 'Dobrodošli u Kratki Metar!' : 'Welcome to Kratki Metar!',
            html: html
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent:', info.messageId);
        return info;

    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
}

module.exports = {
    sendWelcomeEmail,
    transporter
};