// Project Randomizer Module
const ProjectRandomizer = {
    init() {
        const projectsContainer = document.querySelector('.projects-grid');
        if (!projectsContainer) return;

        const projectItems = Array.from(projectsContainer.children);
        
        // Shuffle array
        for (let i = projectItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            projectsContainer.appendChild(projectItems[j]);
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ProjectRandomizer.init();
});

document.querySelectorAll('.project-button').forEach(button => {
    button.addEventListener('click', (e) => {
        // Remove active class from all buttons
        document.querySelectorAll('.project-button').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to clicked button
        e.target.classList.add('active');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('form[data-form="newsletter"]');
    const currentLang = document.documentElement.lang || 'hr';
    
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const characterCount = newsletterForm.querySelector('.character-count');
        const maxLength = parseInt(emailInput.getAttribute('maxlength')) || 500;

        // Update character count on input
        emailInput.addEventListener('input', function() {
            const currentLength = this.value.length;
            characterCount.textContent = `${currentLength}/${maxLength}`;

            // Update counter color based on length
            if (currentLength >= maxLength) {
                characterCount.classList.add('at-limit');
                characterCount.classList.remove('near-limit');
            } else if (currentLength >= maxLength * 0.8) {
                characterCount.classList.add('near-limit');
                characterCount.classList.remove('at-limit');
            } else {
                characterCount.classList.remove('near-limit', 'at-limit');
            }
        });
    }
});

function showNewsletterMessage(message, type) {
    const messageDiv = document.querySelector('.newsletter-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `newsletter-message ${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const textarea = contactForm.querySelector('textarea');
    const charCount = contactForm.querySelector('.character-count');
    const maxLength = parseInt(textarea.getAttribute('maxlength')) || 500;

    // Update character count
    textarea.addEventListener('input', function() {
        const remaining = maxLength - this.value.length;
        charCount.textContent = `${this.value.length}/${maxLength}`;
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Handle form submission
        const responseMessage = document.querySelector('.response-message');
        responseMessage.classList.add('active');
        this.reset();
        charCount.textContent = `0/${maxLength}`;
    });


    //Filter for projects
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});