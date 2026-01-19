const fs = require('fs');
const path = require('path');

// Read CPM.js
const cpmPath = path.join(__dirname, '../Captivate Publish/assets/js/CPM.js');
const cpmContent = fs.readFileSync(cpmPath, 'utf8');

// Read existing slide data
const slideDataPath = path.join(__dirname, '../src/data/slide-data.json');
const slideData = JSON.parse(fs.readFileSync(slideDataPath, 'utf8'));

console.log('Extracting audio mappings from CPM.js...\n');

// Extract slide audio associations
const slideAudiosMatch = cpmContent.match(/slideAudios:'([^']+)'/);
if (slideAudiosMatch) {
    const audioIds = slideAudiosMatch[1].split(',');
    console.log(`Found ${audioIds.length} slide audio references:`, audioIds);
}

// Extract all audio file references
const audioRefs = new Set();
const audioPattern = /ar\/(\d+)\.mp3/g;
let match;
while ((match = audioPattern.exec(cpmContent)) !== null) {
    audioRefs.add(match[1]);
}
console.log(`\nFound ${audioRefs.size} unique audio files:`, Array.from(audioRefs).sort());

// Look for StAd (Slide Audio) definitions
// Pattern: StAd0:{from:1,to:1444,src:'ar/41356.mp3',du:48153}
console.log('\nSearching for StAd definitions...');
const stAdPattern = /StAd(\d+):\{from:(\d+),to:(\d+),src:'ar\/(\d+)\.mp3',du:(\d+)\}/g;
let stAdMatch;
const stAdMappings = [];

while ((stAdMatch = stAdPattern.exec(cpmContent)) !== null) {
    const [, stAdIndex, fromFrame, toFrame, audioFile, duration] = stAdMatch;
    stAdMappings.push({
        index: parseInt(stAdIndex),
        fromFrame: parseInt(fromFrame),
        toFrame: parseInt(toFrame),
        audioFile: audioFile,
        duration: parseInt(duration),
        audioPath: `ar/${audioFile}.mp3`
    });
    console.log(`  StAd${stAdIndex}: frames ${fromFrame}-${toFrame}, ${audioFile}.mp3 (${duration}ms)`);
}

console.log(`\nFound ${stAdMappings.length} StAd definitions`);

// Extract slide frame ranges from CPM.js
console.log('\nExtracting slide frame ranges...');
slideData.slides.forEach(slide => {
    const slidePattern = new RegExp(`${slide.id}:\\{[^}]*?from:(\\d+),to:(\\d+)[^}]*?\\}`);
    const slideMatch = cpmContent.match(slidePattern);
    if (slideMatch) {
        slide.from = parseInt(slideMatch[1]);
        slide.to = parseInt(slideMatch[2]);
        console.log(`  ${slide.id}: frames ${slide.from}-${slide.to}`);
    }
});

// Map audio to slides by frame overlap
console.log('\nMapping audio to slides...');
const finalAudioMap = {};

stAdMappings.forEach(audio => {
    slideData.slides.forEach(slide => {
        const audioStart = audio.fromFrame;
        const audioEnd = audio.toFrame;
        const slideStart = slide.from;
        const slideEnd = slide.to;

        // Check for frame range overlap
        if (slideStart && slideEnd && audioStart <= slideEnd && audioEnd >= slideStart) {
            if (!finalAudioMap[slide.id]) {
                finalAudioMap[slide.id] = [];
            }
            finalAudioMap[slide.id].push({
                path: audio.audioPath,
                duration: audio.duration
            });
            console.log(`  ${slide.id} (${slide.label}): ${audio.audioPath}`);
        }
    });
});

// Update slide data
let updatedCount = 0;
slideData.slides.forEach(slide => {
    if (finalAudioMap[slide.id]) {
        slide.audio = finalAudioMap[slide.id];
        updatedCount++;
    }
});

// Write updated data
fs.writeFileSync(slideDataPath, JSON.stringify(slideData, null, 2));

console.log(`\n✅ Successfully updated ${updatedCount} slides with audio`);
console.log('\n--- Summary ---');
console.log(`Total audio files: ${audioRefs.size}`);
console.log(`Slides with audio: ${Object.keys(finalAudioMap).length}`);
console.log(`Updated: ${slideDataPath}`);
