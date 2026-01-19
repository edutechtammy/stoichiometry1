# Captivate Technical Knowledge Base

## Key Discoveries for Converting Adobe Captivate to HTML/React

## Architecture Philosophy

### Captivate's "React-like" Design (Pre-React Era)

Adobe Captivate's architecture is remarkably forward-thinking, demonstrating a **data-driven, component-based system** years before React popularized these patterns. The framework essentially anticipates modern web development principles.

**Key Design Decisions that Mirror Modern React:**

1. **Separation of Data and Presentation**
   - CPM.js serves as pure data layer (analogous to Redux store or JSON API)
   - Visual assets isolated in `/dr` and `/ar` directories
   - Clean separation between structure definition and rendering logic

2. **Component-Based Architecture**
   - Every element typed via consistent system (`type: 13`, `type: 15`, etc.)
   - Reusable element patterns: `{n:'elementName', t:typeNumber}`
   - Properties like `b:`, `uid:`, `visible:` function as component props

3. **Declarative Structure**
   - Slides declare element composition via `si:[]` arrays
   - Elements declare their properties (position, visibility, interactions)
   - Declarative "this element exists with these properties" vs imperative "draw this at x,y"

4. **Consistent Naming Conventions**
   - Predictable 'c' suffix pattern for positioned elements
   - Systematic ID formats (`Click_Box_35`, `Text_Caption_51`)
   - Enables programmatic extraction and manipulation

5. **Centralized State Management**
   - Frame ranges manage slide transitions and audio timing
   - Visibility flags and interaction states
   - All state centralized in CPM.js data structure

6. **Smart Encoding Strategies**
   - Image dimensions in filenames = free metadata lookup (no parsing required)
   - UIDs for cross-references = eliminates string parsing overhead
   - Bounding boxes as arrays = compact, parsable format

**Result:** Captivate built a **JSON-first, component-driven rendering engine** in the Flash/early HTML5 era. Converting to React feels natural because the mental models align perfectly—patterns translate almost 1:1 between systems.

### File Naming Conventions

#### Image Files Encode Dimensions
**Discovery:** Captivate exports images with filenames that encode their width and height dimensions.

**Pattern:** `{uid}_{width}_{height}.png`

**Examples:**
- `41278_206_161.png` = UID 41278, width 206px, height 161px
- `41284_202_166.png` = UID 41284, width 202px, height 166px
- `32423_282_238.png` = UID 32423, width 282px, height 238px

**Application:** While dimensions are useful, the actual position data must be extracted from CPM.js because filenames don't include x/y coordinates.

#### Named Elements
Non-numeric elements use descriptive names:
- `Text_Caption_51.png`
- `SmartShape_555.png`
- `Image_166.png`

### CPM.js Structure

#### Element ID Suffix Pattern
**Discovery:** CPM.js uses element IDs with a 'c' suffix for positioned elements.

**Example:**
- Slide data references: `Text_Caption_51`
- CPM.js references: `Text_Caption_51c`

**Solution:** When matching elements, strip the 'c' suffix:
```javascript
const elementId = elementIdWithC.endsWith('c') ? elementIdWithC.slice(0, -1) : elementIdWithC;
```

#### Position Data Format
Elements in CPM.js contain bounding box coordinates:

```javascript
Text_Caption_51c:{
  b:[224, 39, 657, 132],  // [left, top, right, bottom]
  ip:'dr/Text_Caption_51.png',
  // ... other properties
}
```

**Extraction Pattern:**
```javascript
const pattern = /(\w+):\{[^}]*?ip:'dr\/([^']+)'[^}]*?b:\[(\d+),(\d+),(\d+),(\d+)\]/g;
```

**Calculate dimensions:**
- width = right - left
- height = bottom - top

### Asset Organization

#### Directory Structure
```
Captivate Publish/
  dr/          - Display resources (images, 631 files)
  ar/          - Audio resources (10 MP3 files)
  assets/
    js/
      CPM.js   - Main data file with all positioning
```

#### Audio File Naming
**Discovery:** Audio files use simple numeric UIDs without encoded metadata.

**Format:**
- Simple numeric ID: `38968.mp3`, `41356.mp3`
- Special files: `dblmouse.mp3` (UI sound effect)
- File sizes: 3.4KB to 2.0MB (reflect actual audio duration)

**Mapping to Slides:**
Audio files are mapped to slides via `StAd` (Slide Audio) definitions in CPM.js:

```javascript
StAd0:{from:1,to:1444,src:'ar/41356.mp3',du:48153}
```

Properties:
- `from`: Start frame
- `to`: End frame
- `src`: Audio file path
- `du`: Duration in milliseconds

Use `extractAudio.js` script to map audio to slides by matching frame ranges.

### Slide Dimensions

**Standard Captivate project dimensions:** 880px × 660px

All element positioning is relative to this container size.

### Element Types in CPM.js

#### Common Element Types (by type number):
- `type: 13` - Click Boxes (interactive clickable areas)
- `type: 14` - Highlight Boxes (visual feedback areas)
- `type: 15` - Images
- `type: 19` - Text Captions
- `type: 177` - Buttons
- `type: 612` - Shapes/SmartShapes

#### Click Box Structure
**Discovery:** Click boxes follow the same positioning pattern as images, with the 'c' suffix in CPM.js.

**Pattern:** `{elementName}c:{b:[left,top,right,bottom],uid:XXXXX,...}`

**Example:**
```javascript
Click_Box_35c:{
  b:[706,354,761,387],    // [left, top, right, bottom]
  uid:37715,              // Unique identifier
  sr:cp.fd,
  dn:'Click_Box_35',      // Display name (without 'c')
  visible:1,
  accstr:'Click Box ',    // Accessibility string
  vb:[706,354,761,387]    // Visual bounds
}
```

**Click Box Naming:**
- Pattern 1: `Clickbox_given_1` (descriptive names)
- Pattern 2: `Click_Box_35` (numeric IDs - numbers may indicate question/answer grouping)
- Stored with 'c' suffix in CPM.js: `Click_Box_35c`
- Referenced without 'c' in slide si arrays: `Click_Box_35`

**Extraction Pattern:**
```javascript
const clickBoxPattern = /(Clickbox_[^:]+|Click_Box_\d+)c:\{b:\[(\d+),(\d+),(\d+),(\d+)\],uid:(\d+)/g;
```

**Properties:**
- `b:` Bounding box coordinates [left, top, right, bottom]
- `uid:` Unique ID for the element
- `dn:` Display name (without the 'c' suffix)
- `visible:` Visibility flag (1=visible, 0=hidden)
- `vb:` Visual bounds (usually matches b:)
- `accstr:` Accessibility label for screen readers

**Click Box Numbers:**
While image filenames encode dimensions, click box numbers in the name (e.g., Click_Box_35) appear to be sequential identifiers or grouping indicators rather than encoding position data. The actual position must be extracted from CPM.js using the 'c' suffix pattern, just like other positioned elements.

### Data Extraction Best Practices

#### 1. Position Extraction
- Parse CPM.js for all elements with `ip:'dr/...'` and `b:[...]` patterns
- Store mapping of elementId → {x, y, width, height, imagePath}
- Match to slide data elements using IDs (after removing 'c' suffix)

#### 2. Handling Missing Data
Some elements may not have position data:
```javascript
if (!element.position || !element.imagePath) return null;
```

#### 3. Asset Path Resolution
CPM.js paths: `dr/filename.png`
React public folder: `assets/dr/filename.png`
Component usage: `/assets/dr/filename.png`

### Successful Extraction Results

From this project:
- **Total positioned elements:** 629 found in CPM.js
- **Successfully matched:** 421 elements to slide data
- **Coverage:** ~67% of elements positioned (others may be dynamic/hidden)

### Interactive Elements

#### Drag-and-Drop Activities
Located in slide data:
```javascript
{
  type: 'drag-drop',
  interactions: {
    dragDrop: {
      sources: [...],
      targets: [...]
    }
  }
}
```

#### Click Activities (Click Box Interactions)
**Discovery:** Click boxes encode their positions using the same 'c' suffix pattern as other elements.

**Slide Structure:**
```javascript
Slide37646: {
  lb: 'Activity 2',
  id: 37646,
  from: 23044,
  to: 23583,
  si: [
    {n: 'Clickbox_given_1', t: 13},  // type: 13 = click box
    {n: 'Click_Box_35', t: 13},
    {n: 'Highlight_Box_14', t: 14},  // type: 14 = highlight box
    // ...more elements
  ]
}
```

**Extraction Process:**
1. Find click boxes in slide's `si` array (type: 13)
2. Extract positioning from CPM.js using 'c' suffix pattern
3. Group by question (often indicated by associated highlight boxes)
4. Map correct answers (typically in element actions or properties)

**Example Extraction:**
```javascript
// From Slide37646 - Activity 2
Clickbox_given_1: x=387, y=350, w=140, h=45
Click_Box_35: x=706, y=354, w=55, h=33
Click_Box_44: x=58, y=385, w=57, h=28
// ...9 total click boxes
```

**Visual Feedback Elements:**
- Highlight boxes (type: 14) typically show correct/incorrect feedback
- Often positioned to overlap with or near click boxes
- May animate on interaction

### Slide Background Images

#### Background Image Pattern
**Discovery:** Captivate stores slide background images separately from overlay images (si elements).

**CPM.js Structure:**
```javascript
Slide40210c:{
  b:[0,0,880,660],              // Full slide dimensions
  sr:cp.fd,
  ip:'dr/4016.png',             // Background image path
  dn:'Slide40210',              // Display name
  visible:'1'
}
```

**Key Properties:**
- `b:` Always `[0,0,880,660]` for backgrounds (full slide coverage)
- `ip:` Background image path (typically reused across multiple slides)
- Located in `Slidec:{...}` definition (with lowercase 'c'), not in `si` array
- No `uid` property (backgrounds aren't interactive elements)

**Background vs Overlay Images:**

| Feature | Background Images | Overlay Images (si elements) |
|---------|------------------|------------------------------|
| Definition | `Slidec:{...ip:'dr/file.png'...}` | `si37648c:{...ip:'dr/file.png'...}` |
| Bounding box | Always `[0,0,880,660]` | Variable sized regions |
| Usage | One per slide (optional) | Multiple per slide |
| Pattern | `Slidec:` lowercase 'c' | `siNNNNNc:` with UID |
| Reusability | Same background across many slides | Unique to specific slides |

**Extraction Pattern:**
```javascript
const backgroundPattern = /Slide(\d+)c:\{[^}]*ip:'([^']*)'/g;
```

**Example Project Stats:**
- Total slides: 25
- Using background (dr/4016.png): 24 slides
- No background: 1 slide (Slide40393 - Periodic Table has `b:[0,0,0,0]`)

**React Implementation:**
Background images should be rendered as the **first element** in the images array to ensure proper z-index layering:

```json
{
  "images": [
    {
      "id": "background",
      "x": 0,
      "y": 0,
      "width": 880,
      "height": 660,
      "imagePath": "assets/dr/4016.png"
    },
    {
      "id": "si40212",
      "x": 47,
      "y": 49,
      "width": 785,
      "height": 271,
      "imagePath": "assets/dr/4044_785_271.png"
    }
  ]
}
```

**Why Not CSS background-image:**
CSS `background-image: url('/assets/dr/4016.png')` fails in Create React App with module resolution error. CRA's webpack cannot resolve public folder assets via CSS url(). Solution: render backgrounds as `<img>` elements with absolute positioning.

**Identification Process:**
1. Search CPM.js for all `Slidec:{...ip:'...'...}` definitions
2. Check `b:` array - `[0,0,0,0]` means no background, `[0,0,880,660]` has background
3. Group by `ip:` path to find reusable backgrounds
4. Add to slide data as first image element for proper rendering order

### Audio Synchronization

Audio metadata structure in CPM.js:
```javascript
Slide3917: {
  audCC: [{
    sf: 19,      // start frame
    ef: 156,     // end frame
    t: 'text'    // caption text
  }]
}
```

Frame rate: Typically 30 FPS for Captivate projects

### Known Issues & Solutions

### 1. AudioPlayer Layout Issue
**Problem**: AudioPlayer appears to the left of slide content instead of below it, causing the 880px slide to be pushed off-screen.

**Root Cause**: `.slide-area` has `display: flex` with default `flex-direction: row`, placing children side-by-side.

**Best Practice Solution**: Place AudioPlayer BELOW slide content (like YouTube, social media):
- Matches universal video player conventions
- Reduces cognitive load (familiar pattern)
- Content-first visual hierarchy
- No viewport width competition
- Better mobile experience

**Implementation**: 
1. Move `<AudioPlayer>` component to render AFTER the slide content in SlideArea.js
2. Add `flex-direction: column` to `.slide-area` CSS

```jsx
// SlideArea.js structure
<div className="slide-area">
  {/* Slide content first */}
  <div className="slide-container">
    {/* positioned elements */}
  </div>
  
  {/* Audio controls below (like YouTube) */}
  {slideData.audio && (
    <AudioPlayer audioFiles={slideData.audio} autoplay={isPlaying} />
  )}
</div>
```

```css
/* SlideArea.css */
.slide-area {
    flex: 1;
    display: flex;
    flex-direction: column; /* Stack vertically */
    align-items: center;
    justify-content: center;
    gap: 16px; /* Space between slide and audio player */
    padding: 20px;
}
```

**Impact**: Improved UX matching user expectations from YouTube, Facebook, TikTok, etc.

---

## Element Timing and Animation

### Timing Data Location
**Discovery:** Element timing (when elements appear/disappear during audio playback) is stored in CPM.js, not in the slide data structure.

**Format:** Each element has frame-based timing with transition effects:
```javascript
Text_Caption_986:{
  type:19,
  from:1468,        // Start frame (30fps)
  to:1497,          // End frame
  trin:15,          // Fade in duration (frames)
  trout:15,         // Fade out duration (frames)
  apsn:'Slide3917'  // Parent slide ID
}
```

**Frame Rate:** Captivate uses 30 frames per second (fps)
- Frame 1468 = 48.93 seconds (1468 / 30)
- Frame 1497 = 49.90 seconds (1497 / 30)

### Extracting Timing Data

**Pattern:**
```javascript
const elementRegex = /(\w+):\{type:(\d+),from:(\d+),to:(\d+),([^}]*?)\}/g;
```

**Key Properties:**
- `from` - Start frame when element becomes visible
- `to` - End frame when element disappears
- `trin` - Fade in transition frames (15 frames = 0.5 seconds)
- `trout` - Fade out transition frames
- `apsn` - Parent slide ID to associate element with correct slide

**Conversion to Time:**
```javascript
startTime = fromFrame / 30  // Convert to seconds
endTime = toFrame / 30
fadeInDuration = trin / 30
fadeOutDuration = trout / 30
```

### Common Timing Patterns

**Full Slide Duration:**
Elements visible entire slide appear with `from:1` and `to:{slideDuration}`

**Sequential Appearance:**
Countdown sequences show staggered timing:
- Text_Caption_986 (5): frames 1468-1497 (48.93-49.90s)
- Text_Caption_987 (4): frames 1498-1527 (49.93-50.90s)
- Text_Caption_988 (3): frames 1528-1557 (50.93-51.90s)
- Text_Caption_989 (2): frames 1558-1587 (51.93-52.90s)
- Text_Caption_990 (1): frames 1588-1620 (52.93-54.00s)

**Highlight Effects:**
Brief highlight boxes flash for emphasis:
- Highlight_Box_6: frames 20755-20844 (691.83-694.80s, 3 second flash)

### Implementing Timed Animation

**React Integration:**
1. Track audio playback time via AudioPlayer callback
2. Check element visibility: `audioTime >= startTime && audioTime <= endTime`
3. Calculate fade opacity for smooth transitions:

```javascript
let opacity = 1;
if (hasTimingData && caption.fadeInDuration) {
  const fadeInEnd = caption.startTime + caption.fadeInDuration;
  if (audioTime < fadeInEnd) {
    opacity = (audioTime - caption.startTime) / caption.fadeInDuration;
  }
}
if (hasTimingData && caption.fadeOutDuration) {
  const fadeOutStart = caption.endTime - caption.fadeOutDuration;
  if (audioTime > fadeOutStart) {
    opacity = (caption.endTime - audioTime) / caption.fadeOutDuration;
  }
}
```

**Result:** Elements fade in/out smoothly synced to audio narration.

---

## Common Pitfalls

1. **Forgetting 'c' suffix** - Element IDs in CPM.js have 'c', slide data doesn't
2. **Absolute vs relative paths** - React needs `/assets/...` not `dr/...`
3. **Bounding box confusion** - CPM.js uses [left, top, right, bottom], not [x, y, width, height]
4. **Audio ID mismatch** - Audio files use numeric IDs unrelated to slide IDs
5. **Missing position data** - Not all elements have positioning (dynamic, timing-based visibility)

### Tools Created

#### extractPositions.js
Parses CPM.js and updates slide-data.json with positioning information.

**Usage:**
```bash
node scripts/extractPositions.js
```

**Output:** Updates slide-data.json with position and imagePath for each element.

#### extractBackgroundImages.js
Extracts positioned overlay images (si elements with 'c' suffix) from CPM.js.

**Usage:**
```bash
node scripts/extractBackgroundImages.js
```

**Output:** Creates `extracted-images.json` with all si element positions and image paths.

**Pattern:** `/si(\d+)c:\{b:\[(\d+),(\d+),(\d+),(\d+)\][^}]*ip:'([^']+)'/g`

**Results:** Extracted 66 overlay images including dimensions and UIDs.

#### addBackgrounds.js
Adds slide background images to all slides that need them based on CPM.js analysis.

**Usage:**
```bash
node scripts/addBackgrounds.js
```

**Output:** Updates slide-data.json, adding background image as first element in images array for slides using dr/4016.png.

**Logic:**
1. Identifies 24 slides using dr/4016.png background
2. Skips Slide40393 (Periodic Table - has no background)
3. Skips slides already having background
4. Inserts background as first image element for proper z-index layering

#### extractTiming.js
Extracts frame-based timing data from CPM.js and adds it to slide-data.json for audio-synced animations.

**Usage:**
```bash
node scripts/extractTiming.js [SlideID]
node scripts/extractTiming.js Slide3917    # Extract timing for slide 1
node scripts/extractTiming.js Slide40210   # Extract timing for slide 9
```

**Output:** Updates slide-data.json with timing properties for each element:
- `startTime` - When element appears (seconds)
- `endTime` - When element disappears (seconds)
- `fadeInDuration` - Fade in transition (seconds)
- `fadeOutDuration` - Fade out transition (seconds)

**Pattern:** `/(\w+):\{type:(\d+),from:(\d+),to:(\d+),([^}]*?)\}/g`

**Results:** Enables sequential element appearance synced to audio narration (countdowns, step-by-step walkthroughs, highlight effects).

#### extractSmartShapes.js
Extracts SmartShape elements (speech bubbles, callouts, and other vector shapes with text) from CPM.js.

**Discovery:** SmartShapes were initially missing from React conversion because they weren't included in original extraction scripts. They contain important instructional elements like:
- "Lecture mode autostarts in..." countdown bubble
- "Table of Contents (TOC) is available" callout
- "closed captioning is available" instruction
- Connecting lines and visual guides

**Usage:**
```bash
node scripts/extractSmartShapes.js [SlideID]
node scripts/extractSmartShapes.js Slide3917   # Extract shapes for slide 1
```

**Pattern:** 
- Timing: `/(\w+):\{type:612,from:(\d+),to:(\d+),([^}]*?apsn:'([^']+)'[^}]*?)\}/g`
- Content: `/(\w+)c:\{b:\[(\d+),(\d+),(\d+),(\d+)\][^}]*?ip:'([^']*?)'[^}]*?accstr:'([^']*?)'/g`

**SmartShape Properties:**
- `type: 612` - Identifies SmartShape elements in CPM.js
- `ip:` - Image path (rendered as PNG, e.g., 'dr/SmartShape_571.png')
- `accstr:` - Accessible text / tooltip content
- `b:` - Bounding box [left, top, right, bottom]
- Timing: Same frame-based system as other elements (from/to/trin/trout)

**Output:** Updates slide-data.json shapes array with:
```javascript
{
  "id": "SmartShape_571",
  "position": { "left": 316, "top": 322, "width": 282, "height": 110 },
  "imagePath": "dr/SmartShape_571.png",
  "text": "Lecture mode autostarts in ...",
  "startTime": 47.83,
  "endTime": 54,
  "fadeInDuration": 0.5,
  "fadeOutDuration": 0.5
}
```

**Rendering:** SlideArea.js renders shapes with timing-based visibility and fade transitions, same as textCaptions and images. Uses `/assets/${shape.imagePath}` path format.

**Results:** Slide 1 now shows all 8 SmartShapes including instructional bubbles and connecting lines. Most shapes appear at start (0.03s) with instant or 0.5s fades. SmartShape_571 ("Lecture mode autostarts in...") appears at 47.83s near end of slide.

---

## SmartShapes Deep Dive

### The Mystery of SmartShapes

**Status:** ⚠️ PARTIALLY UNDERSTOOD - Core rendering issue unsolved

SmartShapes are the most complex element type in Captivate (type: 612). Unlike simple images or text captions, SmartShapes combine vector graphics with text overlays, creating speech bubbles, callouts, connecting lines, and other annotated visuals.

### What We Know (Confirmed)

#### 1. SmartShape PNG Files Exist
**Location:** `public/assets/dr/SmartShape_XXX.png`

**File Sizes:**
- **Connecting lines:** 184-220 bytes (SmartShape_555, 556, 557, 476, 477)
- **Speech bubbles:** 2.8-4.3 KB (SmartShape_569, 570, 571)

**Format:** PNG image data, 8-bit/color RGBA, non-interlaced (verified with `file` command)

**Example:**
```bash
SmartShape_555.png: PNG image data, 214 x 171, 8-bit/color RGBA, non-interlaced
SmartShape_571.png: PNG image data, 282 x 110, 8-bit/color RGBA, non-interlaced
```

#### 2. CPM.js Contains Rich Vector Data
SmartShapes in CPM.js have extensive properties beyond basic positioning:

```javascript
SmartShape_555c:{
  b:[267,458,481,629],              // Bounding box [left, top, right, bottom]
  uid:41501,                         // Unique identifier
  sr:cp.fd,
  ip:'dr/SmartShape_555.png',       // PNG path (may be fallback/placeholder)
  dn:'SmartShape_555',              // Display name
  visible:1,
  accstr:' ',                        // Accessible text content
  ti:-1,
  
  // Vector graphics properties:
  sc:'#00beff',                      // Stroke color (hex)
  sw:0,                              // Stroke width (0 = no stroke)
  ss:0,                              // Stroke style
  fa:0,                              // Fill alpha (0-100, 0 = transparent fill)
  
  // Gradient fill definition:
  gf:{
    b:[267,458,481,629],             // Gradient bounds
    t:0,                             // Type (0 = linear)
    x1:374, y1:629,                  // Gradient start point
    x2:374, y2:458,                  // Gradient end point
    s:0,                             // Spread method
    cs:[                             // Color stops array
      {p:0, c:'#b3b3b3', o:255},    // Stop at 0%: gray, full opacity
      {p:100, c:'#ffffff', o:255}    // Stop at 100%: white, full opacity
    ]
  },
  
  // SVG-like path data:
  p0:[
    [0],                             // Path command 0: start new path
    [1,309.75,458],                  // Command 1: moveTo(x, y)
    [3,286.55,458.75,267.75,477.55,267,500.75],  // Command 3: curveTo (cubic bezier)
    [2,267,586.25],                  // Command 2: lineTo(x, y)
    [3,267.75,609.45,286.55,628.25,309.75,629],
    [2,438.25,629],
    [3,461.45,628.25,480.25,609.45,481,586.25],
    [2,481,500.75],
    [3,480.25,477.55,461.45,458.75,438.25,458],
    [2,309.75,458],
    [4]                              // Command 4: closePath
  ],
  
  vbwr:[267,458,481,629],           // Visual bounds
  vb:[267,458,481,629]              // View box
}
```

#### 3. Path Command Format
**Discovery:** The `p0:` array uses numeric command codes similar to SVG path commands:

| Command | SVG Equivalent | Parameters | Purpose |
|---------|----------------|------------|---------|
| `[0]` | New path | None | Start a new path |
| `[1,x,y]` | `M x,y` | x, y | Move to absolute position |
| `[2,x,y]` | `L x,y` | x, y | Line to absolute position |
| `[3,x1,y1,x2,y2,x,y]` | `C x1,y1 x2,y2 x,y` | cp1x, cp1y, cp2x, cp2y, x, y | Cubic bezier curve |
| `[4]` | `Z` | None | Close path |

**Example Translation:**
```javascript
// Captivate: [3,286.55,458.75,267.75,477.55,267,500.75]
// SVG: C 286.55,458.75 267.75,477.55 267,500.75

// Full path for SmartShape_555:
// M 309.75,458
// C 286.55,458.75 267.75,477.55 267,500.75
// L 267,586.25
// C 267.75,609.45 286.55,628.25 309.75,629
// ... (continues)
// Z
```

#### 4. Gradient Fill Structure
Gradients define color transitions for shape backgrounds:

```javascript
gf:{
  x1:374, y1:629,  // Start point (bottom of shape)
  x2:374, y2:458,  // End point (top of shape)
  cs:[
    {p:0, c:'#b3b3b3', o:255},    // 0% = gray (#b3b3b3), opacity 255/255
    {p:100, c:'#ffffff', o:255}   // 100% = white (#ffffff), opacity 255/255
  ]
}
```

**Result:** Creates vertical gradient from gray (bottom) to white (top).

#### 5. Text Rendering Works
**Confirmed:** When using `<img>` tags with SmartShape PNG paths, the `accstr` text content renders correctly, but the shape graphics (speech bubble backgrounds, connecting lines) do NOT appear.

**Current Implementation:**
```jsx
{shapes.map((shape) => {
  const isVisible = !shape.startTime || 
    (audioTime >= shape.startTime && audioTime <= shape.endTime);
  
  return isVisible ? (
    <img
      key={shape.id}
      src={`/assets/${shape.imagePath}`}
      alt={shape.text || ''}
      title={shape.text}
      style={{
        position: 'absolute',
        left: shape.position.left,
        top: shape.position.top,
        width: shape.position.width,
        height: shape.position.height,
        opacity: opacity,
        zIndex: 5  // Above textCaptions (3) and images (auto/0)
      }}
    />
  ) : null;
})}
```

**Result:** Text appears, graphics don't.

### What We Don't Know (Unresolved Mystery)

#### The Core Problem
**Text renders but shape graphics are invisible.**

Possible explanations under investigation:

**✅ CONFIRMED: PNG Files Are Placeholders (Theory 1)**
- **User verification:** Opened SmartShape_571.png in Preview - contains NO visible graphics, empty/transparent
- PNG files exist only for positioning/dimension metadata
- Actual graphics MUST be rendered from `p0` path data + gradient fills at runtime
- File sizes (184 bytes - 4.3KB) include dimension data but no visible content
- **Conclusion:** Cannot use `<img>` or CSS `background-image` - must render live SVG from CPM.js data

**✅ CONFIRMED: Captivate Uses Base64 Data URIs (Breakthrough Discovery)**
- **DevTools inspection reveals:** SmartShape graphics rendered as base64-encoded PNG data URIs injected via JavaScript
- **Format:** `background-image: url('data:image/png;base64,iVBORw0KGgo...')`
- **NO** `<canvas>`, `<svg>`, or `<img>` children in SmartShape divs
- **NO** `background-image` in inline styles on SmartShape elements themselves
- Base64 data URI found on parent container element showing dynamic injection
- **Conclusion:** Captivate's JavaScript engine reads `p0` path data → renders to canvas/SVG → converts to PNG → base64-encodes → injects as CSS at runtime

#### Captivate's SmartShape Rendering Pipeline (Discovered)

**How Captivate Actually Renders SmartShapes:**

1. **Load Vector Data:** JavaScript reads `p0` path arrays + `gf` gradient fills from CPM.js
2. **Render Graphics:** Draws shapes to canvas or generates SVG dynamically
3. **Convert to PNG:** Takes rendered output and converts to PNG format
4. **Base64 Encode:** Encodes PNG data as base64 string
5. **CSS Injection:** Injects via JavaScript: `element.style.backgroundImage = "url('data:image/png;base64,...')"`
6. **Display:** Browser renders base64 data URI as background image

**Why Exported PNG Files Are Empty:**
- PNG files in `/dr` folder are export artifacts only
- Captivate's runtime doesn't use them - it regenerates graphics on-the-fly
- Files serve as placeholders for dimension/position metadata
- Actual visual content created dynamically during page load

**Why Our Approaches Failed:**
- `<img src="/assets/dr/SmartShape_571.png">` - Loads empty placeholder PNG
- `<div style="background-image: url(/assets/dr/SmartShape_571.png)">` - Same empty PNG
- Both approaches fundamentally wrong because they load static files instead of rendering dynamically

**DOM Structure Observed (via Inspector):**
```html
<div id="SmartShape_571" class="cp-frameset" tabindex="-1" style="left: 316px; top: 322px; width: 282px; height: 110px; z-index: 15;">
  <div class="cp-accessibility">
    <p>Lecture mode autostarts in ...</p>
  </div>
  <!-- NO img, canvas, or svg children -->
  <!-- NO background-image in inline styles -->
</div>

<!-- Parent container elsewhere in tree: -->
<div id="toc" style="background-image: url('data:image/png;base64,iVBORw0KGgo...')">
  <!-- Base64 data URI shows actual rendered graphic -->
</div>
```

**Key Insights:**
- Z-index 15 (not 13 as initially implemented)
- Graphics injected on parent containers, not on SmartShape divs themselves
- No static file references at runtime - everything dynamic
- Accessibility structure correct: nested div with text for screen readers

### Two Solution Paths Forward

#### Option A: Screenshot Replacement (Quick Fix - RECOMMENDED)
**Approach:** Manually capture visible SmartShapes from original Captivate, replace empty PNG files

**Process:**
1. Open original Captivate.htm in browser
2. Use browser DevTools or screenshot tool to capture each SmartShape
3. Save with transparency preserved (PNG format)
4. Replace corresponding files in `public/assets/dr/`
5. Current div+background-image code will work with real PNGs

**Pros:**
- Quick implementation (~30 minutes for all shapes)
- Works with existing React code
- No complex SVG rendering needed
- Immediate visual results

**Cons:**
- Manual process (not automated)
- Must repeat for each slide's SmartShapes
- Not programmatic/scalable
- Loses vector quality advantages

**Best For:** Getting working prototype quickly, especially with credit constraints

#### Option B: SVG Rendering from CPM.js (Proper Solution - FUTURE)
**Approach:** Implement live SVG rendering from `p0` path data + gradient fills

**Requirements:**
1. Update `extractSmartShapes.js` to capture vector properties (`p0`, `gf`, `sc`, `sw`, `fa`)
2. Create `SmartShapeSVG` component to render paths
3. Implement path command converter (Captivate format → SVG path string)
4. Implement gradient renderer (SVG `<linearGradient>` from `gf` data)
5. Replace div+background-image with live SVG component
6. Test across all slides and shape types

**Pros:**
- Fully automated and scalable
- Perfect vector quality at any zoom level
- True to Captivate's original rendering approach
- Programmatic control over colors, animations, etc.

**Cons:**
- Complex implementation (several hours)
- Credit-intensive development/testing
- Path command translation needs thorough testing
- Gradient rendering requires understanding all parameters

**Best For:** Long-term solution when credits available, production-quality output

**Path Command Translation Example:**
```javascript
// Captivate: [3,286.55,458.75,267.75,477.55,267,500.75]
// SVG: C 286.55,458.75 267.75,477.55 267,500.75

function convertPath(p0Array) {
  let pathString = '';
  p0Array.forEach(cmd => {
    switch(cmd[0]) {
      case 0: pathString += ''; break;  // New path
      case 1: pathString += `M ${cmd[1]},${cmd[2]} `; break;  // moveTo
      case 2: pathString += `L ${cmd[1]},${cmd[2]} `; break;  // lineTo
      case 3: pathString += `C ${cmd[1]},${cmd[2]} ${cmd[3]},${cmd[4]} ${cmd[5]},${cmd[6]} `; break;  // curveTo
      case 4: pathString += 'Z '; break;  // closePath
    }
  });
  return pathString;
}
```

**Proof-of-Concept SVG Component:**
```jsx
// NOT YET TESTED - conceptual implementation:
function SmartShapeSVG({ shape }) {
  const pathString = convertPath(shape.p0);
  
  return (
    <svg 
      width={shape.position.width} 
      height={shape.position.height}
      style={{
        position: 'absolute', 
        left: shape.position.left, 
        top: shape.position.top,
        zIndex: 15
      }}
    >
      <defs>
        <linearGradient 
          id={`grad-${shape.id}`} 
          x1={shape.gf.x1} y1={shape.gf.y1} 
          x2={shape.gf.x2} y2={shape.gf.y2}
        >
          {shape.gf.cs.map((stop, i) => (
            <stop 
              key={i}
              offset={`${stop.p}%`} 
              stopColor={stop.c} 
              stopOpacity={stop.o / 255} 
            />
          ))}
        </linearGradient>
      </defs>
      <path 
        d={pathString}
        fill={`url(#grad-${shape.id})`}
        stroke={shape.sc}
        strokeWidth={shape.sw}
        fillOpacity={shape.fa / 100}
      />
      <text /* render accstr text overlay */>
        {shape.text}
      </text>
    </svg>
  );
}
```

### Recommendation
**Start with Option A** given current credit constraints (91%+ used). This provides immediate working graphics and allows project progress. **Implement Option B** when credits refresh (1-2 weeks) for production-quality vector rendering.

#### Properties Requiring More Investigation

**Unexplored CPM.js Properties:**
- `sr:cp.fd` - Meaning unknown (same across all SmartShapes)
- `ti:-1` vs `ti:2500` - Timing indicator? (-1 = no tooltip delay?)
- `ss:0` - Stroke style (0 = solid?)
- `vbwr:` vs `vb:` - Visual bounds vs view box (always identical in samples)
- `asbos:`, `asbds:` - State-based overrides for hover/down states?

**Path Data Questions:**
- Are all command types documented? (Only seen 0-4 so far)
- Do paths support arcs, ellipses, or other curves?
- How do path coordinates relate to bounding box?
- Is there transformation matrix data we're missing?

**Gradient Questions:**
- What do `t:0` type values mean? (Radial vs linear?)
- What is `s:0` spread parameter?
- Are there radial gradients? Pattern fills?
- How are gradient coordinates transformed?

### Technical Debt & Blockers

**Current Status:** SmartShapes extract and position correctly, but render without visual graphics. Root cause identified: PNG files are empty placeholders, Captivate generates graphics dynamically via JavaScript. This affects instructional clarity:
- ✅ Text content visible (from `accstr` accessibility text)
- ✅ Positioning and timing work correctly
- ✅ Fade in/out transitions functional
- ❌ Speech bubble backgrounds invisible
- ❌ Connecting lines invisible
- ❌ Visual affordances missing (learners can't see callout context)

**Root Cause:** PNG files in `/dr` folder are export artifacts with no visual content. Captivate's JavaScript reads `p0` path data from CPM.js, renders shapes dynamically, converts to PNG, base64-encodes, and injects as CSS `background-image: url('data:image/png;base64,...')` at runtime.

**Impact:** Medium-High - Instructional elements present but not visually polished. Learners can read text but miss visual hierarchy cues.

**Solution Paths:**
- **Option A (Quick):** Screenshot visible shapes from original Captivate, replace empty PNGs (~30 min)
- **Option B (Proper):** Implement SVG rendering from CPM.js vector data (several hours, credit-intensive)

**Priority:** Should be resolved before considering project "complete," but core functionality (timing, audio sync, text content) works. Option A recommended given credit constraints.

### Lessons Learned

1. **Captivate is sophisticated** - Vector graphics with gradients, strokes, and complex paths show Adobe's advanced rendering engine
2. **Not all exports are simple** - Assumed PNG = simple image, but SmartShapes blur the line between raster and vector
3. **Data abundance doesn't mean clarity** - CPM.js has ALL the data needed, but understanding the rendering pipeline requires deeper investigation
4. **Fallbacks matter** - Even if we can't replicate exact vector rendering, need to ensure text content remains accessible

### Future Exploration Areas

1. **Widget parsing** - `wr/` folder contains widget data (glossary widget found)
2. **Animation data** - CPM.js contains `JSONTT_` properties for transitions
3. **Variable tracking** - Captivate uses variables for state management
4. **Quiz data** - Question slides have specific data structures
5. **Advanced actions** - JavaScript actions embedded in CPM.js

---

**Last Updated:** January 18, 2026
**Project:** Stoichiometry Lesson Rebuild from Captivate 8.0.1
