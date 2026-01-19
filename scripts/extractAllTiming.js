const fs = require('fs');
const path = require('path');

// Read existing slide-data.json
const slideDataPath = path.join(__dirname, '../src/data/slide-data.json');
const slideData = JSON.parse(fs.readFileSync(slideDataPath, 'utf8'));

// Get all slide IDs
const slideIds = slideData.slides.map(slide => slide.id);

console.log(`Processing timing data for ${slideIds.length} slides...`);

// Import the single slide timing function
const { spawn } = require('child_process');

async function processAllSlides() {
    let processedCount = 0;

    for (const slideId of slideIds) {
        try {
            console.log(`\n--- Processing ${slideId} (${processedCount + 1}/${slideIds.length}) ---`);

            // Run the extractTiming.js script for each slide
            const result = await new Promise((resolve, reject) => {
                const child = spawn('node', ['scripts/extractTiming.js', slideId], {
                    stdio: 'inherit',
                    cwd: path.join(__dirname, '..')
                });

                child.on('close', (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error(`Process exited with code ${code}`));
                    }
                });
            });

            processedCount++;

        } catch (error) {
            console.error(`Error processing ${slideId}:`, error);
        }
    }

    console.log(`\n✅ Completed processing ${processedCount} slides`);
}

processAllSlides();