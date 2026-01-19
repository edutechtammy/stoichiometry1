# Data Extraction from Captivate

## Overview

This document explains how Captivate lesson data was extracted and transformed into a React-friendly JSON format for use in the rebuilt HTML application.

## Extraction Process

### Source File
- **Input**: `Captivate Publish/project.txt`
- **Format**: JSON file containing complete lesson structure
- **Size**: ~2KB (compressed), contains metadata for 25 slides

### Extraction Script
- **Location**: `scripts/extractCaptivateData.js`
- **Runtime**: Node.js
- **Output**: `src/data/slide-data.json` (~115KB)

### What Was Extracted

#### 1. Metadata
```json
{
  "title": "VHSG Chemistry Template",
  "author": "Tammy Moore",
  "totalSlides": 25,
  "duration": 857,
  "dimensions": { "width": 880, "height": 660 }
}
```

#### 2. Slide Data (25 slides)
Each slide contains:
- **Basic Info**: id, title, type, duration
- **Content Elements**: text captions, images, shapes, buttons
- **Interactions**: drag-drop, click boxes, navigation
- **Media**: thumbnail path, audio reference (if exists)

Slide types detected:
- `content` - Standard instructional slides
- `drag-drop` - Interactive drag-and-drop activities
- `click-activity` - Click-to-reveal activities
- `walkthrough` - Step-by-step demonstrations
- `glossary` - Glossary widget slide

#### 3. Navigation Tree
Hierarchical structure from Table of Contents:
- **Lesson Mode** (11 slides)
- **Try It Mode** (11 slides)
- **Supporting Slides** (3 slides)

#### 4. Asset Manifest
Lists all referenced assets:
- **Images**: 48 PNG files in `dr/` folder
- **Thumbnails**: 25 thumbnail images
- **Audio**: 0 audio files detected (may need manual verification)

## Data Structure

### Slide Object Example
## Valid Slide IDs and TOC Titles for Timing Extraction

Below is a list of all valid slide IDs and their corresponding TOC titles. Use this list to ensure batch timing extraction only processes existing slides:

| Slide ID     | TOC Title                        |
|-------------|----------------------------------|
| Slide3917   | Stoichiometry, Part 1            |
| Slide28137  | Pre-requisite Skills             |
| Slide33700  | Givens and Finds                 |
| Slide33951  | Getting Organized                |
| Slide37499  | Activity 1                       |
| Slide31383  | grams to moles, moles to grams   |
| Slide39911  | grams to moles walkthrough       |
| Slide31809  | Moles to Moles                   |
| Slide40210  | moles to moles walkthrough       |
| Slide37646  | Activity 2                       |
| Slide33288  | Summary                          |
| Slide18443  | grams to moles                   |
| Slide22696  | moles to grams                   |
| Slide4755   | moles to moles                   |
| Slide23949  | moles to moles                   |
| Slide7173   | moles to moles                   |
| Slide8701   | moles to moles                   |
| Slide8887   | moles to moles                   |
| Slide9077   | liters to iIters                 |
| Slide9249   | grams to grams                   |
| Slide9421   | grams to grams                   |
| Slide9593   | grams to grams                   |
| Slide40393  | Periodic Table                   |
| Slide39593  | Summary                          |
| Slide41450  | Glossary                         |

Refer to this table before running batch timing extraction scripts to avoid processing non-existent slides.
```json
{
  "id": "Slide3917",
  "title": "Stoichiometry, Part 1",
  "type": "content",
  "duration": 1620,
  "durationInSeconds": 54,
  "thumbnail": "dr/Slide3917_thnail.jpg",
  "navId": "Slide3917",
  "content": {
    "textCaptions": [...],
    "images": [...],
    "shapes": [...],
    "buttons": [...],
    "clickBoxes": [...]
  },
  "interactions": {
    "dragDrop": null,
    "hasClickActivity": false,
    "hasButtons": true
  },
  "audio": null
}
```

### Content Elements

#### Text Captions
```json
{
  "id": "Text_Caption_51",
  "title": "Stoichiometry ",
  "roles": { "textData": {} }
}
```

#### Images
```json
{
  "id": "Image_166",
  "instance": "Image_166"
}
```
**Location**: `public/assets/dr/Image_166.png`

#### Shapes/Buttons
```json
{
  "id": "SmartShape_555",
  "title": " ",
  "roles": { "click": { "subtype": "button" } },
  "isButton": true
}
```

#### Drag-Drop (Activity 1)
```json
{
  "dragDrop": {
    "sources": [38347, 38352, 38357, 38362, 38367, 38373],
    "targets": [38482, 38463, 38444, 38425, 38406, 38374]
  }
}
```

## Using the Data in React

### 1. Import the Data
```javascript
import lessonData from './data/slide-data.json';
```

### 2. Access Metadata
```javascript
const { title, author, totalSlides } = lessonData.metadata;
```

### 3. Iterate Through Slides
```javascript
lessonData.slides.map(slide => {
  console.log(slide.title, slide.type);
});
```

### 4. Build Navigation
```javascript
const nav = lessonData.navigation.map(section => ({
  title: section.title,
  slides: section.slides
}));
```

### 5. Preload Assets
```javascript
const allImages = lessonData.assets.images;
const allAudio = lessonData.assets.audio;
```

## Asset Organization

### Current Structure
```
Captivate Publish/
  ├── dr/           # Image assets (PNG)
  ├── ar/           # Audio assets (MP3)
  └── project.txt   # Source data
```

### Required for React App
```
public/
  └── assets/
      ├── dr/       # Copy from Captivate Publish
      └── ar/       # Copy from Captivate Publish
```

### Copy Command
```bash
# From project root
cp -r "Captivate Publish/dr" rebuild-to-html/public/assets/
cp -r "Captivate Publish/ar" rebuild-to-html/public/assets/
```

## Known Issues & Next Steps

### ⚠️ Issues
1. **Positioning Data Missing**: Element positions (x, y coordinates) not in project.txt
   - **Impact**: Elements cannot be positioned accurately on slides
   - **Workaround**: Use thumbnails as base, overlay interactive elements
   - **Long-term**: Parse CPM.js or reverse-engineer from published HTML

2. **Audio Files Not Detected**: 0 audio files found
   - **Impact**: No narration/sound effects
   - **Check**: Verify if audio exists in `ar/` folder
   - **Action**: Update extraction script if audio naming differs

3. **Widget Data Limited**: Glossary widget (Slide41450) has minimal data
   - **Impact**: Widget may not render correctly
   - **Action**: May need to extract from widget HTML directly

### ✅ Next Steps
1. **Copy Assets**: Move `dr/` and `ar/` folders to `public/assets/`
2. **Position Elements**: Add CSS positioning logic to SlideArea component
3. **Implement Interactions**: Build drag-drop and click handlers
4. **Audio Integration**: Add audio playback when files are located
5. **Test Each Slide Type**: Verify rendering for all 5 slide types

## Maintenance

### Re-running Extraction
If Captivate project is updated:
```bash
cd rebuild-to-html
node scripts/extractCaptivateData.js
```

### Validation
Check extraction output:
- **Slide count**: Should match `metadata.totalSlides` (25)
- **Assets**: Verify image/audio counts
- **File size**: ~115KB is expected for 25 slides

## Summary Statistics

| Metric | Value |
|--------|-------|
| **Total Slides** | 25 |
| **Lesson Duration** | 14 minutes 17 seconds |
| **Image Assets** | 48 |
| **Thumbnails** | 25 |
| **Audio Files** | 0 (needs verification) |
| **Interactive Slides** | 2 (drag-drop + click activity) |
| **Walkthrough Slides** | 6 |
| **Dimensions** | 880×660 pixels |
| **Output Size** | 114.49 KB |

## References
- **Source Project**: `Captivate Publish/project.txt`
- **Output Data**: `src/data/slide-data.json`
- **Extraction Script**: `scripts/extractCaptivateData.js`
- **Component Templates**: `src/components/`
- **Documentation**: `ReactComponentTemplates.md`, `GettingStartedWithComponents.md`
