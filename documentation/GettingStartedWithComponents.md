# Getting Started with Reusable React Components

Welcome! This guide will help you use the reusable React components created for Captivate-to-React conversion projects. It’s designed for learners new to React, with simple examples and tips.

---

## What Are Props?
- **Props** (short for "properties") are how you pass data and functions into a React component.
- Think of them like attributes on an HTML tag, but more powerful.

Example:
```jsx
<Playbar navigationState={{ current: 1, total: 10 }} onNext={handleNext} />
```

---

## Example: Using the SlideArea Component

Suppose you want to show a slide with some text and an image. Here’s how you might use the `SlideArea` component:

```jsx
import SlideArea from './components/SlideArea';

const slideData = {
  text: 'Welcome to the lesson!',
  images: ['welcome.png'],
  interactions: []
};

function App() {
  return (
    <div>
      <SlideArea slideData={slideData} />
    </div>
  );
}
```

---

## Example: Using the Playbar Component

```jsx
import Playbar from './components/Playbar';

function App() {
  const navigationState = { current: 1, total: 10 };
  const handleNext = () => { /* go to next slide */ };
  const handlePrev = () => { /* go to previous slide */ };
  const handlePlay = () => { /* start playback */ };
  const handlePause = () => { /* pause playback */ };

  return (
    <Playbar
      navigationState={navigationState}
      onNext={handleNext}
      onPrev={handlePrev}
      onPlay={handlePlay}
      onPause={handlePause}
    />
  );
}
```

---

## Tips for New React Developers
- Start small: Try rendering one component at a time.
- Use the React docs (react.dev) for clear explanations and examples.
- Don’t worry about making mistakes—React’s fast feedback makes it easy to experiment.
- If you get stuck, ask for help or search for examples online.

---

*This file is meant to help you get comfortable using and customizing the reusable components in your React projects. Happy coding!*
