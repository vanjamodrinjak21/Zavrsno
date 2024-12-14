/**
 * Email validation constants
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const MAX_EMAIL_LENGTH = 254; // RFC 5321
const MIN_LOCAL_PART_LENGTH = 1;
const MAX_LOCAL_PART_LENGTH = 64; // RFC 5321
const MIN_DOMAIN_LENGTH = 4; // a.bc
const MAX_DOMAIN_LENGTH = 255; // RFC 5321

/**
 * Comprehensive email validation
 * @param {string} email - The email to validate
 * @returns {Object} - Validation result with status and error message if any
 */
function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return {
            isValid: false,
            error: 'Email is required and must be a string'
        };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check length constraints
    if (cleanEmail.length > MAX_EMAIL_LENGTH) {
        return {
            isValid: false,
            error: `Email must not exceed ${MAX_EMAIL_LENGTH} characters`
        };
    }

    // Basic format check
    if (!EMAIL_REGEX.test(cleanEmail)) {
        return {
            isValid: false,
            error: 'Invalid email format'
        };
    }

    // Detailed part validation
    const [localPart, domain] = cleanEmail.split('@');

    // Local part validation
    if (localPart.length < MIN_LOCAL_PART_LENGTH || localPart.length > MAX_LOCAL_PART_LENGTH) {
        return {
            isValid: false,
            error: `Local part must be between ${MIN_LOCAL_PART_LENGTH} and ${MAX_LOCAL_PART_LENGTH} characters`
        };
    }

    // Domain validation
    if (domain.length < MIN_DOMAIN_LENGTH || domain.length > MAX_DOMAIN_LENGTH) {
        return {
            isValid: false,
            error: `Domain must be between ${MIN_DOMAIN_LENGTH} and ${MAX_DOMAIN_LENGTH} characters`
        };
    }

    // Check for consecutive dots
    if (cleanEmail.includes('..')) {
        return {
            isValid: false,
            error: 'Email cannot contain consecutive dots'
        };
    }

    return {
        isValid: true,
        cleanEmail
    };
}

/**
 * Extract and validate email provider
 * @param {string} email - The email to extract provider from
 * @returns {Object} - Provider information with validation status
 */
function getEmailProvider(email) {
    const validation = validateEmail(email);
    if (!validation.isValid) {
        return {
            isValid: false,
            error: validation.error
        };
    }

    try {
        const domain = validation.cleanEmail.split('@')[1];
        const [provider] = domain.split('.');
        
        if (!provider || provider.length < 1) {
            return {
                isValid: false,
                error: 'Invalid email provider'
            };
        }

        return {
            isValid: true,
            provider,
            domain
        };
    } catch (error) {
        return {
            isValid: false,
            error: 'Error extracting email provider'
        };
    }
}

/**
 * Normalize email address
 * @param {string} email - The email to normalize
 * @returns {string} - Normalized email address
 */
function normalizeEmail(email) {
    const validation = validateEmail(email);
    return validation.isValid ? validation.cleanEmail : '';
}

module.exports = { 
    validateEmail, 
    getEmailProvider,
    normalizeEmail,
    EMAIL_REGEX 
}; 