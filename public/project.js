document.addEventListener('DOMContentLoaded', () => {
    // Loading animation
    const loadingOverlay = document.querySelector('.loading-overlay');
    
    // Hide loading overlay after content is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }, 1500); // Show loading for 1.5 seconds minimum
    });

    // Show loading overlay when navigating away
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.hasAttribute('download') && link.href && !link.href.includes('#')) {
                e.preventDefault();
                loadingOverlay.style.display = 'flex';
                setTimeout(() => {
                    loadingOverlay.style.opacity = '1';
                }, 0);
                setTimeout(() => {
                    window.location = link.href;
                }, 500);
            }
        });
    });

    // Gallery image click handler for lightbox
    const galleryImages = document.querySelectorAll('.gallery-grid img');
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="close-lightbox">&times;</button>
                </div>
            `;
            document.body.appendChild(lightbox);
            
            // Close lightbox
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.className === 'close-lightbox') {
                    lightbox.remove();
                }
            });
        });
    });
}); 