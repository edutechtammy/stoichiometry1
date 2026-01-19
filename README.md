# Stoichiometry Lesson - React Rebuild

This project converts an Adobe Captivate 8 chemistry lesson into a modern React web application.

## 🎯 Project Goal

Transform a Flash-based Captivate lesson into an accessible, mobile-friendly React app with reusable components for future Captivate-to-HTML conversions.

## 📁 Project Structure

```
├── Captivate Publish/            # Original Captivate output
│   ├── project.txt               # Source data (JSON)
│   ├── dr/                       # Image assets (PNG)
│   └── ar/                       # Audio assets (MP3)
│
├── rebuild-to-html/
│   ├── rebuild-to-html/          # React application
│   │   ├── src/
│   │   │   ├── data/
│   │   │   │   └── slide-data.json    # Extracted lesson data
│   │   │   ├── components/            # Reusable React components
│   │   │   ├── App.js                 # Main application
│   │   │   └── index.js               # Entry point
│   │   └── public/
│   │       └── assets/                # TO DO: Copy assets here
│   │
│   └── scripts/
│       └── extractCaptivateData.js    # Data extraction script
│
└── Documentation/
    ├── IMPLEMENTATION_SUMMARY.md              # Complete progress report
    ├── CAPTIVATE_TECHNICAL_KNOWLEDGE.md      # Captivate architecture deep dive
    ├── SMARTSHAPE-SVG-IMPLEMENTATION-PLAN.md # SVG rendering roadmap
    ├── SVG-LIBRARY-GUIDE.md                  # Illustrator → React workflow
    ├── DataExtractionREADME.md               # Data extraction details
    ├── ReactComponentTemplates.md            # Component patterns
    ├── GettingStartedWithComponents.md       # React basics
    └── CaptivateDataExtraction.md            # Captivate analysis
```

## 🚀 Quick Start

### 1. Extract Data (Already Done ✓)
```bash
cd rebuild-to-html
node scripts/extractCaptivateData.js
```

**Output**: `src/data/slide-data.json` with 25 slides

### 2. Copy Assets (✓ Completed)
```bash
cd rebuild-to-html

# Copy images (DONE)
cp -r "../Captivate Publish/dr" rebuild-to-html/public/assets/

# Copy audio (DONE)
cp -r "../Captivate Publish/ar" rebuild-to-html/public/assets/
```

### 3. Extract Detailed Data (In Progress)
```bash
# Extract positioning from CPM.js
node scripts/extractPositions.js

# Extract audio mappings
node scripts/extractAudio.js

# Extract timing data for animations
node scripts/extractTiming.js Slide3917  # Example: Slide 1

# Extract SmartShapes (vector graphics)
node scripts/extractSmartShapes.js Slide3917
```

### 4. Run React App
```bash
cd rebuild-to-html/rebuild-to-html
npm install  # First time only
npm start    # Opens http://localhost:3000
```

## 📊 Lesson Content

### Metadata
- **Title**: VHSG Chemistry Template (Stoichiometry, Part 1)
- **Author**: Tammy Moore
- **Duration**: 14 minutes 17 seconds
- **Slides**: 25 total
- **Dimensions**: 880×660 pixels

### Lesson Structure

**Lesson Mode** (11 slides)
- Pre-requisite Skills
- Givens and Finds
- Getting Organized
- Activity 1 (Drag & Drop)
- Grams to Moles / Moles to Grams
- Moles to Moles
- Activity 2 (Click Activity)
- Summary

**Try It Mode** (11 slides)
- Practice problems with walkthroughs
- Grams-to-moles conversions
- Moles-to-moles stoichiometry
- Liters-to-liters calculations
- Grams-to-grams multi-step problems

**Supporting Slides** (3 slides)
- Periodic Table reference
- Final summary
- Glossary widget

### Interactive Elements
- **2 Activities**: Drag-and-drop + Click activity
- **6 Walkthroughs**: Step-by-step problem solving
- **17 Content slides**: Instructional material

## 🛠️ Technology Stack

- **React** 18.x (JavaScript, not TypeScript)
- **Create React App** for scaffolding
- **Node.js** for data extraction script
- **Adobe Captivate** 8.0.1 (source)

## 📦 Components

### Core Components
- **SlideArea**: Displays slide content (text, images, shapes)
- **Playbar**: Navigation controls (next, prev, play, pause)
- **TOC**: Table of contents with hierarchical navigation
- **Captions**: Accessibility captions overlay
- **AssetLoader**: Preloads images and audio
- **Dialog**: Modal dialogs for messages

### Data Structure
Each slide contains:
- Basic info (id, title, type, duration)
- Content elements (textCaptions, images, shapes, buttons)
- Interactions (dragDrop, clickBoxes)
- Media references (thumbnail, audio)

## 🎨 Features

### Implemented ✓
- [x] Data extraction from Captivate project.txt
- [x] Element positioning from CPM.js (421 elements)
- [x] Audio file mapping (10 MP3 files)
- [x] Timing extraction for audio-synced animations
- [x] SmartShape extraction (speech bubbles, callouts)
- [x] Slide navigation (next/prev)
- [x] Play/pause functionality
- [x] Table of contents
- [x] Asset preloading
- [x] Captions toggle
- [x] Responsive design (slide area + audio player)
- [x] Debug mode
- [x] Slide type detection
- [x] Audio playback with timing callbacks
- [x] Fade in/out transitions for timed elements

### In Progress 🔄
- [~] SmartShape SVG rendering (structure works, graphics pending)
  - Text content displays ✓
  - Positioning and timing work ✓
  - Vector graphics rendering (Option B - awaiting credits refresh)

### To Do
- [ ] Complete SmartShape graphics (SVG library approach)
- [ ] Extract timing for remaining 23 slides
- [ ] Interactive activities (drag-drop, clicks)
- [ ] Production deployment
- [ ] Cross-browser testing

## 🐛 Known Issues & Solutions

### 1. SmartShape Graphics Not Displaying ⚠️
**Status**: Root cause identified, solution planned

**Issue**: SmartShapes show text but not visual graphics (speech bubbles, callouts, lines)

**Root Cause**: 
- PNG files in `dr/` folder are empty placeholders (export artifacts)
- Captivate renders graphics dynamically via JavaScript:
  1. Reads vector path data from CPM.js
  2. Renders to canvas/SVG
  3. Converts to PNG
  4. Base64-encodes
  5. Injects as CSS `background-image: url('data:image/png;base64,...')`

**Solution Paths**:
- **Option A (Quick)**: Screenshot visible shapes, replace empty PNGs (~30 min)
- **Option B (Proper)**: Implement SVG rendering from CPM.js vector data (several hours)

**Recommendation**: Option B for long-term reusability across multiple projects

**Deferred Until**: Credits refresh (1-2 weeks) + Illustrator SVG library ready

**Documentation**: 
- Technical details: `CAPTIVATE_TECHNICAL_KNOWLEDGE.md`
- Implementation plan: `SMARTSHAPE-SVG-IMPLEMENTATION-PLAN.md`
- SVG workflow: `SVG-LIBRARY-GUIDE.md`

### 2. Element Positioning ✅ SOLVED
**Status**: Resolved

**Solution**: Parse CPM.js for `b:[left,top,right,bottom]` coordinates
- 629 positioned elements found
- 421 successfully matched to slides
- ~67% coverage (others are dynamic/hidden)

### 3. Audio Files ✅ SOLVED
**Status**: Resolved

**Solution**: 10 MP3 files found in `ar/` folder, mapped to slides via CPM.js `StAd` definitions

## 📖 Documentation

### Core Documentation
- **IMPLEMENTATION_SUMMARY.md**: Complete project status and next steps
- **CAPTIVATE_TECHNICAL_KNOWLEDGE.md**: Deep dive into Captivate architecture
  - Component-based design philosophy
  - File naming conventions
  - Element types and patterns
  - SmartShape vector graphics system
  - Timing and animation system
  - Common pitfalls and solutions

### Implementation Guides
- **SMARTSHAPE-SVG-IMPLEMENTATION-PLAN.md**: Complete 6-phase roadmap for SVG rendering
  - Data extraction enhancement
  - Path command converter
  - Gradient renderer
  - React component structure
  - Testing strategy
  - Timeline: ~4 weeks when credits refresh

- **SVG-LIBRARY-GUIDE.md**: Illustrator → React workflow
  - Non-uniform scaling techniques
  - Illustrator export settings
  - Component template structure
  - Collaboration workflow
  - Priority shapes list

### Data & Components
- **DataExtractionREADME.md**: Data structure and extraction process
- **ReactComponentTemplates.md**: Component patterns for reuse
- **GettingStartedWithComponents.md**: React basics for beginners
- **CaptivateDataExtraction.md**: Captivate lesson analysis

### Extraction Scripts
Located in `scripts/`:
- `extractCaptivateData.js` - Initial project.txt extraction
- `extractPositions.js` - CPM.js positioning data
- `extractAudio.js` - Audio file mapping
- `extractTiming.js` - Animation timing for specific slides
- `extractSmartShapes.js` - SmartShape positioning and timing
- `extractSmartShapeVectors.js` - Vector data extraction (development)

## 🔄 Workflow

### Making Changes
1. Edit Captivate project (if needed)
2. Re-export from Captivate
3. Run extraction script
4. React app automatically updates

### Adding Features
1. Create new component in `src/components/`
2. Add to `ReactComponentTemplates.md` for future reuse
3. Import and use in `App.js`

## 🎓 Learning Path

**New to React?**
1. Read `GettingStartedWithComponents.md`
2. Explore existing components
3. Modify `SlideArea.js` to see changes

**Understanding the Data?**
1. Read `DataExtractionREADME.md`
2. Open `src/data/slide-data.json`
3. Check `CaptivateDataExtraction.md` for context

**Want to Reuse Components?**
1. Read `ReactComponentTemplates.md`
2. Copy component templates
3. Adapt props for your project

## 🏆 Success Criteria

### Minimum Viable Product (MVP) ✅
- ✅ Extract all slides
- ✅ Build React app structure
- ✅ Implement navigation
- ✅ Display content with assets
- ✅ App runs locally
- ✅ Audio playback
- ✅ Timing-based animations

### Current Status: Slide 1 & 9 Complete 🎯
**Fully Implemented Slides:**
- Slide 1 (Slide3917): Introduction with countdown SmartShapes
- Slide 9 (Slide40210): Content slide with timed elements

**Features Working:**
- ✅ Background images
- ✅ Positioned images and text captions
- ✅ Audio playback synchronized with content
- ✅ Timed element appearance/disappearance
- ✅ Fade in/out transitions (0.5s)
- ✅ SmartShape positioning and timing (text visible, graphics pending)

### Next Phase: Complete All 25 Slides
- [ ] Extract timing for remaining 23 slides
- [ ] Implement SmartShape SVG library (Option B)
- [ ] Test all slide types (content, activity, walkthrough)
- [ ] Interactive activities (drag-drop, click boxes)
- [ ] Cross-slide navigation testing

### Full Feature Set
- [ ] Accurate element positioning (67% complete)
- [ ] Interactive activities work
- [ ] SmartShape vector graphics rendering
- [ ] All audio synchronized
- [ ] Mobile responsive optimization
- [ ] Production ready
- [ ] Performance optimization

## 💡 Usage Examples

### Import Lesson Data
```javascript
import lessonData from './data/slide-data.json';

// Access slide
const firstSlide = lessonData.slides[0];

// Get metadata
const { title, duration } = lessonData.metadata;
```

### Render Slide
```javascript
<SlideArea 
  slideData={lessonData.slides[0]}
  isPlaying={true}
/>
```

### Navigate
```javascript
const [slideIndex, setSlideIndex] = useState(0);

<Playbar
  navigationState={{
    current: slideIndex + 1,
    total: lessonData.slides.length,
    canGoBack: slideIndex > 0,
    canGoForward: slideIndex < lessonData.slides.length - 1,
    isPlaying: false
  }}
  onNext={() => setSlideIndex(slideIndex + 1)}
  onPrev={() => setSlideIndex(slideIndex - 1)}
/>
```

## 🤝 Contributing

This project is designed for reuse across multiple Captivate lessons. Component templates in `ReactComponentTemplates.md` can be used for future conversions.

## 📝 License

Educational project for VHSG Chemistry course.

## 🙏 Credits

- **Content**: Tammy Moore
- **Original Format**: Adobe Captivate 8.0.1
- **React Conversion**: GitHub Copilot AI Assistant
- **Framework**: React + Create React App

## 📞 Support

See `IMPLEMENTATION_SUMMARY.md` for troubleshooting and next steps.

---

**Current Status**: MVP Complete ✅ | Slides 1 & 9 Fully Working 🎯 | SVG Library Next Phase 🚀

**Timeline**: 
- Now: Illustrator SVG library design in progress
- 1-2 weeks: Credits refresh + implement SVG rendering system
- Future: Complete all 25 slides + interactive activities
