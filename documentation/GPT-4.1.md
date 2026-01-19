## Main UI Component Extraction and Reusability (Ongoing)

### 1. Main UI Components Identified in Captivate Output
Based on analysis of `CPM.js` and related files, the following core UI components are present in most Captivate-published lessons:

- **Slide Area**: Displays the current slide's content (text, images, interactions).
- **Playbar**: Navigation controls (next, previous, play, pause, etc.).
- **Table of Contents (TOC)**: Allows navigation to different sections/slides.
- **Captions/Closed Captions (CC)**: For accessibility and additional information.
- **Dialogs/Popups**: For messages, quizzes, or feedback.
- **Asset Loader**: Handles loading of images, audio, video, and other media.

Each of these can be mapped to a React component, and their structure is similar across Captivate projects, making them reusable.

### 2. Reusable React Component Templates (for Future Projects)
For each UI component, create a generic React component with props for content, navigation, and callbacks. Example templates:

- `SlideArea`: Receives slide data (text, images, interactions) as props.
- `Playbar`: Receives navigation state and callback functions.
- `TOC`: Receives a list of slides/sections and navigation callbacks.
- `Captions`: Receives caption text and visibility state.
- `Dialog`: Receives dialog type, message, and action handlers.
- `AssetLoader`: Receives asset manifest and handles preloading.

These templates can be copied and adapted for each new Captivate-to-React conversion, saving significant time.

### 3. How the User Can Help for Future Projects
To maximize reuse and automation, you should provide the following for each new Captivate project:

- The full exported Captivate publish folder (including all assets, JS, and HTML files).
- Any custom widgets or scripts used in the lesson.
- A brief description of the lesson structure (number of slides, types of interactions, special features).
- Any preferences for navigation, styling, or accessibility.

If possible, highlight any unique or custom features that differ from a standard Captivate export. This helps tailor the React templates and extraction scripts.

---

**Next Steps:**
- Continue to break down how slide content and interactivity are stored in the Captivate output (especially in CPM.js).
- Propose a method for extracting this data and mapping it to the React component structure.
- Expand this section with code snippets and more detailed instructions as the process is refined.
# Captivate Publish Analysis (by GPT-4.1)

## Steps Taken for Analysis

1. **Reviewed Folder Structure**
   - Inspected the contents of the `Captivate Publish` directory to identify main files and subfolders.

2. **Examined Main Entry Point**
   - Read and analyzed `index.html` to understand the loading sequence, dependencies, and DOM structure.

3. **Identified Key Scripts and Styles**
   - Investigated the purpose of `standard.js`, `assets/js/CPXHRLoader.js`, and `assets/js/CPM.js`.
   - Noted the use of `assets/css/CPLibraryAll.css` and other CSS files for styling.

4. **Mapped Application Flow**
   - Traced how the lesson UI is dynamically constructed and how assets/scripts are loaded.
   - Identified the modular structure (main container, playbar, TOC, captions, etc.).

5. **Assessed Suitability for React Conversion**
   - Evaluated how the modular, dynamic DOM structure can be mapped to React components.
   - Noted the separation of concerns and dynamic asset loading as React-friendly patterns.

## Analysis Summary

- The Captivate lesson is built around a dynamic, JavaScript-driven UI loaded via `index.html`.
- Core logic and interactivity are handled by `CPM.js` and related scripts, with heavy use of dynamic DOM manipulation.
- The UI is modular, with clear separation of main content, navigation (playbar), table of contents (TOC), and captions.
- All assets (images, CSS, JS) are loaded dynamically, which can be replicated in React using component lifecycle methods and code splitting.
- The structure and logic are well-suited for conversion to a modern React application, with each UI section becoming a React component.

---

**Next Steps (for React Conversion):**
- Identify and extract main UI components (slides, playbar, TOC, captions, etc.).
- Map these to a React component hierarchy.
- Plan for extracting and migrating content (text, images, interactions) from Captivate output to React.

*This analysis provides a foundation for planning the migration from Captivate to a React-based lesson.*

## Further Breakdown: Main UI Components and Relationships

### 1. Identifying Main UI Components
Based on the Captivate output, the following main UI components are present:
- **Main Container**: Holds the entire lesson interface.
- **Slide Area**: Displays the current slide's content (text, images, interactions).
- **Playbar**: Navigation controls (next, previous, play, pause, etc.).
- **Table of Contents (TOC)**: Allows navigation to different sections/slides.
- **Captions/Closed Captions (CC)**: For accessibility and additional information.
- **Dialogs/Popups**: For messages, quizzes, or feedback.
- **Assets**: Images, audio, video, and other media.

### 2. Relationships and Data Flow
- The main container manages layout and coordinates between the playbar, TOC, and slide area.
- Navigation (via playbar or TOC) updates the slide area.
- Dialogs and popups are triggered by user actions or slide events.
- Assets are loaded as needed for each slide.

### 3. Types of Content and Interactivity
- **Static Content**: Text, images, diagrams.
- **Interactive Elements**: Quizzes, clickable areas, drag-and-drop, etc.
- **Media**: Audio narration, video clips.
- **Navigation**: Linear (next/prev) and non-linear (TOC, direct access).

### 4. Proposed React Component Hierarchy (Draft)
- `<App>` (root)
   - `<LessonContainer>`
      - `<Playbar />`
      - `<TOC />`
      - `<SlideArea>`
         - `<Slide />` (renders current slide)
            - `<SlideContent />` (text, images, media)
            - `<InteractiveElements />` (if present)
      - `<Captions />`
      - `<Dialog />` (conditional)

### 5. Challenges and Unknowns
- **Content Extraction**: Slide content and interactivity are embedded in JS/JSON or HTML. Need to determine how to extract and structure this for React.
- **State Management**: Navigation, progress, and interactivity will require a state management approach (React Context, Redux, or similar).
- **Accessibility**: Ensuring all interactive and media elements are accessible.
- **Media Handling**: Migrating audio/video and ensuring compatibility.
- **Widget Conversion**: Custom widgets/scripts may need to be rewritten as React components.

---

**Next Steps:**
- Investigate how slide content and interactivity are stored (likely in CPM.js or related files).
- Propose a strategy for extracting and structuring this content for use in React.
- Continue updating this document with findings, decisions, and recommendations.

*If you have preferences for state management, styling (CSS, CSS-in-JS, etc.), or want to prioritize certain features, let me know! Otherwise, I’ll proceed with best practices and document all options as we go.*

---

## Progress Update (January 17, 2026)

- Initialized a new React project (JavaScript) in `rebuild-to-html`.
- Created reusable React component templates for:
   - SlideArea
   - Playbar
   - TOC (Table of Contents)
   - Captions
   - Dialog
   - AssetLoader
- All components are located in `src/components/` and are structured for easy reuse in future Captivate-to-React conversions.

Next steps: Integrate these components into the main app, connect them to sample data, and begin planning content extraction from Captivate output.
