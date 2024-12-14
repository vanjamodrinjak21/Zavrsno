document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const messageInput = document.getElementById('message');
    const maxLength = 500;
    const minLength = 10;
    const responseMessage = document.querySelector('.response-message');
    const closeBtn = document.querySelector('.close-btn');

    // Form submission handling
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const message = formData.get('message');

            // Validate message length
            if (message.length < minLength) {
                alert(`Message must be at least ${minLength} characters`);
                return;
            }
            if (message.length > maxLength) {
                alert(`Message must be less than ${maxLength} characters`);
                return;
            }

            try {
                const response = await fetch('/api/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(formData)),
                });

                if (response.ok) {
                    // Show success message
                    responseMessage.classList.add('active', 'success');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to send message');
                }
            } catch (error) {
                // Show error message
                responseMessage.classList.add('active', 'error');
                console.error('Form submission error:', error);
            }
        });
    }

    // Close response message
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            responseMessage.classList.remove('active', 'success', 'error');
        });
    }
}); 