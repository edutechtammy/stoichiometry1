const fs = require('fs');
const path = require('path');

// Read CPM.js
const cpmPath = path.join(__dirname, '../Captivate Publish/assets/js/CPM.js');
const cpmContent = fs.readFileSync(cpmPath, 'utf8');

// Read slide-data.json
const slideDataPath = path.join(__dirname, '../src/data/slide-data.json');
const slideData = JSON.parse(fs.readFileSync(slideDataPath, 'utf8'));

// Function to extract a specific object from CPM.js
function extractObject(content, objectName) {
    const regex = new RegExp(`${objectName}:\\{([^}]+(?:\\{[^}]+\\}[^}]*)*)}`, 'g');
    const match = regex.exec(content);

    if (!match) {
        console.log(`No match found for ${objectName}`);
        return null;
    }

    // Try to parse the matched content as a JSON-like structure
    const objectStr = '{' + match[1] + '}';
    console.log(`\nFound ${objectName}:`);
    console.log(objectStr.substring(0, 500) + '...');

    // Extract specific properties manually
    const result = {};

    // Extract p0 (path data)
    const p0Match = objectStr.match(/p0:\[\[([^\]]+(?:\],\[[^\]]+)*)\]\]/);
    if (p0Match) {
        try {
            result.pathData = JSON.parse('[[' + p0Match[1] + ']]');
            console.log('\nPath data (p0):', result.pathData);
        } catch (e) {
            console.log('Error parsing path data:', e.message);
        }
    }

    // Extract gf (gradient fill)
    const gfMatch = objectStr.match(/gf:\{([^}]+)\}/);
    if (gfMatch) {
        console.log('\nGradient fill (gf):', gfMatch[0]);
        // Parse gradient properties
        const x1Match = gfMatch[1].match(/x1:(\d+\.?\d*)/);
        const y1Match = gfMatch[1].match(/y1:(\d+\.?\d*)/);
        const x2Match = gfMatch[1].match(/x2:(\d+\.?\d*)/);
        const y2Match = gfMatch[1].match(/y2:(\d+\.?\d*)/);
        const csMatch = gfMatch[1].match(/cs:\[([^\]]+)\]/);

        result.gradient = {
            x1: x1Match ? parseFloat(x1Match[1]) : 0,
            y1: y1Match ? parseFloat(y1Match[1]) : 0,
            x2: x2Match ? parseFloat(x2Match[1]) : 0,
            y2: y2Match ? parseFloat(y2Match[1]) : 0
        };

        if (csMatch) {
            // Parse color stops
            const colorStops = [];
            const stopRegex = /\{p:(\d+),c:'([^']+)',o:(\d+)\}/g;
            let stopMatch;
            while ((stopMatch = stopRegex.exec(csMatch[1])) !== null) {
                colorStops.push({
                    position: parseInt(stopMatch[1]),
                    color: stopMatch[2],
                    opacity: parseInt(stopMatch[3]) / 255
                });
            }
            result.gradient.colorStops = colorStops;
            console.log('Color stops:', colorStops);
        }
    }

    // Extract stroke color (sc)
    const scMatch = objectStr.match(/sc:'([^']+)'/);
    if (scMatch) {
        result.strokeColor = scMatch[1];
        console.log('\nStroke color (sc):', result.strokeColor);
    }

    // Extract stroke width (sw)
    const swMatch = objectStr.match(/sw:(\d+)/);
    if (swMatch) {
        result.strokeWidth = parseInt(swMatch[1]);
        console.log('Stroke width (sw):', result.strokeWidth);
    }

    // Extract fill alpha (fa)
    const faMatch = objectStr.match(/fa:(\d+)/);
    if (faMatch) {
        result.fillAlpha = parseInt(faMatch[1]) / 100;
        console.log('Fill alpha (fa):', result.fillAlpha);
    }

    return result;
}

// Test with SmartShape_555c
console.log('=== Extracting SmartShape_555c vector data ===');
const shape555 = extractObject(cpmContent, 'SmartShape_555c');

console.log('\n=== Final extracted data ===');
console.log(JSON.stringify(shape555, null, 2));
