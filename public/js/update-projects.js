const fs = require('fs');
const path = require('path');

// Project data with proper translations
const projectData = {
    'urban-stories': {
        title: 'Urban Stories',
        category: 'DOCUMENTARY',
        image: 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg',
        description: 'A compelling documentary series exploring the hidden stories of urban life and culture in modern cities. Through intimate portraits and candid moments, we uncover the extraordinary narratives that shape our urban communities.',
        client: 'City Documentary Fund',
        date: '2023',
        services: 'Direction, Cinematography, Editing',
        location: 'Zagreb, Croatia',
        gallery: [
            'https://images.pexels.com/photos/3945318/pexels-photo-3945318.jpeg',
            'https://images.pexels.com/photos/3945319/pexels-photo-3945319.jpeg',
            'https://images.pexels.com/photos/3945320/pexels-photo-3945320.jpeg',
            'https://images.pexels.com/photos/3945321/pexels-photo-3945321.jpeg'
        ]
    },
    'light-and-shadow': {
        title: 'Light & Shadow',
        category: 'CINEMATOGRAPHY',
        image: 'https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg',
        description: 'An artistic exploration of light and shadow in urban architecture and daily life, capturing the interplay between natural and artificial illumination in contemporary spaces.',
        client: 'Art Gallery Zagreb',
        date: '2023',
        services: 'Cinematography, Lighting Design',
        location: 'Zagreb, Croatia',
        gallery: [
            'https://images.pexels.com/photos/2510429/pexels-photo-2510429.jpeg',
            'https://images.pexels.com/photos/2510430/pexels-photo-2510430.jpeg',
            'https://images.pexels.com/photos/2510431/pexels-photo-2510431.jpeg',
            'https://images.pexels.com/photos/2510432/pexels-photo-2510432.jpeg'
        ]
    },
    'behind-the-scenes': {
        title: 'Behind the Scenes',
        category: 'FILM PRODUCTION',
        image: 'https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg',
        description: 'A fascinating look into the making of various film projects, revealing the creative process and collaborative effort that goes into bringing stories to life on screen.',
        client: 'Film Production Studio',
        date: '2023',
        services: 'Production, Documentation',
        location: 'Zagreb, Croatia',
        gallery: [
            'https://images.pexels.com/photos/3062542/pexels-photo-3062542.jpeg',
            'https://images.pexels.com/photos/3062543/pexels-photo-3062543.jpeg',
            'https://images.pexels.com/photos/3062544/pexels-photo-3062544.jpeg',
            'https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg'
        ]
    },
    'urban-motion': {
        title: 'Urban Motion',
        category: 'CINEMATOGRAPHY',
        image: 'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg',
        description: 'Capturing the dynamic movement and energy of city life through innovative cinematography techniques, showcasing the rhythm and flow of urban environments.',
        client: 'City Arts Council',
        date: '2023',
        services: 'Cinematography, Motion Design',
        location: 'Zagreb, Croatia',
        gallery: [
            'https://images.pexels.com/photos/1707821/pexels-photo-1707821.jpeg',
            'https://images.pexels.com/photos/1707822/pexels-photo-1707822.jpeg',
            'https://images.pexels.com/photos/1707823/pexels-photo-1707823.jpeg',
            'https://images.pexels.com/photos/1707824/pexels-photo-1707824.jpeg'
        ]
    },
    'film-academy': {
        title: 'Film Academy',
        category: 'WORKSHOP',
        image: 'https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg',
        description: 'Educational workshops and training sessions designed to nurture the next generation of filmmakers, providing hands-on experience with professional equipment and techniques.',
        client: 'Film Education Institute',
        date: '2023',
        services: 'Education, Training, Mentoring',
        location: 'Zagreb, Croatia',
        gallery: [
            'https://images.pexels.com/photos/3379935/pexels-photo-3379935.jpeg',
            'https://images.pexels.com/photos/3379936/pexels-photo-3379936.jpeg',
            'https://images.pexels.com/photos/3379937/pexels-photo-3379937.jpeg',
            'https://images.pexels.com/photos/3379938/pexels-photo-3379938.jpeg'
        ]
    },
    'city-lights': {
        title: 'City Lights',
        category: 'FILM PRODUCTION',
        image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
        description: 'A visual journey through the nightlife and illuminated landscapes of urban environments, exploring the city\'s transformation after dark.',
        client: 'Urban Culture Institute',
        date: '2023',
        services: 'Production, Night Photography',
        location: 'Zagreb, Croatia',
        gallery: [
            'https://images.pexels.com/photos/2774557/pexels-photo-2774557.jpeg',
            'https://images.pexels.com/photos/2774558/pexels-photo-2774558.jpeg',
            'https://images.pexels.com/photos/2774559/pexels-photo-2774559.jpeg',
            'https://images.pexels.com/photos/2774560/pexels-photo-2774560.jpeg'
        ]
    },
    'street-culture': {
        title: 'Street Culture',
        category: 'DOCUMENTARY',
        image: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg',
        description: 'Documenting the vibrant street culture and urban art scenes, showcasing the creative expression and cultural diversity of city streets.',
        client: 'Street Art Foundation',
        date: '2023',
        services: 'Documentary, Street Photography',
        location: 'Zagreb, Croatia',
        gallery: [
            'https://images.pexels.com/photos/2608518/pexels-photo-2608518.jpeg',
            'https://images.pexels.com/photos/2608519/pexels-photo-2608519.jpeg',
            'https://images.pexels.com/photos/2608520/pexels-photo-2608520.jpeg',
            'https://images.pexels.com/photos/2608521/pexels-photo-2608521.jpeg'
        ]
    },
    'night-scenes': {
        title: 'Night Scenes',
        category: 'FILM PRODUCTION',
        image: 'https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg',
        description: 'Exploring the mysterious and captivating atmosphere of urban nightlife through cinematic storytelling and atmospheric cinematography.',
        client: 'Night Culture Association',
        date: '2023',
        services: 'Production, Night Cinematography',
        location: 'Zagreb, Croatia',
        gallery: [
            'https://images.pexels.com/photos/3062546/pexels-photo-3062546.jpeg',
            'https://images.pexels.com/photos/3062547/pexels-photo-3062547.jpeg',
            'https://images.pexels.com/photos/3062548/pexels-photo-3062548.jpeg',
            'https://images.pexels.com/photos/3062549/pexels-photo-3062549.jpeg'
        ]
    },
    'urban-life': {
        title: 'Urban Life',
        category: 'DOCUMENTARY',
        image: 'https://images.pexels.com/photos/2346594/pexels-photo-2346594.jpeg',
        description: 'A documentary series showcasing different aspects of contemporary urban living, from daily routines to extraordinary moments that shape city life.',
        client: 'Urban Development Fund',
        date: '2023',
        services: 'Documentary, Urban Photography',
        location: 'Zagreb, Croatia',
        gallery: [
            'https://images.pexels.com/photos/2346595/pexels-photo-2346595.jpeg',
            'https://images.pexels.com/photos/2346596/pexels-photo-2346596.jpeg',
            'https://images.pexels.com/photos/2346597/pexels-photo-2346597.jpeg',
            'https://images.pexels.com/photos/2346598/pexels-photo-2346598.jpeg'
        ]
    }
};

// Template for project pages
function generateProjectHTML(projectId, data) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} - Portfolio</title>
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="project.css">
</head>
<body>
    <div class="project-page">
        <!-- Close Button -->
        <a href="../index.html#projects" class="project-close">&times;</a>

        <!-- Project Hero -->
        <div class="project-hero">
            <img src="${data.image}" alt="${data.title}">
            <div class="project-hero-content">
                <span class="project-category">${data.category}</span>
                <h1 class="project-title">${data.title}</h1>
            </div>
        </div>
        
        <!-- Project Content -->
        <div class="project-content">
            <div class="project-main">
                <div class="project-description">
                    <h2>Project Overview</h2>
                    <p>${data.description}</p>
                </div>

                <div class="project-details-grid">
                    <div class="detail-item">
                        <h3>Client</h3>
                        <p>${data.client}</p>
                    </div>
                    <div class="detail-item">
                        <h3>Date</h3>
                        <p>${data.date}</p>
                    </div>
                    <div class="detail-item">
                        <h3>Services</h3>
                        <p>${data.services}</p>
                    </div>
                    <div class="detail-item">
                        <h3>Location</h3>
                        <p>${data.location}</p>
                    </div>
                </div>

                <div class="project-gallery">
                    ${data.gallery.map((img, index) => `
                    <div class="gallery-item">
                        <img src="${img}" alt="${data.title} - Scene ${index + 1}">
                    </div>
                    `).join('')}
                </div>
            </div>

            <!-- Project Navigation -->
            <div class="project-navigation">
                <a href="${getPreviousProject(projectId)}.html" class="prev-project">
                    <span>Previous Project</span>
                    <h4>${projectData[getPreviousProject(projectId)].title}</h4>
                </a>
                <a href="${getNextProject(projectId)}.html" class="next-project">
                    <span>Next Project</span>
                    <h4>${projectData[getNextProject(projectId)].title}</h4>
                </a>
            </div>
        </div>

        <!-- Project Footer -->
        <footer class="project-footer">
            <p>© <script>document.write(new Date().getFullYear())</script> <a href="../index.html">Kratki Metar</a></p>
        </footer>
    </div>

    <script src="../script.js"></script>
</body>
</html>`;
}

// Helper functions for navigation
function getProjectIds() {
    return Object.keys(projectData);
}

function getPreviousProject(currentId) {
    const ids = getProjectIds();
    const currentIndex = ids.indexOf(currentId);
    return ids[currentIndex === 0 ? ids.length - 1 : currentIndex - 1];
}

function getNextProject(currentId) {
    const ids = getProjectIds();
    const currentIndex = ids.indexOf(currentId);
    return ids[currentIndex === ids.length - 1 ? 0 : currentIndex + 1];
}

// Update all project files
Object.keys(projectData).forEach(projectId => {
    const filePath = path.join(__dirname, '..', 'projects', `${projectId}.html`);
    const htmlContent = generateProjectHTML(projectId, projectData[projectId]);
    fs.writeFileSync(filePath, htmlContent);
});

console.log('All project files have been updated successfully!'); 