const fs = require('fs');
const path = require('path');

// Read CPM.js file
const cpmPath = path.join(__dirname, '../Captivate Publish/assets/js/CPM.js');
const cpmContent = fs.readFileSync(cpmPath, 'utf8');

// Read existing slide-data.json
const slideDataPath = path.join(__dirname, '../src/data/slide-data.json');
const slideData = JSON.parse(fs.readFileSync(slideDataPath, 'utf8'));

// Extract timing data for a specific slide
function extractSlideTimingData(slideId, cpmContent) {
    const timingData = {};

    // Use slide name (e.g., 'Slide33951') for matching
    const slideName = slideId.includes('Slide') ? slideId : `Slide${slideId}`;
    console.log(`Looking for timing data for slide: ${slideName}`);

    // Regular expression to find element timing: ElementName:{type:X,from:Y,to:Z,...}
    const elementRegex = new RegExp(`(\\w+):\\{type:(\\d+),from:(\\d+),to:(\\d+),([^}]*?)\\}`, 'g');

    let match;
    let foundElements = 0;
    let matchingElements = 0;

    while ((match = elementRegex.exec(cpmContent)) !== null) {
        const [, elementId, type, fromFrame, toFrame, rest] = match;
        foundElements++;

        // Check if this element belongs to the slide we're looking for
        if (rest.includes(`apsn:'${slideName}'`)) {
            matchingElements++;
            console.log(`Found timing for ${elementId}: frames ${fromFrame}-${toFrame}, slide: ${slideName}`);

            // Extract transition info (trin/trout)
            const trinMatch = rest.match(/trin:(\\d+)/);
            const troutMatch = rest.match(/trout:(\\d+)/);

            timingData[elementId] = {
                type: parseInt(type),
                fromFrame: parseInt(fromFrame),
                toFrame: parseInt(toFrame),
                startTime: parseFloat((parseInt(fromFrame) / 30).toFixed(2)), // 30fps
                endTime: parseFloat((parseInt(toFrame) / 30).toFixed(2)),
                fadeInFrames: trinMatch ? parseInt(trinMatch[1]) : 0,
                fadeOutFrames: troutMatch ? parseInt(troutMatch[1]) : 0
            };
        }
    }

    console.log(`Total elements found: ${foundElements}, matching ${slideName}: ${matchingElements}`);
    return timingData;
}

// Get slide ID from command line argument or default to Slide3917
const slideIdToProcess = process.argv[2] || 'Slide3917';

// Process the specified slide
const slideTiming = extractSlideTimingData(slideIdToProcess, cpmContent);

console.log(`Extracted timing for ${slideIdToProcess}:`);
console.log(JSON.stringify(slideTiming, null, 2));

// Find slide in slide-data.json and add timing
const slideIndex = slideData.slides.findIndex(s => s.id === slideIdToProcess);
if (slideIndex !== -1) {
    const slide = slideData.slides[slideIndex];

    // Add timing to text captions
    if (slide.content && slide.content.textCaptions) {
        slide.content.textCaptions = slide.content.textCaptions.map(caption => {
            const timing = slideTiming[caption.id];
            if (timing) {
                return {
                    ...caption,
                    startTime: timing.startTime,
                    endTime: timing.endTime,
                    fadeInDuration: timing.fadeInFrames / 30,
                    fadeOutDuration: timing.fadeOutFrames / 30
                };
            }
            return caption;
        });
    }

    // Add timing to images
    if (slide.content && slide.content.images) {
        slide.content.images = slide.content.images.map(image => {
            const timing = slideTiming[image.id];
            if (timing) {
                return {
                    ...image,
                    startTime: timing.startTime,
                    endTime: timing.endTime,
                    fadeInDuration: timing.fadeInFrames / 30,
                    fadeOutDuration: timing.fadeOutFrames / 30
                };
            }
            return image;
        });
    }

    slideData.slides[slideIndex] = slide;
}

// Write updated slide-data.json
fs.writeFileSync(slideDataPath, JSON.stringify(slideData, null, 2));

console.log('\nTiming data added to slide-data.json');
console.log(`Updated ${slideIndex !== -1 ? slideIdToProcess : 'no slides'}`);
