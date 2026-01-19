# Building Scalable SVG Library for SmartShapes

## Understanding Captivate's Non-Uniform Scaling

**Key Insight:** Captivate SmartShapes can be stretched independently on width/height axes, not just uniformly scaled. This is critical for creating flexible, reusable shape components.

### How Captivate Achieves This

When you resize a SmartShape in Captivate:
- **Width-only stretch:** Shape gets wider but maintains height
- **Height-only stretch:** Shape gets taller but maintains width  
- **Proportional scaling:** Both dimensions scale together
- **The shape's path coordinates update** to maintain visual appearance

**Example:** A speech bubble 200x100px can become 400x100px (2x width, same height) and the rounded corners, pointer, and curves all adapt proportionally.

## SVG Techniques for Non-Uniform Scaling

### Option 1: viewBox + preserveAspectRatio="none" (Recommended)

**How it works:** The SVG stretches its internal coordinate system to fit the container.

```jsx
<svg 
  width={actualWidth}
  height={actualHeight}
  viewBox="0 0 100 50"  // Original design dimensions
  preserveAspectRatio="none"  // KEY: Allows non-proportional stretching
  style={{
    position: 'absolute',
    left: x,
    top: y
  }}
>
  <path d="M 10,10 L 90,10 L 90,40 L 10,40 Z" />
</svg>
```

**Result:** If you set `width={200} height={100}`, the path stretches 2x horizontally and 2x vertically. If you set `width={200} height={50}`, it stretches 2x horizontally but maintains vertical proportions.

**Pros:**
- Simple implementation
- Browser handles all math
- Perfect for most shapes
- Easy to create in Illustrator

**Cons:**  
- Stroke widths scale with shape (may look odd)
- Rounded corners become elliptical when stretched non-uniformly
- Not ideal for shapes needing fixed corner radii

### Option 2: 9-Slice Scaling (For Speech Bubbles/Callouts)

**Concept:** Divide shape into 9 regions - corners stay fixed, edges stretch in one direction, center stretches both ways.

```
┌────┬─────────┬────┐
│ TL │   Top   │ TR │  ← Top corners fixed, top edge stretches horizontally
├────┼─────────┼────┤
│    │         │    │  ← Left/right edges stretch vertically
│ L  │ Center  │  R │  ← Center stretches both ways
│    │         │    │
├────┼─────────┼────┤
│ BL │  Bottom │ BR │  ← Bottom corners fixed, bottom edge stretches horizontally
└────┴─────────┴────┘
```

**Implementation Example:**

```jsx
function NineSliceSpeechBubble({ width, height, cornerRadius = 10, pointerSize = 15 }) {
  const minWidth = cornerRadius * 2 + pointerSize;
  const minHeight = cornerRadius * 2;
  
  // Ensure minimum dimensions
  const w = Math.max(width, minWidth);
  const h = Math.max(height, minHeight);
  
  // Fixed corner radius regardless of size
  const r = cornerRadius;
  
  return (
    <svg width={w} height={h} xmlns="http://www.w3.org/2000/svg">
      <path d={`
        M ${r},0
        L ${w - r},0
        Q ${w},0 ${w},${r}
        L ${w},${h - r}
        Q ${w},${h} ${w - r},${h}
        L ${r + pointerSize + 5},${h}
        L ${r + pointerSize},${h + pointerSize}
        L ${r + pointerSize},${h}
        L ${r},${h}
        Q 0,${h} 0,${h - r}
        L 0,${r}
        Q 0,0 ${r},0
        Z
      `}
      fill="url(#bubbleGradient)"
      stroke="#00beff"
      strokeWidth="2"
      />
      
      <defs>
        <linearGradient id="bubbleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e6e6e6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
```

**Pros:**
- Perfect corner radius regardless of shape size
- Professional appearance
- Matches UI toolkit behavior
- Great for rectangular speech bubbles

**Cons:**
- More complex to implement
- Requires JavaScript calculation
- Harder to create in Illustrator initially

### Option 3: SVG Patterns/Symbols with vector-effect

**For fixed-width strokes:**

```jsx
<svg width={width} height={height} viewBox="0 0 100 50" preserveAspectRatio="none">
  <path 
    d="M 10,10 L 90,10 L 90,40 L 10,40 Z"
    fill="url(#gradient)"
    stroke="#00beff"
    strokeWidth="2"
    vectorEffect="non-scaling-stroke"  // Stroke stays 2px regardless of scale
  />
</svg>
```

**Pros:**
- Strokes don't distort when scaling
- Good for technical diagrams
- Maintains line weight consistency

**Cons:**
- Limited browser support for `vectorEffect`
- Doesn't solve corner radius issue

## Your Workflow: Illustrator → React SVG Components

### Step 1: Design Base Shape in Illustrator

**Design Guidelines:**
- Work at a standard size (e.g., 100x50px for speech bubbles)
- Use simple paths (avoid complex effects)
- Keep stroke widths consistent (2-3px recommended)
- Use solid colors or simple gradients
- Name artboards clearly (e.g., "SpeechBubble_LeftPointer")

**Export Settings:**
- Format: SVG
- Styling: Presentation Attributes (not CSS)
- Font: Convert to Outlines
- Object IDs: Layer Names
- Decimal Places: 2 (keeps file size small)
- Minify: OFF (we'll minify later)
- Responsive: ON (adds viewBox automatically)

### Step 2: Extract SVG Code

After exporting from Illustrator, you'll get something like:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
  <defs>
    <linearGradient id="gradient-1" x1="50" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
      <stop offset="0" style="stop-color:#ffffff"/>
      <stop offset="1" style="stop-color:#e6e6e6"/>
    </linearGradient>
  </defs>
  <path d="M10,5 C10,2.24 12.24,0 15,0 L85,0 C87.76,0 90,2.24 90,5 L90,40 C90,42.76 87.76,45 85,45 L25,45 L20,50 L20,45 L15,45 C12.24,45 10,42.76 10,40 Z" 
        fill="url(#gradient-1)" 
        stroke="#00beff" 
        stroke-width="2"/>
</svg>
```

### Step 3: Convert to React Component

**Template Structure:**

```jsx
import React from 'react';

/**
 * Speech Bubble with left-side pointer
 * Supports non-uniform scaling while maintaining visual balance
 * 
 * @param {number} width - Desired width in pixels
 * @param {number} height - Desired height in pixels  
 * @param {string} fillColor - Primary fill color (hex)
 * @param {string} strokeColor - Outline color (hex)
 * @param {number} strokeWidth - Outline thickness (default: 2)
 * @param {object} gradient - Optional gradient config { start: '#fff', end: '#e6e6e6' }
 * @param {number} opacity - Shape opacity 0-1 (default: 1)
 */
function SpeechBubbleLeft({ 
  width = 100, 
  height = 50,
  fillColor = '#ffffff',
  strokeColor = '#00beff',
  strokeWidth = 2,
  gradient = null,
  opacity = 1,
  className = ''
}) {
  const gradientId = `speechBubbleGradient-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg 
      width={width}
      height={height}
      viewBox="0 0 100 50"
      preserveAspectRatio="none"
      className={className}
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {gradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradient.start} />
            <stop offset="100%" stopColor={gradient.end} />
          </linearGradient>
        </defs>
      )}
      
      <path 
        d="M10,5 C10,2.24 12.24,0 15,0 L85,0 C87.76,0 90,2.24 90,5 L90,40 C90,42.76 87.76,45 85,45 L25,45 L20,50 L20,45 L15,45 C12.24,45 10,42.76 10,40 Z"
        fill={gradient ? `url(#${gradientId})` : fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export default SpeechBubbleLeft;
```

### Step 4: Create Shape Library Structure

```
src/
  components/
    SmartShapes/
      index.js                      // Export all shapes
      
      SpeechBubbles/
        SpeechBubbleLeft.jsx        // Pointer on left
        SpeechBubbleRight.jsx       // Pointer on right
        SpeechBubbleTop.jsx         // Pointer on top
        SpeechBubbleBottom.jsx      // Pointer on bottom
        
      Callouts/
        CalloutRectangle.jsx        // Simple rectangular callout
        CalloutRounded.jsx          // Rounded corners
        CalloutCloud.jsx            // Cloud/thought bubble
        
      Arrows/
        ArrowStraight.jsx           // Simple arrow
        ArrowCurved.jsx             // Curved arrow
        ArrowDouble.jsx             // Double-ended arrow
        
      Connectors/
        LineConnector.jsx           // Simple line
        CurvedConnector.jsx         // Bezier curve
        ElbowConnector.jsx          // 90-degree elbow
        
      Shapes/
        Rectangle.jsx               // Basic shapes
        RoundedRectangle.jsx
        Circle.jsx
        Triangle.jsx
        Star.jsx
        
      Banners/
        RibbonBanner.jsx
        FoldedCorner.jsx
        
      README.md                     // Documentation for each shape
```

### Step 5: Create Shape Registry

**File:** `src/components/SmartShapes/index.js`

```javascript
// Speech Bubbles
export { default as SpeechBubbleLeft } from './SpeechBubbles/SpeechBubbleLeft';
export { default as SpeechBubbleRight } from './SpeechBubbles/SpeechBubbleRight';
export { default as SpeechBubbleTop } from './SpeechBubbles/SpeechBubbleTop';
export { default as SpeechBubbleBottom } from './SpeechBubbles/SpeechBubbleBottom';

// Callouts
export { default as CalloutRectangle } from './Callouts/CalloutRectangle';
export { default as CalloutRounded } from './Callouts/CalloutRounded';
export { default as CalloutCloud } from './Callouts/CalloutCloud';

// ... etc

// Shape type mapping for dynamic rendering
export const SHAPE_TYPES = {
  'speech-bubble-left': 'SpeechBubbleLeft',
  'speech-bubble-right': 'SpeechBubbleRight',
  'callout-rectangle': 'CalloutRectangle',
  // ... etc
};

// Helper to get component by type
export function getShapeComponent(shapeType) {
  const componentName = SHAPE_TYPES[shapeType];
  return require(`./index.js`)[componentName];
}
```

## Mapping Captivate Shapes to React Components

### Current Captivate SmartShapes (from your project)

Based on CPM.js analysis, you have these SmartShape types:

1. **SmartShape_555, 556, 557** - Connecting lines (simple paths)
2. **SmartShape_476, 477** - More connecting lines
3. **SmartShape_569** - "closed captioning" speech bubble
4. **SmartShape_570** - "TOC available" callout
5. **SmartShape_571** - "Lecture mode" countdown bubble

### Proposed Library Components

**Priority 1 (Match your current needs):**
```
✓ SpeechBubbleBottomLeft.jsx    - For SmartShape_571 style
✓ CalloutRectanglePointer.jsx   - For SmartShape_569, 570 style  
✓ LineConnector.jsx             - For SmartShape_555-557, 476-477
```

**Priority 2 (Common Captivate shapes):**
```
◯ SpeechBubbleRounded.jsx       - Generic rounded bubble
◯ CalloutCloud.jsx              - Thought bubble style
◯ ArrowStraight.jsx             - Directional arrows
◯ HighlightBox.jsx              - For emphasis boxes
```

**Priority 3 (Extended library):**
```
◯ BannerRibbon.jsx
◯ StarBurst.jsx
◯ ProcessBox.jsx
◯ DecisionDiamond.jsx
```

## Example: Building Speech Bubble with Bottom-Left Pointer

**Step-by-step Illustrator → React:**

### 1. Design in Illustrator

```
Artboard: 280px × 110px (matches SmartShape_571 dimensions)

Elements:
- Rounded rectangle: 10px corner radius
- Pointer triangle: 20px wide, 15px tall, positioned bottom-left
- Gradient: White (#ffffff) top → Light gray (#e6e6e6) bottom
- Stroke: Cyan (#00beff), 2px
```

### 2. Export SVG

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 110">
  <defs>
    <linearGradient id="bubble-gradient" x1="140" y1="0" x2="140" y2="110" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#e6e6e6"/>
    </linearGradient>
  </defs>
  <path d="M 10,0 L 270,0 Q 280,0 280,10 L 280,100 Q 280,110 270,110 L 50,110 L 40,125 L 35,110 L 10,110 Q 0,110 0,100 L 0,10 Q 0,0 10,0 Z" 
        fill="url(#bubble-gradient)" 
        stroke="#00beff" 
        stroke-width="2"/>
</svg>
```

### 3. Create React Component

```jsx
import React from 'react';

/**
 * Speech Bubble with bottom-left pointer
 * Used for countdown timers, tooltips, callouts
 * 
 * Original design: 280×110px
 * Scales non-uniformly while maintaining visual balance
 */
function SpeechBubbleBottomLeft({
  width = 280,
  height = 110,
  pointerOffset = 35,  // Distance from left edge to pointer tip
  gradient = { start: '#ffffff', end: '#e6e6e6' },
  strokeColor = '#00beff',
  strokeWidth = 2,
  opacity = 1,
  className = '',
  style = {}
}) {
  const gradientId = `bubble-bl-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 110"
      preserveAspectRatio="none"
      className={className}
      style={{ opacity, ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={gradient.start} />
          <stop offset="100%" stopColor={gradient.end} />
        </linearGradient>
      </defs>
      
      <path
        d="M 10,0 L 270,0 Q 280,0 280,10 L 280,100 Q 280,110 270,110 L 50,110 L 40,125 L 35,110 L 10,110 Q 0,110 0,100 L 0,10 Q 0,0 10,0 Z"
        fill={`url(#${gradientId})`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export default SpeechBubbleBottomLeft;
```

### 4. Usage in SlideArea

```jsx
import { SpeechBubbleBottomLeft } from '../SmartShapes';

// In render:
<div style={{ position: 'absolute', left: 316, top: 322 }}>
  <SpeechBubbleBottomLeft
    width={282}
    height={110}
    opacity={shapeOpacity}
  />
  <div style={{ 
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    padding: '10px'
  }}>
    Lecture mode autostarts in {countdown}
  </div>
</div>
```

## Advanced: Parametric Shapes

For maximum flexibility, create shapes that adapt to content:

```jsx
function AdaptiveSpeechBubble({
  children,           // Text content
  padding = 20,       // Internal padding
  pointerPosition = 'bottom-left',
  minWidth = 100,
  minHeight = 50
}) {
  const textRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: minWidth, height: minHeight });
  
  useEffect(() => {
    if (textRef.current) {
      const { offsetWidth, offsetHeight } = textRef.current;
      setDimensions({
        width: Math.max(offsetWidth + padding * 2, minWidth),
        height: Math.max(offsetHeight + padding * 2, minHeight)
      });
    }
  }, [children, padding, minWidth, minHeight]);
  
  return (
    <div style={{ position: 'relative' }}>
      <SpeechBubbleBottomLeft 
        width={dimensions.width} 
        height={dimensions.height}
      />
      <div 
        ref={textRef}
        style={{
          position: 'absolute',
          top: padding,
          left: padding,
          right: padding,
          bottom: padding
        }}
      >
        {children}
      </div>
    </div>
  );
}
```

## Testing Your SVG Components

### Visual Test Gallery

Create a test page showing each shape at different sizes:

```jsx
// src/components/SmartShapes/Gallery.jsx
import React from 'react';
import * as Shapes from './index';

function ShapeGallery() {
  return (
    <div style={{ padding: 40, background: '#f0f0f0' }}>
      <h1>SmartShape Library Gallery</h1>
      
      {Object.entries(Shapes).map(([name, Component]) => {
        if (name === 'SHAPE_TYPES' || name === 'getShapeComponent') return null;
        
        return (
          <div key={name} style={{ marginBottom: 60 }}>
            <h2>{name}</h2>
            
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {/* Original size */}
              <div>
                <h4>Original (100×50)</h4>
                <Component width={100} height={50} />
              </div>
              
              {/* Scaled uniformly */}
              <div>
                <h4>2× Scale (200×100)</h4>
                <Component width={200} height={100} />
              </div>
              
              {/* Stretched horizontally */}
              <div>
                <h4>Wide (300×50)</h4>
                <Component width={300} height={50} />
              </div>
              
              {/* Stretched vertically */}
              <div>
                <h4>Tall (100×150)</h4>
                <Component width={100} height={150} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ShapeGallery;
```

## Collaboration Workflow

### You (Illustrator) → Me (React Implementation)

**Your deliverables:**
1. SVG file exported from Illustrator
2. Shape name/description
3. Intended use case
4. Any special requirements (fixed corners, specific scaling behavior)

**My implementation:**
1. Extract SVG path data
2. Create React component with props
3. Add to shape library
4. Write usage documentation
5. Add to gallery for visual testing

### Iteration Process

```
You design → Export SVG → I implement → You test visually → Refine if needed
```

## Priority List for Initial Library

Based on your Captivate project analysis:

**Week 1: Core Shapes (Match current project)**
- [ ] SpeechBubbleBottomLeft (SmartShape_571 style)
- [ ] CalloutRectangleTopRight (SmartShape_569, 570 style)
- [ ] LineConnector (SmartShape_555-557, 476-477 style)

**Week 2: Common Variations**
- [ ] SpeechBubble variants (top/right/bottom-right pointers)
- [ ] Callout variants (different pointer positions)
- [ ] Arrow shapes (straight, curved)

**Week 3: Extended Library**
- [ ] Cloud/thought bubbles
- [ ] Banner shapes
- [ ] Highlight boxes
- [ ] Process diagram shapes

## Resources

### SVG Path Reference
- **MDN Path Commands:** https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
- **SVG Path Editor (test/visualize):** https://yqnn.github.io/svg-path-editor/

### Illustrator Tips
- Use **Effect → Convert to Shape** for precise rounded rectangles
- **Object → Path → Simplify** to reduce path complexity
- **View → Outline** mode to see pure vector paths
- **File → Export → Export As (SVG)** with proper settings

### React + SVG Best Practices
- Always use `viewBox` for scalability
- Convert CSS `stroke-width` to `strokeWidth` (camelCase)
- Generate unique IDs for gradients (avoid conflicts)
- Use `aria-label` for accessibility

---

## Next Steps

1. **You create:** First 3 shapes in Illustrator (speech bubble, callout, line connector)
2. **Export:** SVG files with proper settings
3. **Share:** Send SVG files or paste code
4. **I implement:** Convert to React components with full props
5. **Test:** Gallery page showing all variations
6. **Iterate:** Refine based on visual results

This approach gives you control over the design aesthetics while I handle the React/scaling implementation. Together we'll build a flexible, reusable library that works across all your projects!

Ready to start with the first shape? 🎨
