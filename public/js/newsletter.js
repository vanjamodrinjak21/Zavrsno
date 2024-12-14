document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'newsletter-message';
    newsletterForm.appendChild(messageDiv);

    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const currentLang = document.documentElement.lang || 'en';

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email,
                    language: currentLang 
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Success
                showMessage(
                    currentLang === 'hr' 
                        ? 'Hvala vam na pretplati na naš newsletter!' 
                        : 'Thank you for subscribing to our newsletter!',
                    'success'
                );
                newsletterForm.reset();
            } else {
                // Error
                showMessage(
                    data.message || (currentLang === 'hr' 
                        ? 'Došlo je do greške. Molimo pokušajte ponovno.' 
                        : 'An error occurred. Please try again.'),
                    'error'
                );
            }
        } catch (error) {
            // Network or other error
            showMessage(
                currentLang === 'hr' 
                    ? 'Došlo je do greške. Molimo provjerite vašu internet vezu.' 
                    : 'An error occurred. Please check your internet connection.',
                'error'
            );
        }
    });

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = 'newsletter-message ' + type;
        
        // Force a reflow to ensure the animation works
        messageDiv.offsetHeight;
        
        messageDiv.classList.add('active');

        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.classList.remove('active');
        }, 5000);
    }
}); 