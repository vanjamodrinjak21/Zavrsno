// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const toggler = document.querySelector('.toggler');
    const menuWrap = document.querySelector('.menu-wrap');
    const menuLinks = document.querySelectorAll('.menu-wrap .menu a');
    const navbar = document.querySelector('.navbar');
    const languageBtns = document.querySelectorAll('.language-btn');
    const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-links a');

    // Navigation translations
    const translations = {
        en: {
            home: 'HOME',
            about: 'ABOUT US',
            projects: 'PROJECTS',
            contact: 'CONTACT'
        },
        hr: {
            home: 'POČETNA',
            about: 'O NAMA',
            projects: 'PROJEKTI',
            contact: 'KONTAKT'
        }
    };

    // Function to update navigation text
    function updateNavigation(lang) {
        // Update desktop navigation
        desktopNavLinks.forEach(link => {
            const key = link.getAttribute('data-nav');
            if (key && translations[lang][key]) {
                link.textContent = translations[lang][key];
            }
        });

        // Update mobile navigation
        menuLinks.forEach(link => {
            const key = link.getAttribute('data-nav');
            if (key && translations[lang][key]) {
                link.textContent = translations[lang][key];
            }
        });

        // Update all language buttons (both desktop and mobile)
        document.querySelectorAll('.language-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Store language preference
        localStorage.setItem('preferred-language', lang);
        document.documentElement.lang = lang;
    }

    // Handle language switching
    languageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            updateNavigation(lang);
        });
    });

    // Set initial language from localStorage or default to 'hr'
    const storedLang = localStorage.getItem('preferred-language') || 'hr';
    updateNavigation(storedLang);

    // Handle menu links
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Close menu and navigate
            toggler.checked = false;
            setTimeout(() => {
                window.location.hash = href;
            }, 300);
        });
    });

    // Handle scroll for navbar background
    let lastScrollTop = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && toggler.checked) {
            toggler.checked = false;
        }
    });

    // Prevent body scroll when menu is open
    toggler.addEventListener('change', function() {
        document.body.style.overflow = this.checked ? 'hidden' : '';
    });
}); 