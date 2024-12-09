/**
 * Processes and validates form data
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Processed form data
 * @throws {Error} If validation fails
 */
const processFormData = (form) => {
    const formData = {
        Ime: form.querySelector('#name').value.trim(),
        e_mail: form.querySelector('#email').value.trim().toLowerCase(),
        Poruka: form.querySelector('#message').value.trim()
    };

    // Validate required fields
    if (!formData.Ime || !formData.e_mail || !formData.Poruka) {
        throw new Error('Please fill in all fields');
    }

    // Extract and validate email provider
    const emailParts = formData.e_mail.split('@');
    if (emailParts.length !== 2 || !emailParts[1].includes('.')) {
        throw new Error('Please enter a valid email address');
    }

    formData.e_mail_provider = emailParts[1].split('.')[0];
    return formData;
};

/**
 * Handles form submission
 * @param {Object} options - Form handling options
 * @param {HTMLFormElement} options.form - The form element
 * @param {HTMLElement} options.responseMessage - Response message element
 * @param {HTMLButtonElement} options.submitButton - Submit button element
 * @returns {Promise<void>}
 */
const handleFormSubmission = async ({ form, responseMessage, submitButton }) => {
    try {
        const formData = processFormData(form);
        submitButton.disabled = true;

        const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send message');
        }

        // Show success message
        responseMessage.classList.add('active', 'success');
        responseMessage.querySelector('h3').textContent = 'Message Sent!';
        responseMessage.querySelector('p').textContent = 'Thank you for your message. We\'ll get back to you soon.';
        
        // Reset form
        form.reset();
        form.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('has-value');
        });

    } catch (error) {
        console.error('Form submission error:', error);
        responseMessage.classList.add('active', 'error');
        responseMessage.querySelector('h3').textContent = 'Error';
        responseMessage.querySelector('p').textContent = error.message;
    } finally {
        submitButton.disabled = false;
    }
};

/**
 * Handles response message interactions
 * @param {HTMLElement} responseMessage - Response message element
 */
const setupResponseMessageHandlers = (responseMessage) => {
    const closeBtn = responseMessage.querySelector('.close-btn');

    // Close button click
    closeBtn.addEventListener('click', () => {
        responseMessage.classList.remove('active', 'success', 'error');
    });

    // Backdrop click
    responseMessage.addEventListener('click', (e) => {
        if (e.target === responseMessage) {
            responseMessage.classList.remove('active', 'success', 'error');
        }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && responseMessage.classList.contains('active')) {
            responseMessage.classList.remove('active', 'success', 'error');
        }
    });
};

/**
 * Sets up floating label behavior for form inputs
 * @param {HTMLFormElement} form - The form element
 */
const setupFloatingLabels = (form) => {
    const formInputs = form.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        const updateFloatingLabel = () => {
            if (input.value.trim()) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        };

        input.addEventListener('input', updateFloatingLabel);
        // Initialize state
        updateFloatingLabel();
    });
};

export {
    processFormData,
    handleFormSubmission,
    setupResponseMessageHandlers,
    setupFloatingLabels
}; 