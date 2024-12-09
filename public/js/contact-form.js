document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    const responseMessage = document.querySelector('.response-message');
    
    if (!form || !responseMessage) return;

    // Get current language
    function getCurrentLanguage() {
        return document.documentElement.lang || 'en';
    }

    // Get translation for a key
    function getTranslation(key) {
        const lang = getCurrentLanguage();
        const keys = key.split('.');
        let translation = translations[lang];
        for (const k of keys) {
            translation = translation?.[k];
        }
        return translation || translations['en'][keys[0]][keys[1]]; // Fallback to English
    }

    // Show response message
    function showResponseMessage(type, titleKey, messageText) {
        responseMessage.classList.add('active', type);
        responseMessage.querySelector('h3').textContent = getTranslation(titleKey);
        responseMessage.querySelector('p').textContent = messageText;
        responseMessage.querySelector('.close-btn').textContent = getTranslation('contact.thankYou.sendAnother');
    }

    // Setup floating labels
    const setupFloatingLabels = () => {
        const formInputs = form.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            const updateLabel = () => {
                input.classList.toggle('has-value', input.value.trim() !== '');
            };
            input.addEventListener('input', updateLabel);
            updateLabel(); // Initialize state
        });
    };

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = getTranslation('contact.form.sending');
        submitBtn.disabled = true;
        
        try {
            const formData = {
                name: form.querySelector('#name').value.trim(),
                email: form.querySelector('#email').value.trim(),
                message: form.querySelector('#message').value.trim()
            };

            // Validate fields
            if (!formData.name || !formData.email || !formData.message) {
                throw new Error(getTranslation('contact.form.errors.fillAll'));
            }

            const response = await fetch('/api/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                // Show success message
                showResponseMessage('success', 'contact.thankYou.title', getTranslation('contact.thankYou.message'));
                
                // Reset form
                form.reset();
                form.querySelectorAll('.form-input').forEach(input => {
                    input.classList.remove('has-value');
                });
            } else {
                // Handle specific error types
                let errorMessage;
                if (data.message.includes('duplicate') || data.message.includes('already been sent')) {
                    errorMessage = getTranslation('contact.form.errors.duplicate');
                } else if (data.message.includes('Invalid') || data.message.includes('format')) {
                    errorMessage = getTranslation('contact.form.errors.invalid');
                } else if (data.message.includes('fill')) {
                    errorMessage = getTranslation('contact.form.errors.fillAll');
                } else {
                    errorMessage = getTranslation('contact.form.errors.failed');
                }
                showResponseMessage('error', 'contact.form.errors.title', errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            showResponseMessage('error', 'contact.form.errors.title', error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    // Close button handler
    const closeBtn = responseMessage.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            responseMessage.classList.remove('active', 'success', 'error');
        });
    }

    // Close on backdrop click
    responseMessage.addEventListener('click', (e) => {
        if (e.target === responseMessage) {
            responseMessage.classList.remove('active', 'success', 'error');
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && responseMessage.classList.contains('active')) {
            responseMessage.classList.remove('active', 'success', 'error');
        }
    });

    // Initialize floating labels
    setupFloatingLabels();
}); 