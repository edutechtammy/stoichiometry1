# Reusable React Component Templates

This document describes the reusable React components created for Captivate-to-React conversion projects. Use this file as a reference or import it into future projects to guide component reuse and integration.

## Component List

- **SlideArea**: Displays the current slide's content (text, images, interactions).
- **Playbar**: Navigation controls (next, previous, play, pause, etc.).
- **TOC (Table of Contents)**: Allows navigation to different sections/slides.
- **Captions**: For accessibility and additional information.
- **Dialog**: For messages, quizzes, or feedback.
- **AssetLoader**: Handles loading of images, audio, video, and other media.

---

## Component Details

### SlideArea
- **Props:**
  - `slideData`: { text, images, interactions }
- **Purpose:** Renders the main content area for each slide.

### Playbar
- **Props:**
  - `navigationState`: { current, total }
  - `onNext`, `onPrev`, `onPlay`, `onPause`: callback functions
- **Purpose:** Provides navigation controls for the lesson.

### TOC
- **Props:**
  - `sections`: array of { id, title }
  - `onNavigate`: callback function
- **Purpose:** Renders a table of contents for quick navigation.

### Captions
- **Props:**
  - `text`: string
  - `visible`: boolean
- **Purpose:** Displays captions or subtitles for accessibility.

### Dialog
- **Props:**
  - `type`: string (e.g., 'quiz', 'message', etc.)
  - `message`: string
  - `onAction`: callback function
- **Purpose:** Shows dialogs or popups for messages, quizzes, or feedback.

### AssetLoader
- **Props:**
  - `manifest`: array of asset info
  - `onLoad`: callback function
- **Purpose:** Preloads and manages lesson assets (images, audio, video).

---

## Usage
- Import these components into your React project as needed.
- Pass the appropriate props to customize behavior and content.
- Extend or style components as required for your specific project.

---

*This file is intended for reuse and easy reference in future Captivate-to-React conversion projects.*
