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