/**
 * Captivate Data Extraction Script
 * 
 * Parses project.txt and transforms it into React-friendly JSON structure
 * Output: slide-data.json with all lesson content
 */

const fs = require('fs');
const path = require('path');

// File paths
const PROJECT_FILE = path.join(__dirname, '../Captivate Publish/project.txt');
const OUTPUT_FILE = path.join(__dirname, '../src/data/slide-data.json');
const ASSETS_DIR = path.join(__dirname, '../Captivate Publish');

/**
 * Read and parse the project.txt file
 */
function loadProjectData() {
    try {
        const rawData = fs.readFileSync(PROJECT_FILE, 'utf-8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error('Error loading project.txt:', error.message);
        process.exit(1);
    }
}

/**
 * Extract slide objects from contentStructure
 */
function extractSlides(contentStructure) {
    return contentStructure.filter(item =>
        item.class === 'Normal Slide' && item.roles && item.roles.slide
    );
}

/**
 * Build element lookup map for quick access to child elements
 */
function buildElementMap(contentStructure) {
    const map = {};
    contentStructure.forEach(item => {
        map[item.id] = item;
    });
    return map;
}

/**
 * Process slide children to extract text, images, and interactive elements
 */
function processSlideElements(slide, elementMap) {
    const elements = {
        textCaptions: [],
        images: [],
        shapes: [],
        buttons: [],
        lines: [],
        highlightBoxes: [],
        clickBoxes: []
    };

    if (!slide.children) return elements;

    slide.children.forEach(childId => {
        const element = elementMap[childId];
        if (!element) return;

        // Categorize elements by ID prefix
        if (element.id.startsWith('Text_Caption_')) {
            elements.textCaptions.push({
                id: element.id,
                title: element.title || '',
                roles: element.roles
            });
        } else if (element.id.startsWith('Image_')) {
            elements.images.push({
                id: element.id,
                instance: element.instance || element.id
            });
        } else if (element.id.startsWith('SmartShape_')) {
            elements.shapes.push({
                id: element.id,
                title: element.title || '',
                roles: element.roles,
                isButton: element.roles?.click?.subtype === 'button'
            });
        } else if (element.id.startsWith('Button_')) {
            elements.buttons.push({
                id: element.id,
                instance: element.instance || element.id
            });
        } else if (element.id.startsWith('Line_')) {
            elements.lines.push({
                id: element.id,
                instance: element.instance || element.id
            });
        } else if (element.id.startsWith('Highlight_Box_')) {
            elements.highlightBoxes.push({
                id: element.id,
                instance: element.instance || element.id
            });
        } else if (element.id.startsWith('Click_Box') || element.id.startsWith('Clickbox_')) {
            elements.clickBoxes.push({
                id: element.id,
                instance: element.instance || element.id,
                roles: element.roles
            });
        }
    });

    return elements;
}

/**
 * Determine slide type based on content
 */
function determineSlideType(slide, elements) {
    // Check for drag-drop activity
    if (slide.roles?.dragDrop) {
        return 'drag-drop';
    }

    // Check for click-box activity
    if (elements.clickBoxes.length > 3) {
        return 'click-activity';
    }

    // Check for glossary widget
    if (slide.id === 'Slide41450') {
        return 'glossary';
    }

    // Check if it's a walkthrough (many shapes and highlight boxes)
    if (elements.highlightBoxes.length > 5) {
        return 'walkthrough';
    }

    // Default to content slide
    return 'content';
}

/**
 * Extract audio file reference for slide
 */
function getAudioFile(slideId) {
    // Captivate audio files are typically in ar/ folder
    // Format: ar/slideXXXXX.mp3 or similar
    const audioPath = `ar/${slideId}.mp3`;
    const fullPath = path.join(ASSETS_DIR, audioPath);

    // Check if file exists
    if (fs.existsSync(fullPath)) {
        return audioPath;
    }

    return null;
}

/**
 * Transform slide data into React-friendly format
 */
function transformSlideData(slide, elementMap, metadata) {
    const elements = processSlideElements(slide, elementMap);
    const slideType = determineSlideType(slide, elements);

    return {
        id: slide.id,
        title: slide.instance || 'Untitled Slide',
        type: slideType,
        duration: slide.roles?.slide?.durationInFrames || 0,
        durationInSeconds: Math.round((slide.roles?.slide?.durationInFrames || 0) / metadata.frameRate),
        thumbnail: slide.thumbnail || '',

        // Navigation
        navId: slide.roles?.navigation?.navid || slide.id,

        // Content elements
        content: {
            textCaptions: elements.textCaptions,
            images: elements.images,
            shapes: elements.shapes,
            buttons: elements.buttons,
            lines: elements.lines,
            highlightBoxes: elements.highlightBoxes,
            clickBoxes: elements.clickBoxes
        },

        // Interactive elements
        interactions: {
            dragDrop: slide.roles?.dragDrop || null,
            hasClickActivity: elements.clickBoxes.length > 0,
            hasButtons: elements.buttons.length > 0
        },

        // Media
        audio: getAudioFile(slide.id),

        // Raw data for advanced usage
        raw: {
            children: slide.children || [],
            roles: slide.roles || {}
        }
    };
}

/**
 * Build navigation tree from TOC
 */
function buildNavigationTree(toc, slides) {
    return toc.map(item => {
        // If item has children, it's a section
        if (item.children) {
            return {
                type: 'section',
                title: item.title,
                slides: item.children.map(childId => {
                    const slide = slides.find(s => s.id === childId);
                    return slide ? {
                        id: slide.id,
                        title: slide.title,
                        navId: slide.navId
                    } : null;
                }).filter(Boolean)
            };
        }

        // Individual slide
        const slide = slides.find(s => s.id === item.id);
        return slide ? {
            type: 'slide',
            id: slide.id,
            title: slide.title,
            navId: slide.navId
        } : null;
    }).filter(Boolean);
}

/**
 * Extract all asset references
 */
function extractAssetManifest(slides) {
    const assets = {
        images: new Set(),
        audio: new Set(),
        thumbnails: new Set()
    };

    slides.forEach(slide => {
        // Images
        slide.content.images.forEach(img => {
            assets.images.add(`dr/${img.id}.png`);
        });

        // Thumbnails
        if (slide.thumbnail) {
            assets.thumbnails.add(slide.thumbnail);
        }

        // Audio
        if (slide.audio) {
            assets.audio.add(slide.audio);
        }
    });

    return {
        images: Array.from(assets.images),
        audio: Array.from(assets.audio),
        thumbnails: Array.from(assets.thumbnails)
    };
}

/**
 * Main extraction function
 */
function main() {
    console.log('🚀 Starting Captivate data extraction...\n');

    // Load project data
    console.log('📖 Loading project.txt...');
    const projectData = loadProjectData();

    // Extract metadata
    const metadata = projectData.metadata;
    console.log(`✓ Project: ${metadata.title}`);
    console.log(`✓ Version: ${metadata.generator} ${metadata.generatorVersion}`);
    console.log(`✓ Slides: ${metadata.totalSlides}`);
    console.log(`✓ Duration: ${Math.round(metadata.durationInFrames / metadata.frameRate)} seconds\n`);

    // Build element map
    console.log('🔨 Building element map...');
    const elementMap = buildElementMap(projectData.contentStructure);
    console.log(`✓ ${Object.keys(elementMap).length} elements indexed\n`);

    // Extract slides
    console.log('📄 Extracting slides...');
    const rawSlides = extractSlides(projectData.contentStructure);
    console.log(`✓ Found ${rawSlides.length} slides\n`);

    // Transform slide data
    console.log('⚙️  Transforming slide data...');
    const slides = rawSlides.map(slide => transformSlideData(slide, elementMap, metadata));
    console.log(`✓ Transformed ${slides.length} slides\n`);

    // Build navigation tree
    console.log('🗺️  Building navigation tree...');
    const navigation = buildNavigationTree(projectData.toc, slides);
    console.log(`✓ Navigation tree created\n`);

    // Extract asset manifest
    console.log('🖼️  Extracting asset manifest...');
    const assets = extractAssetManifest(slides);
    console.log(`✓ Images: ${assets.images.length}`);
    console.log(`✓ Audio: ${assets.audio.length}`);
    console.log(`✓ Thumbnails: ${assets.thumbnails.length}\n`);

    // Build final output
    const output = {
        metadata: {
            title: metadata.title,
            description: metadata.description || '',
            author: metadata.author || '',
            version: metadata.generatorVersion,
            totalSlides: metadata.totalSlides,
            duration: Math.round(metadata.durationInFrames / metadata.frameRate),
            dimensions: {
                width: metadata.width,
                height: metadata.height
            },
            generated: new Date().toISOString(),
            source: 'Captivate ' + metadata.generatorVersion
        },

        slides: slides,
        navigation: navigation,
        assets: assets,

        // Settings from original
        settings: {
            toc: projectData.contentSettings?.toc || {},
            playbar: projectData.contentSettings?.playbar || {},
            quiz: projectData.contentStructure.find(item => item.roles?.quiz)?.roles?.quiz || null
        }
    };

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        console.log('📁 Creating output directory...');
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write output file
    console.log('💾 Writing slide-data.json...');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`✓ Saved to: ${OUTPUT_FILE}\n`);

    // Summary
    console.log('✅ Extraction complete!\n');
    console.log('📊 Summary:');
    console.log(`   - ${slides.length} slides processed`);
    console.log(`   - ${navigation.length} navigation items`);
    console.log(`   - ${assets.images.length + assets.audio.length} assets referenced`);
    console.log(`   - Output: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB\n`);

    // Next steps
    console.log('🎯 Next steps:');
    console.log('   1. Review slide-data.json in src/data/');
    console.log('   2. Import into React components');
    console.log('   3. Copy Captivate Publish/dr/ and ar/ folders to public/assets/\n');
}

// Run extraction
main();
