const fs = require('fs');
const path = require('path');

// Paths
const cpmPath = '/Volumes/LaCie 2/00_Development/01_Repositories/Stoichiometry/rebuild-to-html/Captivate Publish/assets/js/CPM.js';
const slideDataPath = path.join(__dirname, '../src/data/slide-data.json');

console.log('Reading CPM.js...');
const cpmContent = fs.readFileSync(cpmPath, 'utf8');

console.log('Reading slide-data.json...');
const slideData = JSON.parse(fs.readFileSync(slideDataPath, 'utf8'));

// Extract positioning data by element name/ID
// Pattern: elementName:{...ip:'dr/filename.png'...b:[left,top,right,bottom]...}
// Note: CPM uses elementId + 'c' suffix for positioned elements
const elementPattern = /(\w+):\{[^}]*?ip:'dr\/([^']+)'[^}]*?b:\[(\d+),(\d+),(\d+),(\d+)\]/g;

const positionsByElementId = new Map();
let match;

console.log('\nExtracting position data from CPM.js...');
while ((match = elementPattern.exec(cpmContent)) !== null) {
    const [, elementIdWithC, imagePath, left, top, right, bottom] = match;

    // Remove 'c' suffix to match slide-data IDs
    const elementId = elementIdWithC.endsWith('c') ? elementIdWithC.slice(0, -1) : elementIdWithC;

    positionsByElementId.set(elementId, {
        elementId,
        imagePath,
        x: parseInt(left),
        y: parseInt(top),
        width: parseInt(right) - parseInt(left),
        height: parseInt(bottom) - parseInt(top)
    });
}

console.log(`Found ${positionsByElementId.size} positioned elements`);

// Update slide data with positioning information
let updatedCount = 0;

// Function to update element arrays with position data
function updateElements(elements, positionsMap) {
    if (!elements || !Array.isArray(elements)) return 0;

    let count = 0;
    elements.forEach(element => {
        const elementId = element.id || element.instance;
        if (elementId && positionsMap.has(elementId)) {
            const pos = positionsMap.get(elementId);
            element.position = {
                x: pos.x,
                y: pos.y,
                width: pos.width,
                height: pos.height
            };
            element.imagePath = `assets/dr/${pos.imagePath}`;
            count++;
        }
    });
    return count;
}

slideData.slides.forEach(slide => {
    if (slide.content) {
        updatedCount += updateElements(slide.content.textCaptions, positionsByElementId);
        updatedCount += updateElements(slide.content.images, positionsByElementId);
        updatedCount += updateElements(slide.content.shapes, positionsByElementId);
        updatedCount += updateElements(slide.content.buttons, positionsByElementId);
        updatedCount += updateElements(slide.content.clickBoxes, positionsByElementId);
    }
});

console.log(`Updated ${updatedCount} elements with position data`);

// Save updated slide data
const outputPath = slideDataPath;
fs.writeFileSync(outputPath, JSON.stringify(slideData, null, 2));
console.log(`\nUpdated slide data saved to: ${outputPath}`);

// Print sample of positioned elements
console.log('\nSample positioned elements:');
let sampleCount = 0;
for (const slide of slideData.slides) {
    if (slide.elements && sampleCount < 5) {
        for (const element of slide.elements) {
            if (element.position && sampleCount < 5) {
                console.log(`  ${slide.title}: ${element.type} at (${element.position.x}, ${element.position.y}) size ${element.position.width}x${element.position.height}`);
                sampleCount++;
            }
        }
    }
}
