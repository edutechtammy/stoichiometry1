# SmartShape SVG Implementation Plan

## Decision: Option B - SVG Rendering from CPM.js Vector Data

**Date:** January 18, 2026  
**Status:** Deferred until credits refresh (1-2 weeks)  
**Reason:** Long-term investment for multiple projects and future React-native development

## Why Option B Over Option A

### Strategic Benefits
1. **Scalability:** Automated extraction works across all projects with SmartShapes
2. **Future-proofing:** Learn the underlying technology, not just a workaround
3. **React Skills:** Build reusable SVG components for native React development
4. **Quality:** Vector graphics scale perfectly at any resolution
5. **Flexibility:** Programmatic control over colors, animations, interactions

### Multi-Project Application
- Current: Stoichiometry lesson (25 slides)
- Future: Multiple Captivate projects to convert
- Beyond: Create SmartShape-like components in pure React without Captivate

## Implementation Roadmap

### Phase 1: Data Extraction Enhancement
**Goal:** Capture all vector properties from CPM.js

**File:** `scripts/extractSmartShapes.js`

**Current Extraction (Position + Timing only):**
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

**Enhanced Extraction (Add Vector Properties):**
```javascript
{
  "id": "SmartShape_571",
  "position": { "left": 316, "top": 322, "width": 282, "height": 110 },
  "text": "Lecture mode autostarts in ...",
  "startTime": 47.83,
  "endTime": 54,
  "fadeInDuration": 0.5,
  "fadeOutDuration": 0.5,
  
  // NEW: Vector graphics data
  "vectorData": {
    "pathCommands": [
      [0],
      [1, 309.75, 458],
      [3, 286.55, 458.75, 267.75, 477.55, 267, 500.75],
      [2, 267, 586.25],
      // ... full p0 array
    ],
    "stroke": {
      "color": "#00beff",
      "width": 0,
      "style": 0
    },
    "fill": {
      "alpha": 0,
      "gradient": {
        "type": 0,
        "x1": 374, "y1": 629,
        "x2": 374, "y2": 458,
        "spread": 0,
        "colorStops": [
          { "position": 0, "color": "#b3b3b3", "opacity": 255 },
          { "position": 100, "color": "#ffffff", "opacity": 255 }
        ]
      }
    },
    "bounds": [267, 458, 481, 629]
  }
}
```

**Extraction Pattern Updates:**
```javascript
// Current pattern matches positioning only
const contentPattern = /(\w+)c:\{b:\[(\d+),(\d+),(\d+),(\d+)\][^}]*?ip:'([^']*?)'[^}]*?accstr:'([^']*?)'/g;

// Need to expand to capture vector properties
const vectorPattern = /(\w+)c:\{
  b:\[(\d+),(\d+),(\d+),(\d+)\]      // Bounding box
  [^}]*?ip:'([^']*?)'                 // Image path
  [^}]*?accstr:'([^']*?)'             // Text content
  [^}]*?p0:(\[\[.*?\]\])              // Path commands (CRITICAL)
  [^}]*?(?:gf:(\{.*?\}))?             // Gradient fill (optional)
  [^}]*?(?:sc:'([^']*?)')?            // Stroke color (optional)
  [^}]*?(?:sw:(\d+))?                 // Stroke width (optional)
  [^}]*?(?:fa:(\d+))?                 // Fill alpha (optional)
/gx;
```

**Challenges:**
- Nested object extraction (gradient data has nested color stops)
- Path array parsing (needs recursive or careful regex)
- Optional properties (some shapes have gradients, some don't)

**Solution:** May need to use `eval()` or `JSON.parse()` for complex nested structures after isolating the relevant section.

### Phase 2: Path Command Converter
**Goal:** Translate Captivate path format to SVG path strings

**File:** `src/components/SmartShapeSVG.jsx` (new component)

**Command Mapping:**

| Captivate | SVG | Parameters | Example Input | Example Output |
|-----------|-----|------------|---------------|----------------|
| `[0]` | (none) | None | `[0]` | `` |
| `[1,x,y]` | `M x,y` | x, y | `[1,309.75,458]` | `M 309.75,458` |
| `[2,x,y]` | `L x,y` | x, y | `[2,267,586.25]` | `L 267,586.25` |
| `[3,x1,y1,x2,y2,x,y]` | `C x1,y1 x2,y2 x,y` | cp1x, cp1y, cp2x, cp2y, x, y | `[3,286.55,458.75,267.75,477.55,267,500.75]` | `C 286.55,458.75 267.75,477.55 267,500.75` |
| `[4]` | `Z` | None | `[4]` | `Z` |

**Implementation:**
```javascript
function convertPathCommandsToSVG(p0Array) {
  if (!p0Array || !Array.isArray(p0Array)) return '';
  
  let pathString = '';
  
  p0Array.forEach(cmd => {
    if (!Array.isArray(cmd) || cmd.length === 0) return;
    
    const cmdType = cmd[0];
    
    switch(cmdType) {
      case 0:
        // New path - no output needed
        break;
        
      case 1:
        // moveTo
        if (cmd.length >= 3) {
          pathString += `M ${cmd[1]},${cmd[2]} `;
        }
        break;
        
      case 2:
        // lineTo
        if (cmd.length >= 3) {
          pathString += `L ${cmd[1]},${cmd[2]} `;
        }
        break;
        
      case 3:
        // curveTo (cubic bezier)
        if (cmd.length >= 7) {
          pathString += `C ${cmd[1]},${cmd[2]} ${cmd[3]},${cmd[4]} ${cmd[5]},${cmd[6]} `;
        }
        break;
        
      case 4:
        // closePath
        pathString += 'Z ';
        break;
        
      default:
        console.warn(`Unknown path command type: ${cmdType}`, cmd);
    }
  });
  
  return pathString.trim();
}
```

**Testing Strategy:**
1. Start with simple shapes (connecting lines - SmartShape_555, 556, 557)
2. Verify coordinates match bounding box
3. Progress to complex shapes (speech bubbles - SmartShape_569, 570, 571)
4. Compare rendered output to original Captivate visually

### Phase 3: Gradient Renderer
**Goal:** Convert Captivate gradient format to SVG `<linearGradient>`

**Gradient Data Structure:**
```javascript
gf: {
  b: [267, 458, 481, 629],           // Gradient bounds
  t: 0,                               // Type (0 = linear, likely 1 = radial)
  x1: 374, y1: 629,                   // Start point
  x2: 374, y2: 458,                   // End point
  s: 0,                               // Spread method
  cs: [                               // Color stops
    { p: 0, c: '#b3b3b3', o: 255 },  // Position 0%, color gray, opacity 255/255
    { p: 100, c: '#ffffff', o: 255 }  // Position 100%, color white, opacity 255/255
  ]
}
```

**SVG Gradient Implementation:**
```javascript
function renderGradient(gradientData, shapeId) {
  if (!gradientData) return null;
  
  const { x1, y1, x2, y2, cs } = gradientData;
  const gradientId = `gradient-${shapeId}`;
  
  return (
    <defs>
      <linearGradient 
        id={gradientId}
        x1={x1} y1={y1}
        x2={x2} y2={y2}
        gradientUnits="userSpaceOnUse"
      >
        {cs.map((stop, index) => (
          <stop
            key={index}
            offset={`${stop.p}%`}
            stopColor={stop.c}
            stopOpacity={stop.o / 255}
          />
        ))}
      </linearGradient>
    </defs>
  );
}
```

**Coordinate System Notes:**
- Captivate uses absolute coordinates
- Gradient x1/y1/x2/y2 are in same coordinate space as path commands
- `gradientUnits="userSpaceOnUse"` ensures correct alignment

**Edge Cases to Handle:**
- Radial gradients (t: 1 vs t: 0)
- Missing gradient data (solid fills)
- Color stops with varying opacity
- Spread methods (s: 0 = pad, s: 1 = reflect, s: 2 = repeat?)

### Phase 4: SmartShapeSVG Component
**Goal:** Create React component that renders SmartShapes from vector data

**File:** `src/components/SmartShapeSVG.jsx`

**Component Structure:**
```jsx
import React from 'react';
import { convertPathCommandsToSVG } from '../utils/pathConverter';

function SmartShapeSVG({ shape, audioTime }) {
  // Calculate visibility based on timing
  const isVisible = !shape.startTime || 
    (audioTime >= shape.startTime && audioTime <= shape.endTime);
  
  if (!isVisible) return null;
  
  // Calculate opacity for fade transitions
  let opacity = 1;
  if (shape.fadeInDuration && audioTime < shape.startTime + shape.fadeInDuration) {
    opacity = (audioTime - shape.startTime) / shape.fadeInDuration;
  }
  if (shape.fadeOutDuration && audioTime > shape.endTime - shape.fadeOutDuration) {
    opacity = (shape.endTime - audioTime) / shape.fadeOutDuration;
  }
  
  // Extract vector data
  const { vectorData, position, text } = shape;
  if (!vectorData) {
    console.warn(`Shape ${shape.id} missing vector data`);
    return null;
  }
  
  // Convert path commands to SVG path string
  const pathString = convertPathCommandsToSVG(vectorData.pathCommands);
  
  // Generate gradient ID
  const gradientId = `gradient-${shape.id}`;
  
  // Determine fill
  const hasFill = vectorData.fill && vectorData.fill.alpha > 0;
  const hasGradient = vectorData.fill && vectorData.fill.gradient;
  const fillValue = hasGradient ? `url(#${gradientId})` : 'none';
  
  return (
    <svg
      width={position.width}
      height={position.height}
      viewBox={`${vectorData.bounds[0]} ${vectorData.bounds[1]} ${vectorData.bounds[2] - vectorData.bounds[0]} ${vectorData.bounds[3] - vectorData.bounds[1]}`}
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
        zIndex: 15,
        opacity: opacity,
        transition: 'opacity 0.3s ease'
      }}
      role="img"
      aria-label={text || ''}
    >
      {/* Gradient definition */}
      {hasGradient && (
        <defs>
          <linearGradient
            id={gradientId}
            x1={vectorData.fill.gradient.x1}
            y1={vectorData.fill.gradient.y1}
            x2={vectorData.fill.gradient.x2}
            y2={vectorData.fill.gradient.y2}
            gradientUnits="userSpaceOnUse"
          >
            {vectorData.fill.gradient.colorStops.map((stop, i) => (
              <stop
                key={i}
                offset={`${stop.position}%`}
                stopColor={stop.color}
                stopOpacity={stop.opacity / 255}
              />
            ))}
          </linearGradient>
        </defs>
      )}
      
      {/* Main shape path */}
      <path
        d={pathString}
        fill={fillValue}
        fillOpacity={hasFill ? vectorData.fill.alpha / 100 : 0}
        stroke={vectorData.stroke.color || 'none'}
        strokeWidth={vectorData.stroke.width || 0}
      />
      
      {/* Accessibility text (hidden visually, available to screen readers) */}
      <title>{text}</title>
    </svg>
  );
}

export default SmartShapeSVG;
```

**Integration with SlideArea.js:**
```jsx
import SmartShapeSVG from './SmartShapeSVG';

// In render method, replace current shape rendering:
{shapes.map((shape) => (
  <SmartShapeSVG 
    key={shape.id}
    shape={shape}
    audioTime={audioTime}
  />
))}
```

### Phase 5: Testing & Validation
**Goal:** Ensure SVG rendering matches original Captivate output

**Test Cases:**

1. **Simple Lines (SmartShape_555, 556, 557, 476, 477)**
   - Verify straight lines render correctly
   - Check positioning relative to other elements
   - Confirm no fill (fa: 0)
   - Validate stroke color and width

2. **Speech Bubbles (SmartShape_569, 570, 571)**
   - Verify curved paths (bezier curves)
   - Check gradient rendering (gray to white)
   - Confirm bounds match position
   - Test text accessibility

3. **Timing & Animations**
   - Shapes appear at correct times
   - Fade in/out transitions smooth
   - Opacity calculations accurate

4. **Cross-browser Compatibility**
   - Chrome (primary dev browser)
   - Firefox
   - Safari
   - Edge

5. **Responsiveness**
   - SVG scales with container
   - Maintains aspect ratio
   - Coordinates stay aligned

**Validation Process:**
```bash
# 1. Extract with enhanced script
node scripts/extractSmartShapes.js Slide3917

# 2. Check slide-data.json has vectorData
cat rebuild-to-html/src/data/slide-data.json | jq '.slides[0].shapes[0].vectorData'

# 3. Start dev server
cd rebuild-to-html/rebuild-to-html && npm start

# 4. Visual comparison
# - Open original: Captivate Publish/Stoichiometry.htm
# - Open React version: localhost:3000
# - Screenshot comparison side-by-side

# 5. Accessibility check
# - Screen reader test (VoiceOver on macOS)
# - Keyboard navigation
# - ARIA labels present
```

### Phase 6: Utility Library
**Goal:** Create reusable utilities for future projects

**File:** `src/utils/smartShapeUtils.js`

**Functions to Extract:**
```javascript
// Path conversion
export function convertPathCommandsToSVG(p0Array) { /* ... */ }

// Gradient rendering
export function renderGradient(gradientData, shapeId) { /* ... */ }

// Coordinate transformations
export function transformCoordinates(coords, bounds) { /* ... */ }

// Color utilities
export function hexToRgba(hex, alpha) { /* ... */ }
export function captivateOpacityToCSS(captivateOpacity) {
  return captivateOpacity / 255;
}

// Validation
export function validateVectorData(vectorData) {
  // Check required properties
  // Warn about missing or malformed data
}
```

**Documentation:**
```javascript
/**
 * Converts Captivate p0 path commands to SVG path string
 * 
 * @param {Array<Array<number>>} p0Array - Path commands from CPM.js
 * @returns {string} SVG path string (e.g., "M 10,20 L 30,40 Z")
 * 
 * @example
 * const pathCommands = [[1,10,20], [2,30,40], [4]];
 * const svgPath = convertPathCommandsToSVG(pathCommands);
 * // Returns: "M 10,20 L 30,40 Z"
 */
```

## Known Challenges & Solutions

### Challenge 1: Complex Regex for Nested Objects
**Problem:** Gradient data is nested JSON within CPM.js minified code  
**Solution:** Extract the relevant section, then use `eval()` or custom parser

```javascript
// Find the shape definition
const shapeMatch = cpmContent.match(/SmartShape_555c:\{[^}]+gf:\{[^}]+\}[^}]*\}/);
if (shapeMatch) {
  // Isolate just the gf property
  const gfMatch = shapeMatch[0].match(/gf:(\{[^}]+\})/);
  if (gfMatch) {
    // Safe eval in controlled context
    const gradientData = eval(`(${gfMatch[1]})`);
  }
}
```

### Challenge 2: Coordinate Systems
**Problem:** SVG viewBox vs absolute positioning  
**Solution:** Use `viewBox` to maintain Captivate's coordinate system, CSS for positioning

```jsx
<svg
  viewBox="267 458 214 171"  // Matches CPM.js bounds
  width={214}                 // Physical dimensions
  height={171}
  style={{
    position: 'absolute',
    left: 267,                // Absolute positioning on slide
    top: 458
  }}
>
```

### Challenge 3: Performance with Many Shapes
**Problem:** SVG rendering can be expensive with complex paths  
**Solution:** Memoization and conditional rendering

```javascript
const MemoizedSmartShapeSVG = React.memo(SmartShapeSVG, (prevProps, nextProps) => {
  // Only re-render if visibility or opacity changes
  return prevProps.audioTime === nextProps.audioTime &&
         prevProps.shape.id === nextProps.shape.id;
});
```

### Challenge 4: Debugging Path Issues
**Problem:** Hard to visualize what path commands produce  
**Solution:** SVG path debugging tool

```jsx
// Development-only overlay
{process.env.NODE_ENV === 'development' && (
  <g stroke="red" strokeWidth="1" fill="none">
    {/* Overlay bounding box */}
    <rect {...boundingBox} />
    {/* Show control points */}
    {controlPoints.map((pt, i) => (
      <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="red" />
    ))}
  </g>
)}
```

## Timeline Estimate

**When Credits Refresh:**

- **Week 1: Data Extraction**
  - Days 1-2: Enhance `extractSmartShapes.js` to capture vector data
  - Day 3: Test extraction on all 25 slides
  - Day 4: Validate JSON structure
  
- **Week 2: Component Development**
  - Days 1-2: Build path converter utility
  - Days 3-4: Implement SmartShapeSVG component
  - Day 5: Gradient rendering

- **Week 3: Testing & Refinement**
  - Days 1-2: Visual comparison testing
  - Day 3: Cross-browser testing
  - Days 4-5: Bug fixes and polish

- **Week 4: Documentation & Reusability**
  - Days 1-2: Extract utilities library
  - Days 3-4: Write comprehensive docs
  - Day 5: Create examples for future projects

**Total:** ~4 weeks of focused development

## Learning Resources

### SVG Path Commands
- MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
- SVG Path Visualizer: https://svg-path-visualizer.netlify.app/

### React + SVG Best Practices
- React SVG docs: https://react.dev/learn/writing-markup-with-jsx#3-camel-case-all-most-of-the-things
- Performance: https://css-tricks.com/using-svg/

### Captivate References
- Current project CPM.js (for reverse-engineering)
- CAPTIVATE_TECHNICAL_KNOWLEDGE.md (our findings)

## Success Criteria

✅ All SmartShapes render with correct graphics (not just text)  
✅ Visual output matches original Captivate pixel-perfect  
✅ Timing and animations work correctly  
✅ Code is reusable across multiple projects  
✅ Documentation enables building SmartShapes from scratch in React  
✅ Performance is acceptable (no lag during playback)  
✅ Accessibility maintained (screen readers work)  

## Future Enhancements (Post-MVP)

1. **Interactive SmartShapes**
   - Click handlers
   - Hover effects
   - Animation sequences

2. **SmartShape Builder UI**
   - Visual editor for creating shapes
   - Path drawing tools
   - Gradient editor
   - Export to CPM.js format

3. **Advanced Shape Types**
   - Arrows with dynamic direction
   - Callout bubbles with pointers
   - Connectors between elements
   - Custom shapes library

4. **Animation Library**
   - Entrance effects (fly in, fade, etc.)
   - Exit effects
   - Motion paths
   - Synchronized animations

---

**Ready to implement when credits refresh!** 🚀

This plan provides a clear roadmap from data extraction to production-ready SVG rendering, with reusability as a core principle.
