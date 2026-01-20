
import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import SlideArea from './components/SlideArea';
import Playbar from './components/Playbar';
import TOC from './components/TOC';
import Captions from './components/Captions';
import AssetLoader from './components/AssetLoader';
import AudioPlayer from './components/AudioPlayer';

// Import extracted Captivate data
import lessonData from './data/slide-data.json';

function App() {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [assetsLoaded, setAssetsLoaded] = useState(false);
    const [showTOC, setShowTOC] = useState(false);
    const [showCaptions, setShowCaptions] = useState(false);
    const [audioTime, setAudioTime] = useState(0);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    const currentSlide = lessonData.slides[currentSlideIndex];
    const totalSlides = lessonData.slides.length;

    // Navigation handlers
    const handleNext = () => {
        if (currentSlideIndex < totalSlides - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
            setIsPlaying(true);
        }
    };

    const handlePrev = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
            setIsPlaying(true);
        }
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleNavigate = (navId) => {
        const slideIndex = lessonData.slides.findIndex(slide => slide.navId === navId);
        if (slideIndex !== -1) {
            setCurrentSlideIndex(slideIndex);
            setIsPlaying(true);
        }
    };

    const handleAssetsLoaded = () => {
        setAssetsLoaded(true);
        console.log('All assets loaded successfully');
    };

    // Handle audio play state changes
    const handleAudioPlayStateChange = (playing) => {
        setIsAudioPlaying(playing);
    };

    // Handle audio ending - auto-advance to next slide
    const handleAudioEnded = () => {
        // Don't auto-advance on activity slides
        const isActivitySlide = currentSlide?.type === 'drag-drop' || currentSlide?.type === 'click-activity';

        if (!isActivitySlide) {
            if (currentSlideIndex < totalSlides - 1) {
                setCurrentSlideIndex(currentSlideIndex + 1);
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
            }
        }
    };

    // Pause on activity slides
    useEffect(() => {
        if (isPlaying && currentSlide) {
            const isActivitySlide = currentSlide.type === 'drag-drop' || currentSlide.type === 'click-activity';
            if (isActivitySlide) {
                setIsPlaying(false);
            }
        }
    }, [currentSlide, isPlaying]);

    return (
        <div className="App">
            {/* Asset Preloader */}
            <AssetLoader
                images={lessonData.assets.images}
                audio={lessonData.assets.audio}
                onLoadComplete={handleAssetsLoaded}
            />

            {/* Header */}
            <header className="app-header">
                <h1>{lessonData.metadata.title}</h1>
                <div className="header-controls">
                    <button onClick={() => setShowTOC(!showTOC)}>
                        📑 Table of Contents
                    </button>
                    <button onClick={() => setShowCaptions(!showCaptions)}>
                        💬 Captions
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="app-content">
                {/* Table of Contents Sidebar */}
                {showTOC && (
                    <div className="toc-sidebar">
                        <TOC
                            sections={lessonData.slides}
                            currentSlideId={currentSlide?.navId}
                            onNavigate={handleNavigate}
                            groups={[
                                // Title slide (root level, always visible)
                                { title: null, startIndex: 0, endIndex: 0 },
                                // Lesson Mode (collapsible group)
                                { title: 'Lesson Mode', startIndex: 1, endIndex: 10 },
                                // Try It Mode (collapsible group) - grams to moles through grams to grams
                                { title: 'Try It Mode', startIndex: 11, endIndex: 21 },
                                // Remaining slides at root level (Periodic Table, Summary, Glossary)
                                { title: null, startIndex: 22, endIndex: 24 }
                            ]}
                        />
                    </div>
                )}

                {/* Slide Area */}
                <main className="main-content">
                    {assetsLoaded ? (
                        <SlideArea
                            slideData={currentSlide}
                            isPlaying={isPlaying}
                            audioTime={audioTime}
                            onNavigate={handleNavigate}
                            onToggleTOC={() => setShowTOC(!showTOC)}
                            onToggleCaptions={() => setShowCaptions(!showCaptions)}
                        />
                    ) : (
                        <div className="loading-screen">
                            <p>Loading lesson assets...</p>
                            <p className="loading-details">
                                {lessonData.assets.images.length} images, {lessonData.assets.audio.length} audio files
                            </p>
                        </div>
                    )}

                    {/* Captions Overlay */}
                    {showCaptions && currentSlide && (
                        <Captions
                            text={currentSlide.content.textCaptions.map(tc => tc.title).join(' ')}
                            position="bottom"
                        />
                    )}
                </main>
            </div>

            {/* Audio Player - positioned below slides, outside flex container */}
            {assetsLoaded && currentSlide?.audio && currentSlide.audio.length > 0 && (
                <div className={`audio-player-container ${showTOC ? 'with-toc' : ''}`}>
                    <AudioPlayer
                        audioFiles={currentSlide.audio}
                        autoplay={isPlaying}
                        onTimeUpdate={setAudioTime}
                        onPlayStateChange={handleAudioPlayStateChange}
                        onAudioEnded={handleAudioEnded}
                    />
                </div>
            )}

            {/* Playbar */}
            <footer className="app-footer">
                <Playbar
                    navigationState={{
                        current: currentSlideIndex + 1,
                        total: totalSlides,
                        canGoBack: currentSlideIndex > 0,
                        canGoForward: currentSlideIndex < totalSlides - 1,
                        isPlaying: isPlaying
                    }}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onPlay={handlePlay}
                    onPause={handlePause}
                />
            </footer>

            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
                <div className="debug-info">
                    <p><strong>Slide:</strong> {currentSlide?.id} ({currentSlide?.type})</p>
                    <p><strong>Duration:</strong> {currentSlide?.durationInSeconds}s</p>
                    <p><strong>Elements:</strong> {Object.keys(currentSlide?.content || {}).length} types</p>
                </div>
            )}
        </div>
    );
}

export default App;
