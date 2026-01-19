# Captivate Data Extraction - Project Structure Analysis

## Overview
Successfully located structured data in `project.txt` containing complete lesson information in JSON format.

## Project Metadata
- **Title:** Stoichiometry
- **Total Slides:** 25
- **Duration:** 25,722 frames at 30 fps (approx. 14 minutes)
- **Dimensions:** 880 x 660 pixels
- **Author:** Tammy Moore
- **Generator:** Adobe Captivate 8.0.1

## Lesson Structure

### Mode 1: Lesson Mode (11 slides)
1. Stoichiometry, Part 1 (Slide3917) - 1620 frames
2. Pre-requisite Skills (Slide28137) - 840 frames
3. Givens and Finds (Slide33700) - 1527 frames
4. Getting Organized (Slide33951) - 3207 frames
5. **Activity 1** (Slide37499) - 90 frames - **DRAG AND DROP**
6. grams to moles, moles to grams (Slide31383) - 1911 frames
7. grams to moles walkthrough (Slide39911) - 5256 frames
8. Moles to Moles (Slide31809) - 4269 frames
9. moles to moles walkthrough (Slide40210) - 4323 frames
10. **Activity 2** (Slide37646) - 540 frames - **INTERACTIVE CLICK BOXES**
11. Summary (Slide33288) - 375 frames

### Mode 2: Try It Mode (11 slides)
12. grams to moles (Slide18443) - 138 frames
13. moles to grams (Slide22696) - 135 frames
14. moles to moles (Slide4755) - 135 frames
15. moles to moles (Slide23949) - 138 frames
16. moles to moles (Slide7173) - 135 frames
17. moles to moles (Slide8701) - 135 frames
18. moles to moles (Slide8887) - 135 frames
19. liters to liters (Slide9077) - 135 frames
20. grams to grams (Slide9249) - 135 frames
21. grams to grams (Slide9421) - 135 frames
22. grams to grams (Slide9593) - 138 frames

### Additional Slides
23. Periodic Table (Slide40393) - 90 frames
24. Summary (Slide39593) - 90 frames
25. **Glossary** (Slide41450) - 90 frames - **WIDGET/INTERACTIVE**

## Interactive Elements Identified

### Drag and Drop Activities
- **Activity 1 (Slide37499):** 6 sources, 6 targets
  - Organizing stoichiometry problem-solving sections

### Click-based Activities
- **Activity 2 (Slide37646):** Multiple click boxes for identifying "given," "find," and "same/different"

### Media Assets
- **Audio files:** Located in `ar/` folder (e.g., `ar/41356.mp3`)
- **Images:** Located in `dr/` folder (PNG files for text captions, shapes, diagrams)
- **Chemical formulas:** Images for NaNO3, NaNO2, C2H2, etc.

## Data Extraction Strategy

### For React Components

1. **Slide Data:**
   - Parse `project.txt` JSON for slide metadata
   - Extract title, duration, navigation info
   - Map children elements (text, images, interactions)

2. **Audio Synchronization:**
   - Each slide has audio with start/end frames
   - Extract timing data for synchronized playback

3. **Interactive Elements:**
   - Drag-drop: Map source/target relationships
   - Click boxes: Extract position and action handlers
   - Buttons: Extract navigation commands

4. **Asset Manifest:**
   - Images: All in `dr/` folder with predictable naming
   - Audio: All in `ar/` folder
   - Create asset list for preloading

5. **TOC Structure:**
   - Hierarchical structure already defined
   - Map to React navigation state

## Next Steps

1. **Parse project.txt** into usable data structure
2. **Create data extraction script** to generate JSON for React
3. **Map slide elements** to React component props
4. **Extract asset references** for AssetLoader component
5. **Build slide renderer** that consumes extracted data

## Key Files for Extraction
- `project.txt` - Primary data source (JSON)
- `dr/` folder - All visual assets
- `ar/` folder - All audio files
- `CPM.js` - Runtime behavior (if needed)
