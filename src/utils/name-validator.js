/**
 * Simple name validation function
 * @param {string} name - The name to validate
 * @returns {boolean} - Whether the name is valid
 */
function validateName(name) {
    if (!name) return false;
    
    const cleanName = name.trim();
    if (cleanName.length < 2) return false;
    
    return true;
}

module.exports = { validateName }; 