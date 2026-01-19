# AI Session Handoff - Master Slide Issue

**Date:** January 18, 2026  
**Status:** WIP - Critical bug blocking 24 of 25 slides  
**Last Commit:** 65e808c "WIP: Master slide integration"

---

## 🚨 THE PROBLEM

**Only Slide 9 (Slide40210) renders with the Stoichiometry master slide.**  
All other slides that should show the Stoichiometry master (sticky notes + moles diagram) are showing just the blank chalkboard background.

---

## ✅ WHAT WORKS

### Slide28137 (Slide 2) - **THE WORKING EXAMPLE**
- Custom component: `/rebuild-to-html/rebuild-to-html/src/components/slides/Slide28137.jsx`
- Returns `<StoichiometryMaster>` directly with content as children
- **Renders perfectly** - sticky notes, moles diagram, all elements visible

### Master Slide Components
All exist with correct image paths (`/assets/dr/`):
- **BlankMaster.jsx** - Chalkboard background (880x660px, dr/4016.png)
- **StoichiometryMaster.jsx** - Extends BlankMaster, adds:
  - Header equation banner (dr/4044_785_271.png)
  - "given" sticky note top-left (dr/4039_96_97.png)
  - "find" sticky note top-right (dr/4034_96_97.png)
  - Gradient overlay for contrast
  - 3-section moles diagram (grams→moles→moles→moles→grams)

### Current Layout
- ✅ All slides position correctly at top-left corner
- ✅ Main playbar below slides (App.js footer)
- ✅ Navigation working
- ⚠️ AudioPlayer visibility unknown (was moved during debugging)

---

## 📋 SLIDES REQUIRING STOICHIOMETRY MASTER (25 total)

Identified via grep of `Captivate Publish/assets/js/CPM.js` for sticky note image references:

```
Slide3917, Slide28137, Slide31383, Slide31809, Slide33288, Slide33700, 
Slide33951, Slide37499, Slide37646, Slide39911, Slide40210, Slide4755, 
Slide7173, Slide8701, Slide8887, Slide9077, Slide9249, Slide18443, 
Slide22696, Slide23949, Slide39593, Slide40393, Slide41450, Slide9421, Slide9593
```

**User confirmed these slides need the framework in priority order:**
- Slide 2 (Slide28137) ✅ WORKS
- Slide 7
- Slides 12-18
- Slide 9 (Slide40210) ✅ WORKS (mysteriously)

---

## 🔍 ROOT CAUSE THEORY

**Slide28137 bypasses SlideArea's default rendering logic.**

Current SlideArea.js structure:
```javascript
// Line 57: Special case for Slide28137
if (slideData.id === 'Slide28137') {
    return <Slide28137 slideData={slideData} isPlaying={isPlaying} />;
}

// Lines 77-80: Default rendering with conditional master
const stoichiometrySlides = [/* array of 25 IDs */];
const usesStoichiometryMaster = stoichiometrySlides.includes(slideData.id);
const MasterComponent = usesStoichiometryMaster ? StoichiometryMaster : BlankMaster;
return (
    <>
        <MasterComponent>
            {/* content elements mapped here */}
        </MasterComponent>
        {/* AudioPlayer */}
    </>
);
```

**Debug logging added** (lines 48 & 79):
- `🎯 Rendering slide: ${slideData.id}, uses Stoichiometry: ${usesStoichiometryMaster}`
- `📋 Using master: ${usesStoichiometryMaster ? 'StoichiometryMaster' : 'BlankMaster'}`

**Next session should check browser console** to see if:
1. Conditional is executing for all slides
2. Boolean value is correct
3. Component assignment is working

---

## ❌ WHAT WE TRIED (DON'T REPEAT)

### Failed Approaches - All Caused Cascading Issues:
1. **Slide-area wrapper positioning** - Pushed content off-screen
2. **Multiple nested containers** - Created positioning conflicts
3. **Moving AudioPlayer inside/outside MasterComponent** - Lost visibility
4. **Inline styles on outer divs** - Broke playbar positioning
5. **Adding/removing absolute positioning** - Created layout chaos

### The Problem Pattern:
Every fix for positioning broke something else. We iterated 5+ times, each change introducing new bugs.

**DO NOT iterate on positioning/layout!**

---

## 💡 RECOMMENDED NEXT APPROACH

### Option A: Copy Slide28137's Pattern (SAFEST)
Create custom components for all 25 stoichiometry slides that return `<StoichiometryMaster>` directly.

**Pros:** Known to work, matches Captivate's individual slide approach  
**Cons:** 25 files to create (but could script this)

### Option B: Debug Default Rendering Path (RISKIEST)
Find why SlideArea's conditional master assignment fails.

**Steps:**
1. Check browser console for debug logs
2. Compare SlideArea.js return structure vs Slide28137.jsx
3. Test if `MasterComponent` variable actually contains the right component
4. Check if fragment wrapper `<>` is causing issues

**Risk:** High chance of creating positioning bugs again

### Option C: Hybrid Approach
Fix 5-10 priority slides with custom components first, then debug the default path.

---

## 📁 CRITICAL FILES

### Primary Investigation:
```
/rebuild-to-html/rebuild-to-html/src/components/SlideArea.js
  - Lines 30-45: stoichiometrySlides array
  - Lines 57-60: Slide28137 special case
  - Lines 77-82: Default master selection logic

/rebuild-to-html/rebuild-to-html/src/components/slides/Slide28137.jsx
  - THE WORKING EXAMPLE - study this structure

/rebuild-to-html/rebuild-to-html/src/components/StoichiometryMaster.jsx
  - The component itself (working correctly)
```

### Supporting:
```
/rebuild-to-html/rebuild-to-html/src/data/slide-data.json
  - All 25 slides with metadata and content arrays

/rebuild-to-html/rebuild-to-html/src/App.js
  - Main app structure, shows how SlideArea is called
```

---

## 🎯 SUCCESS CRITERIA

When fixed, user should see:
- ✅ Sticky notes ("given" and "find") on 25 slides
- ✅ Moles conversion diagram visible
- ✅ Header equation banner present
- ✅ Content positioned correctly over framework
- ✅ Slides stay at top-left corner
- ✅ Playbar remains below slides
- ✅ AudioPlayer visible when slides have audio

---

## 🔧 DEVELOPMENT ENVIRONMENT

**Server:** 
```bash
cd "/Volumes/LaCie 2/00_Development/01_Repositories/Stoichiometry/rebuild-to-html/rebuild-to-html"
npm start
# Runs at http://localhost:3000
```

**Hot Reload:** Working (as of last session)  
**Port:** 3000  
**Terminal kills:** Background node process, may need `lsof -ti:3000 | xargs kill -9`

**GitHub:**
- Repo: https://github.com/edutechtammy/stoichiometry1
- Branch: main
- All work backed up as of 65e808c

---

## 🧭 CONTEXT FOR NEXT SESSION

### What User Knows:
- Basic React concepts
- How to run npm commands
- Git add/commit/push workflow
- Where files are located

### What User Doesn't Know:
- Deep React component lifecycle
- Why positioning kept breaking
- JavaScript debugging techniques

### User's Priority:
**Get the master slides showing** - visual framework is critical for learning.  
User is okay with 25 custom components if that's the reliable path.

### Session ended because:
Iteration spiral on positioning - each fix broke something else. Decided to pause, backup to GitHub, and start fresh with clear head.

---

**FINAL NOTE:** The mystery of why Slide 9 works through default rendering but others don't is a clue. Before making any changes, investigate what makes Slide 9 special in the code or data.
