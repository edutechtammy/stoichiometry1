const fs = require('fs');
const path = require('path');

// Slides that use dr/4016.png background (24 total)
const slidesWithBackground = [
    'Slide3917', 'Slide28137', 'Slide33700', 'Slide33951', 'Slide37499',
    'Slide31383', 'Slide39911', 'Slide31809', 'Slide40210', 'Slide37646',
    'Slide33288', 'Slide18443', 'Slide22696', 'Slide4755', 'Slide23949',
    'Slide7173', 'Slide8701', 'Slide8887', 'Slide9077', 'Slide9249',
    'Slide9421', 'Slide9593', 'Slide39593', 'Slide41450'
];

// Slides to skip (already have background or shouldn't have one)
const skipSlides = ['Slide40210', 'Slide37646', 'Slide40393'];

const dataPath = path.join(__dirname, '../src/data/slide-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const backgroundImage = {
    id: "background",
    x: 0,
    y: 0,
    width: 880,
    height: 660,
    imagePath: "assets/dr/4016.png"
};

let updatedCount = 0;

data.slides.forEach(slide => {
    // Skip if not in background list or already processed
    if (!slidesWithBackground.includes(slide.id) || skipSlides.includes(slide.id)) {
        return;
    }

    // Check if images array exists
    if (!slide.content.images) {
        slide.content.images = [];
    }

    // Check if background already exists
    const hasBackground = slide.content.images.some(img => img.id === 'background');

    if (!hasBackground) {
        // Add background as first image
        slide.content.images.unshift(backgroundImage);
        console.log(`✓ Added background to ${slide.id} - ${slide.title}`);
        updatedCount++;
    } else {
        console.log(`- Skipped ${slide.id} (already has background)`);
    }
});

// Write updated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`\nComplete! Updated ${updatedCount} slides with background image.`);
console.log(`Skipped: ${skipSlides.join(', ')}`);
console.log(`No background: Slide40393 (Periodic Table)`);
