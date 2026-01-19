const fs = require('fs');
const path = require('path');

// Read CPM.js
const cpmPath = path.join(__dirname, '../../../rebuild-to-html/Captivate Publish/assets/js/CPM.js');
const cpmContent = fs.readFileSync(cpmPath, 'utf8');

// Read existing slide data
const slideDataPath = path.join(__dirname, '../src/data/slide-data.json');
const slideData = JSON.parse(fs.readFileSync(slideDataPath, 'utf8'));

console.log('Extracting click boxes from CPM.js for Activity 2 (Slide37646)...\n');

// Find the slide
const slide = slideData.slides.find(s => s.id === 'Slide37646');
if (!slide) {
    console.error('Slide37646 not found in slide-data.json');
    process.exit(1);
}

console.log(`Found: ${slide.label} (${slide.id})`);

// Extract all click box definitions for this slide
// Click boxes have 'c' suffix in CPM.js, just like other positioned elements
// Pattern: Click_Box_XXc:{b:[left,top,right,bottom],uid:XXXXX,...}
const clickBoxPattern = /(Clickbox_[^:]+|Click_Box_\d+)c:\{b:\[(\d+),(\d+),(\d+),(\d+)\],uid:(\d+)/g;
let match;
const clickBoxes = [];

while ((match = clickBoxPattern.exec(cpmContent)) !== null) {
    const [, name, left, top, right, bottom, uid] = match;
    const box = {
        id: name,
        uid: parseInt(uid),
        x: parseInt(left),
        y: parseInt(top),
        width: parseInt(right) - parseInt(left),
        height: parseInt(bottom) - parseInt(top)
    };
    clickBoxes.push(box);
}

console.log(`\nFound ${clickBoxes.length} total click boxes in CPM.js with positioning data`);

// Now find which ones belong to Slide37646 by checking the slide's si array
const slidePattern = /Slide37646:\{[^}]*si:\[([^\]]+)\]/;
const slideMatch = cpmContent.match(slidePattern);

if (!slideMatch) {
    console.error('Could not find Slide37646 si array');
    process.exit(1);
}

const siArray = slideMatch[1];
console.log('\nSlide items found:');

// Extract click box names from si array
const clickBoxNames = [];
const namePattern = /n:'(Clickbox_[^']+|Click_Box_\d+)'/g;
let nameMatch;

while ((nameMatch = namePattern.exec(siArray)) !== null) {
    clickBoxNames.push(nameMatch[1]);
    console.log(`  - ${nameMatch[1]}`);
}

console.log(`\nTotal click boxes on Slide37646: ${clickBoxNames.length}`);

// Filter to only clickboxes on this slide
const slideClickBoxes = clickBoxes.filter(box => clickBoxNames.includes(box.id));

console.log(`\nMatched ${slideClickBoxes.length} click boxes with positions:`);
slideClickBoxes.forEach(box => {
    console.log(`  ${box.id}: x=${box.x}, y=${box.y}, w=${box.width}, h=${box.height}`);
});

// Try to identify the 3 questions by grouping click boxes
// Question 1: "given" boxes
// Question 2: numbered boxes (Click_Box_XX)
// Question 3: more boxes

const question1 = slideClickBoxes.filter(b => b.id.toLowerCase().includes('given'));
const question2 = slideClickBoxes.filter(b => b.id.match(/Click_Box_3\d/) || b.id.match(/Click_Box_4[0-4]/));
const question3 = slideClickBoxes.filter(b => !question1.includes(b) && !question2.includes(b));

console.log('\n--- Question Grouping ---');
console.log(`Question 1 (given): ${question1.length} boxes`);
console.log(`Question 2: ${question2.length} boxes`);
console.log(`Question 3: ${question3.length} boxes`);

// Create activity structure
const activityData = {
    questions: [
        {
            id: 'question1',
            prompt: 'Click on the given',
            clickBoxes: question1,
            correctAnswers: question1.map(b => b.id) // All are correct for demo
        },
        {
            id: 'question2',
            prompt: 'Identify the elements',
            clickBoxes: question2,
            correctAnswers: [] // Will need to determine from CPM.js actions
        },
        {
            id: 'question3',
            prompt: 'Click the correct answer',
            clickBoxes: question3,
            correctAnswers: []
        }
    ]
};

// Update slide data
if (!slide.interactions) {
    slide.interactions = {};
}

slide.interactions.clickActivity = activityData;

// Write updated slide data
fs.writeFileSync(slideDataPath, JSON.stringify(slideData, null, 2));

console.log(`\n✅ Updated Slide37646 with click activity data`);
console.log(`Total boxes: ${slideClickBoxes.length}`);
console.log(`Activity structure saved to slide-data.json`);
