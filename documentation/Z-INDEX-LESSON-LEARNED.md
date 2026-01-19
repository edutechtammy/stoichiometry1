# Critical Z-Index Issue with Text Captions (January 17, 2026)

## Problem
Text captions (exported as PNG images from Captivate) were not visible in the React build despite:
- PNG files existing in `public/assets/dr/`
- Data structure in `slide-data.json` being correct with proper paths and positions
- React rendering code mapping over text captions correctly
- CSS class `.text-caption` having proper styling (`display: block`, `pointer-events: auto`)

### Symptoms
- Background image visible ✓
- Regular images (like illustrations) visible ✓
- Text caption PNG files exist and are valid ✓
- Text captions completely invisible ✗

## Root Cause
Text caption `<img>` elements were being rendered **behind the background image** due to missing z-index stacking context. The background image had a higher implicit z-index, causing all text captions to be hidden underneath it.

## Solution
Added explicit `zIndex: 3` to the inline styles of text caption images in `SlideArea.js`:

```javascript
{content.textCaptions && content.textCaptions.map((caption) => {
    if (!caption.position || !caption.imagePath) {
        console.warn('Text caption missing position or imagePath:', caption);
        return null;
    }
    
    const imgSrc = `/${caption.imagePath}`;
    console.log('Rendering text caption:', caption.id, 'src:', imgSrc, 'at', caption.position);
    
    return (
        <img
            key={caption.id}
            src={imgSrc}
            alt={caption.title}
            className="text-caption"
            style={{
                position: 'absolute',
                left: `${caption.position.x}px`,
                top: `${caption.position.y}px`,
                width: `${caption.position.width}px`,
                height: `${caption.position.height}px`,
                zIndex: 3  // CRITICAL: Ensures text appears above background
            }}
            onLoad={() => console.log('✓ Text caption loaded:', caption.id)}
            onError={(e) => console.error('✗ Text caption FAILED:', caption.id, imgSrc, e)}
        />
    );
})}
```

## Why CSS Alone Wasn't Sufficient
The CSS class `.text-caption` with `z-index: 3` in `SlideArea.css` was not enough because:
1. CSS z-index requires the element to have a positioning context (`position: relative/absolute/fixed`)
2. While we had `position: absolute` in CSS, the inline styles were overriding the stacking order
3. React's inline styles have higher specificity than external CSS
4. The inline `style` object needed the explicit `zIndex` property

## Impact
- **23 out of 25 slides** have text captions (ranging from 2 to 30 captions per slide)
- All text captions were invisible until this fix
- The fix applies to all slides automatically since it's in the shared `SlideArea.js` component

## Recommended Z-Index Hierarchy for Captivate Conversions

```
z-index: 1  → Background images
z-index: 2  → Regular content images (illustrations, photos)
z-index: 3  → Text captions (PNG text labels)
z-index: 4  → Click boxes (interactive areas)
z-index: 5  → Highlight boxes (visual emphasis)
z-index: 10 → UI overlays (badges, notifications)
```

## Key Takeaways for Future Conversions

### When converting Captivate text captions to React:

1. **Text captions are PNG images, not actual text elements**
   - Captivate exports text as rendered PNG images
   - They must be treated as `<img>` elements, not `<div>` with text

2. **Positioning is critical**
   - Require `position: absolute` for precise placement
   - X, Y, width, height come from Captivate's coordinate system

3. **Z-Index must be in inline styles**
   - CSS class z-index alone is insufficient
   - Inline `style` object needs explicit `zIndex` property
   - Use consistent z-index hierarchy across all element types

4. **Add debugging handlers**
   - `onLoad` handler confirms image loaded successfully
   - `onError` handler catches 404s or path issues
   - `console.log` the rendering to verify component is executing

5. **Verification steps when text is invisible:**
   - ✓ Check files exist: `ls public/assets/dr/Text_Caption_*.png`
   - ✓ Check data structure: Verify imagePath and position in JSON
   - ✓ Check browser console: Look for render/load/error messages
   - ✓ Check browser DevTools Elements: Inspect `<img>` z-index
   - ✓ Check browser DevTools Network: Verify PNG files load (200 status)
   - ✓ Check computed styles: Use DevTools to see actual z-index value

## Code Pattern to Copy for Future Projects

```javascript
// In SlideArea.js or similar component
{content.textCaptions && content.textCaptions.map((caption) => {
    if (!caption.position || !caption.imagePath) return null;
    
    return (
        <img
            key={caption.id}
            src={`/${caption.imagePath}`}
            alt={caption.title}
            className="text-caption"
            style={{
                position: 'absolute',
                left: `${caption.position.x}px`,
                top: `${caption.position.y}px`,
                width: `${caption.position.width}px`,
                height: `${caption.position.height}px`,
                zIndex: 3  // Always include explicit z-index
            }}
            onLoad={() => console.log('Text caption loaded:', caption.id)}
            onError={(e) => console.error('Text caption failed:', caption.id)}
        />
    );
})}
```

## Time Lost to This Issue
- **~1 hour** of debugging and verification
- Multiple server restarts
- File verification, data structure checks, code review
- Browser DevTools inspection

## Prevention for Next Time
1. **Start with z-index from the beginning** when implementing text captions
2. **Copy this exact pattern** from working code
3. **Add debug handlers immediately** (onLoad/onError) for faster diagnosis
4. **Test visibility early** - don't wait until end to check if text shows
5. **Keep this document** as reference for future Captivate conversions

---

**Status:** RESOLVED ✓  
**Date:** January 17, 2026  
**Verified:** Text captions now visible on slides 2, 3, 4, 11 and all other slides with text captions
