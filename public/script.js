document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const contactForm = document.getElementById('contact-form');
    const inputs = document.querySelectorAll('.form-input');
    const messageTextarea = document.querySelector('textarea[name="message"]');
    const charCounter = document.querySelector('.char-counter');
    const thankYouMessage = document.getElementById('thank-you-message');
    const anotherMessageBtn = document.querySelector('.another-message-btn');

    // Form input handlers
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
    
    // Character counter
    if (messageTextarea && charCounter) {
        messageTextarea.addEventListener('input', function() {
            const count = this.value.length;
            const maxLength = 500;
            charCounter.textContent = `${count}/${maxLength}`;
            
            if (count > maxLength) {
                this.value = this.value.substring(0, maxLength);
                charCounter.textContent = `${maxLength}/${maxLength}`;
            }
        });
    }
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            
            try {
                // Get current timestamp
                const now = new Date().toISOString();
                
                const formData = {
                    name: contactForm.querySelector('[name="name"]').value.trim(),
                    email: contactForm.querySelector('[name="email"]').value.trim(),
                    message: contactForm.querySelector('[name="message"]').value.trim(),
                    createdAt: now
                };

                console.log('Sending data:', formData);

                const response = await fetch('/api/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Server response:', result);

                if (result.status === 'success') {
                    // Display success message with the saved data
                    const savedData = result.data;
                    console.log('Saved contact:', savedData);
                    
                    thankYouMessage.classList.add('active');
                    contactForm.reset();
                    if (charCounter) charCounter.textContent = '0/500';
                    inputs.forEach(input => {
                        input.classList.remove('has-value');
                        input.parentElement.classList.remove('focused');
                    });
                } else {
                    throw new Error(result.message || 'Failed to send message');
                }

            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'Error sending message. Please try again.');
            } finally {
                submitButton.disabled = false;
            }
        });
    }
    
    // Send Another Message button
    if (anotherMessageBtn) {
        anotherMessageBtn.addEventListener('click', function() {
            thankYouMessage.classList.remove('active');
        });
    }
});