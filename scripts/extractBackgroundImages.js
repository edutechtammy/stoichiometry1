const fs = require('fs');

// Read CPM.js
const cpmContent = fs.readFileSync('Captivate Publish/assets/js/CPM.js', 'utf8');

// Pattern to match si elements with 'c' suffix (positioned images)
// Format: siXXXXXc:{b:[left,top,right,bottom],...ip:'dr/filename.png'}
const pattern = /si(\d+)c:\{b:\[(\d+),(\d+),(\d+),(\d+)\][^}]*ip:'([^']+)'/g;

let match;
const images = [];

while ((match = pattern.exec(cpmContent)) !== null) {
    const uid = match[1];
    const left = parseInt(match[2]);
    const top = parseInt(match[3]);
    const right = parseInt(match[4]);
    const bottom = parseInt(match[5]);
    const imagePath = match[6];

    const width = right - left;
    const height = bottom - top;

    images.push({
        id: `si${uid}`,
        x: left,
        y: top,
        width: width,
        height: height,
        imagePath: imagePath,
        uid: parseInt(uid)
    });
}

// Group by slide
const imagesBySlide = {};
images.forEach(img => {
    // Assuming si37648 belongs to Slide37646 (rough grouping by id proximity)
    // This is a heuristic - we'll refine based on actual slide structure
    const slideId = Math.floor(img.uid / 100) * 100;
    const slideName = `Slide${slideId}`;

    if (!imagesBySlide[slideName]) {
        imagesBySlide[slideName] = [];
    }
    imagesBySlide[slideName].push(img);
});

console.log('Total images found:', images.length);
console.log('\nImages by slide:');
Object.keys(imagesBySlide).sort().forEach(slide => {
    console.log(`\n${slide}:`);
    imagesBySlide[slide].forEach(img => {
        console.log(`  ${img.id}: ${img.width}x${img.height} at (${img.x},${img.y}) - ${img.imagePath}`);
    });
});

// Now let's find specifically which images are on Slide37646
console.log('\n\nSearching for Slide37646 image references in CPM.js...');
const slide37646Match = cpmContent.match(/Slide37646:\{[^}]*children:\[([^\]]+)\]/);
if (slide37646Match) {
    const children = slide37646Match[1];
    const siRefs = children.match(/si\d+/g) || [];
    console.log('Slide37646 children references:', siRefs);

    console.log('\nSlide37646 images:');
    siRefs.forEach(ref => {
        const img = images.find(i => i.id === ref);
        if (img) {
            console.log(JSON.stringify(img, null, 2));
        }
    });
}

// Write results to JSON
fs.writeFileSync('extracted-images.json', JSON.stringify(images, null, 2));
console.log('\n\nAll images saved to extracted-images.json');
