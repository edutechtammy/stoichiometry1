const fs = require('fs');
const path = require('path');

// Read CPM.js file
const cpmPath = path.join(__dirname, '../Captivate Publish/assets/js/CPM.js');
const cpmContent = fs.readFileSync(cpmPath, 'utf8');

// Read existing slide-data.json
const slideDataPath = path.join(__dirname, '../rebuild-to-html/src/data/slide-data.json');
const slideData = JSON.parse(fs.readFileSync(slideDataPath, 'utf8'));

// Get slide ID to process from command line arg
const slideIdToProcess = process.argv[2] || 'Slide3917';

console.log(`\n=== Extracting SmartShapes for ${slideIdToProcess} ===\n`);

// Pattern to match SmartShape timing data: SmartShape_XXX:{type:612,from:X,to:Y,...apsn:'SlideID',...}
const shapeTimingPattern = /(\w+):\{type:612,from:(\d+),to:(\d+),([^}]*?apsn:'([^']+)'[^}]*?)\}/g;

// Pattern to match SmartShape content data: SmartShape_XXXc:{b:[...],ip:'...',accstr:'...',...}
const shapeContentPattern = /(\w+)c:\{b:\[(\d+),(\d+),(\d+),(\d+)\][^}]*?ip:'([^']*?)'[^}]*?accstr:'([^']*?)'/g;

// Extract timing data
const shapes = [];
let match;

while ((match = shapeTimingPattern.exec(cpmContent)) !== null) {
    const [, elementId, fromFrame, toFrame, rest, slideId] = match;

    if (slideId === slideIdToProcess) {
        // Extract trin and trout (fade durations)
        const trinMatch = rest.match(/trin:(\d+)/);
        const troutMatch = rest.match(/trout:(\d+)/);

        const trin = trinMatch ? parseInt(trinMatch[1]) : 0;
        const trout = troutMatch ? parseInt(troutMatch[1]) : 0;

        shapes.push({
            id: elementId,
            fromFrame: parseInt(fromFrame),
            toFrame: parseInt(toFrame),
            fadeInFrames: trin,
            fadeOutFrames: trout
        });
    }
}

// Extract position and content data
const shapeContentMap = {};
let contentMatch;

while ((contentMatch = shapeContentPattern.exec(cpmContent)) !== null) {
    const [, baseId, left, top, right, bottom, imagePath, accessibleText] = contentMatch;

    shapeContentMap[baseId] = {
        position: {
            left: parseInt(left),
            top: parseInt(top),
            width: parseInt(right) - parseInt(left),
            height: parseInt(bottom) - parseInt(top)
        },
        imagePath: imagePath || null,
        text: accessibleText.trim() || ''
    };
}

// Merge timing with content data
const extractedShapes = shapes.map(shape => {
    const contentData = shapeContentMap[shape.id] || {};

    return {
        id: shape.id,
        position: contentData.position || { left: 0, top: 0, width: 100, height: 100 },
        imagePath: contentData.imagePath,
        text: contentData.text,
        startTime: parseFloat((shape.fromFrame / 30).toFixed(2)),
        endTime: parseFloat((shape.toFrame / 30).toFixed(2)),
        fadeInDuration: parseFloat((shape.fadeInFrames / 30).toFixed(2)),
        fadeOutDuration: parseFloat((shape.fadeOutFrames / 30).toFixed(2))
    };
}).sort((a, b) => a.startTime - b.startTime);

console.log(`Found ${extractedShapes.length} SmartShapes:\n`);
extractedShapes.forEach(shape => {
    console.log(`  ${shape.id}:`);
    console.log(`    Text: "${shape.text}"`);
    console.log(`    Position: (${shape.position.left}, ${shape.position.top})`);
    console.log(`    Size: ${shape.position.width}x${shape.position.height}`);
    console.log(`    Image: ${shape.imagePath || 'none'}`);
    console.log(`    Time: ${shape.startTime}s - ${shape.endTime}s`);
    console.log(`    Fades: in=${shape.fadeInDuration}s, out=${shape.fadeOutDuration}s`);
    console.log('');
});

// Update slide-data.json
const slide = slideData.slides.find(s => s.id === slideIdToProcess);

if (slide) {
    if (!slide.content.shapes) {
        slide.content.shapes = [];
    }

    // Add or update shapes
    extractedShapes.forEach(extractedShape => {
        const existingIndex = slide.content.shapes.findIndex(s => s.id === extractedShape.id);
        if (existingIndex >= 0) {
            slide.content.shapes[existingIndex] = extractedShape;
            console.log(`Updated ${extractedShape.id}`);
        } else {
            slide.content.shapes.push(extractedShape);
            console.log(`Added ${extractedShape.id}`);
        }
    });

    // Write updated data back to file
    fs.writeFileSync(slideDataPath, JSON.stringify(slideData, null, 2));
    console.log(`\n✓ Updated slide-data.json with ${extractedShapes.length} shapes for ${slideIdToProcess}`);
} else {
    console.error(`\n✗ Slide ${slideIdToProcess} not found in slide-data.json`);
}
