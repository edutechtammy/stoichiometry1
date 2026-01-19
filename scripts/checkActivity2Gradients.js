const fs = require('fs');
const cpm = fs.readFileSync('../Captivate Publish/assets/js/CPM.js', 'utf8');

const shapes = [
    'SmartShape_481', 'SmartShape_490', 'SmartShape_491', 'SmartShape_492',
    'SmartShape_493', 'SmartShape_494', 'SmartShape_495', 'SmartShape_496',
    'SmartShape_497', 'SmartShape_498', 'SmartShape_499', 'SmartShape_501',
    'SmartShape_502', 'SmartShape_503', 'SmartShape_504', 'SmartShape_513'
];

console.log('Checking all SmartShapes for dimensions and gradient fills:\n');

shapes.forEach(id => {
    // Check for bounding box (with or without image)
    const bboxRegex = new RegExp(id + 'c:\\{b:\\[([0-9,]+)\\]');
    const bboxMatch = cpm.match(bboxRegex);

    if (bboxMatch) {
        const bounds = bboxMatch[1].split(',').map(Number);
        const x = bounds[0];
        const y = bounds[1];
        const width = bounds[2] - bounds[0];
        const height = bounds[3] - bounds[1];

        // Check for image path
        const imgRegex = new RegExp(id + 'c:\\{[^}]*ip:\'([^\']+)\'');
        const imgMatch = cpm.match(imgRegex);

        // Check for gradient fill
        const gradRegex = new RegExp(id + 'c:\\{[^}]*gf:\\{[^}]*cs:\\[([^\\]]+)\\]');
        const gradMatch = cpm.match(gradRegex);

        let info = `${id}: x=${x}, y=${y}, w=${width}, h=${height}`;

        if (imgMatch) {
            info += ` | IMG: ${imgMatch[1]}`;
        } else {
            info += ' | NO IMAGE';
        }

        if (gradMatch) {
            info += ` | GRADIENT: ${gradMatch[1].substring(0, 100)}...`;
        }

        console.log(info);
    }
});
