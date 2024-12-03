document.addEventListener('DOMContentLoaded', function() {
    // Get navigation elements
    const prevProject = document.querySelector('.prev-project');
    const nextProject = document.querySelector('.next-project');

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Left arrow key for previous project
        if (e.key === 'ArrowLeft' && prevProject) {
            window.location.href = prevProject.href;
        }
        // Right arrow key for next project
        if (e.key === 'ArrowRight' && nextProject) {
            window.location.href = nextProject.href;
        }
    });

    // Add hover effects and loading states
    [prevProject, nextProject].forEach(link => {
        if (!link) return;

        // Add hover effect
        link.addEventListener('mouseenter', function() {
            this.style.opacity = '0.7';
        });

        link.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });

        // Add loading state on click
        link.addEventListener('click', function() {
            this.style.opacity = '0.5';
        });
    });

    // Preload next and previous images for smoother transitions
    function preloadImage(url) {
        const img = new Image();
        img.src = url;
    }

    // Extract hero image URLs from navigation links
    const projectLinks = document.querySelectorAll('.project-navigation a');
    projectLinks.forEach(link => {
        fetch(link.href)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const heroImg = doc.querySelector('.project-hero img');
                if (heroImg && heroImg.src) {
                    preloadImage(heroImg.src);
                }
            })
            .catch(console.error);
    });
}); 