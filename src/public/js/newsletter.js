function showNewsletterAlert(message, type = 'error') {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.newsletter-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create new alert
    const alert = document.createElement('div');
    alert.className = `newsletter-alert ${type}`;
    alert.textContent = message;

    // Add to DOM
    document.body.appendChild(alert);

    // Remove after 5 seconds
    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 5000);
}

document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    
    try {
        const response = await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, language: 'hr' })
        });

        const data = await response.json();

        if (data.success) {
            showNewsletterAlert(data.message, 'success');
            document.getElementById('newsletter-email').value = '';
        } else {
            showNewsletterAlert(data.error, 'error');
        }
    } catch (error) {
        showNewsletterAlert('Došlo je do pogreške. Molimo pokušajte ponovno.', 'error');
    }
}); 