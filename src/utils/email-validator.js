/**
 * Simple email validation function
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    if (!email) return false;
    
    try {
        const parts = email.split('@');
        if (parts.length !== 2) return false;
        
        const [localPart, domain] = parts;
        if (!localPart || !domain) return false;
        
        return true;
    } catch (error) {
        console.error('Email validation error:', error);
        return false;
    }
}

/**
 * Extract email provider from email
 * @param {string} email - The email to extract provider from
 * @returns {string} - The email provider
 */
function getEmailProvider(email) {
    try {
        return email.split('@')[1].split('.')[0];
    } catch (error) {
        console.error('Error extracting email provider:', error);
        return '';
    }
}

module.exports = { validateEmail, getEmailProvider }; 