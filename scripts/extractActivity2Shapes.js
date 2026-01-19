const fs = require('fs');
const cpm = fs.readFileSync('../Captivate Publish/assets/js/CPM.js', 'utf8');

const shapes = [
    'SmartShape_481', 'SmartShape_490', 'SmartShape_491', 'SmartShape_492',
    'SmartShape_493', 'SmartShape_494', 'SmartShape_495', 'SmartShape_496',
    'SmartShape_497', 'SmartShape_498', 'SmartShape_499', 'SmartShape_501',
    'SmartShape_502', 'SmartShape_503', 'SmartShape_504', 'SmartShape_513'
];

shapes.forEach(id => {
    const regex = new RegExp(id + 'c:\\{b:\\[([0-9,]+)\\][^}]*ip:\'([^\']+)\'');
    const match = cpm.match(regex);

    if (match) {
        const bounds = match[1].split(',').map(Number);
        const x = bounds[0];
        const y = bounds[1];
        const width = bounds[2] - bounds[0];
        const height = bounds[3] - bounds[1];
        const imagePath = match[2];

        console.log(`${id}: x=${x}, y=${y}, w=${width}, h=${height}, img=${imagePath}`);
    } else {
        console.log(`${id}: NOT FOUND`);
    }
});
