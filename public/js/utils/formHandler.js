/**
 * Sets up floating label behavior for form inputs
 * @param {HTMLFormElement} form - The form element
 */
export const setupFloatingLabels = (form) => {
    if (!form) return;
    
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

/**
 * Sets up response message handlers
 * @param {HTMLElement} responseMessage - Response message element
 */
export const setupResponseMessageHandlers = (responseMessage) => {
    if (!responseMessage) return;

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
}; 