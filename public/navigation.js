document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const learnMoreBtn = document.querySelector('.learn-more-btn');

    // Toggle menu function
    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    };
    
    // Close menu function
    const closeMenu = () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    };
    
    // Menu toggle click handler
    menuToggle?.addEventListener('click', toggleMenu);
    
    // Add click handlers to all nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) { // Only on mobile
                closeMenu();
            }
            
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Learn More button scroll
    learnMoreBtn?.addEventListener('click', function(e) {
        e.preventDefault();
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });

    // Update copyright year
    const yearElement = document.querySelector('.footer-bottom .year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}); 