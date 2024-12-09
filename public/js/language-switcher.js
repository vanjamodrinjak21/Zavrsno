document.addEventListener('DOMContentLoaded', function() {
    const languageButtons = document.querySelectorAll('.language-btn');
    
    function updateContent(lang) {
        document.documentElement.lang = lang;
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const keys = element.getAttribute('data-i18n').split('.');
            let translation = translations[lang];
            for (const key of keys) {
                translation = translation?.[key];
            }
            if (translation) {
                // Special handling for title tags
                if (element.tagName === 'TITLE') {
                    element.textContent = translation;
                }
                // For inputs and textareas, update placeholder and label
                else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                    // Update associated label if exists
                    const label = document.querySelector(`label[for="${element.id}"]`);
                    if (label) {
                        label.textContent = translation;
                    }
                } 
                // For links in project navigation, update the text content
                else if (element.closest('.project-navigation')) {
                    element.textContent = translation;
                }
                // For all other elements
                else {
                    element.textContent = translation;
                }
            }
        });

        // Update document title if it has a data-i18n attribute
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const keys = titleElement.getAttribute('data-i18n').split('.');
            let translation = translations[lang];
            for (const key of keys) {
                translation = translation?.[key];
            }
            if (translation) {
                document.title = translation;
            }
        }

        // Update form placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const keys = element.getAttribute('data-i18n-placeholder').split('.');
            let translation = translations[lang];
            for (const key of keys) {
                translation = translation?.[key];
            }
            if (translation) {
                element.placeholder = translation;
            }
        });

        // Update project navigation titles
        document.querySelectorAll('.project-navigation a h4').forEach(element => {
            const projectId = element.closest('a').getAttribute('href').replace('.html', '').replace('./', '');
            const translationKey = `projects.items.${projectId.replace(/-/g, '')}.title`;
            let translation = translations[lang];
            translationKey.split('.').forEach(key => {
                translation = translation?.[key];
            });
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update active state of language buttons
        languageButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Store selected language
        localStorage.setItem('selectedLanguage', lang);
    }

    // Language switch event handlers
    languageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = button.getAttribute('data-lang');
            updateContent(lang);
        });
    });

    // Set initial language
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    updateContent(savedLanguage);
});