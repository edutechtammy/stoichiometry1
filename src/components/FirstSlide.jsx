import React from 'react';

/**
 * FirstSlide - Enhanced first slide with clickable navigation menu
 * Replicates the original Captivate behavior with graphical section navigation
 */
const FirstSlide = ({ slideData, onNavigate, onToggleTOC, onToggleCaptions }) => {

    // Navigation handlers for each section
    const handleLectureClick = () => {
        // Navigate to "Pre-requisite Skills" (slide index 1)
        onNavigate('Slide28137');
    };

    const handleNoteTakingClick = () => {
        // Navigate to "Givens and Finds" (slide index 2) 
        onNavigate('Slide33700');
    };

    const handleInteractivesClick = () => {
        // Navigate to "grams to moles" (slide index 11) - Try It Mode start
        onNavigate('Slide18443');
    };

    const handleMathSkillsClick = () => {
        // Navigate to "grams to moles" (slide index 11) - Try It Mode start
        onNavigate('Slide18443');
    };

    const handleGlossaryClick = () => {
        // Navigate to Glossary (slide index 24)
        onNavigate('Slide41450');
    };

    return (
        <div style={{
            position: 'relative',
            width: '880px',
            height: '660px',
            background: 'url("assets/dr/4016.png") no-repeat center center',
            backgroundSize: 'cover'
        }}>
            {/* Title */}
            {slideData.content.textCaptions.map((caption, index) => (
                caption.id === 'Text_Caption_51' && (
                    <div
                        key={caption.id}
                        style={{
                            position: 'absolute',
                            left: caption.position.x + 'px',
                            top: caption.position.y + 'px',
                            width: caption.position.width + 'px',
                            height: caption.position.height + 'px',
                            backgroundImage: `url("${caption.imagePath}")`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            zIndex: 2
                        }}
                    />
                )
            ))}

            {/* Select a mode text */}
            {slideData.content.textCaptions.map((caption, index) => (
                caption.id === 'Text_Caption_867' && (
                    <div
                        key={caption.id}
                        style={{
                            position: 'absolute',
                            left: caption.position.x + 'px',
                            top: caption.position.y + 'px',
                            width: caption.position.width + 'px',
                            height: caption.position.height + 'px',
                            backgroundImage: `url("${caption.imagePath}")`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            zIndex: 2
                        }}
                    />
                )
            ))}

            {/* Clickable section areas with hover effects */}

            {/* Lecture Section - Top Left */}
            <div
                onClick={handleLectureClick}
                style={{
                    position: 'absolute',
                    left: '75px',
                    top: '157px',
                    width: '206px',
                    height: '131px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid transparent',
                    zIndex: 10
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                    e.target.style.borderColor = '#667eea';
                    e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'transparent';
                    e.target.style.transform = 'scale(1)';
                }}
                title="Start Lecture Mode - Learn the fundamentals"
            />

            {/* Note-Taking Section - Top Middle */}
            <div
                onClick={handleNoteTakingClick}
                style={{
                    position: 'absolute',
                    left: '345px',
                    top: '148px',
                    width: '208px',
                    height: '148px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid transparent',
                    zIndex: 10
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                    e.target.style.borderColor = '#667eea';
                    e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'transparent';
                    e.target.style.transform = 'scale(1)';
                }}
                title="Lesson Content - Givens and Finds"
            />

            {/* Interactives Section - Top Right */}
            <div
                onClick={handleInteractivesClick}
                style={{
                    position: 'absolute',
                    left: '610px',
                    top: '160px',
                    width: '209px',
                    height: '139px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid transparent',
                    zIndex: 10
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                    e.target.style.borderColor = '#667eea';
                    e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'transparent';
                    e.target.style.transform = 'scale(1)';
                }}
                title="Try Interactive Activities and Labs"
            />

            {/* Math Skills Section - Bottom Left */}
            <div
                onClick={handleMathSkillsClick}
                style={{
                    position: 'absolute',
                    left: '76px',
                    top: '324px',
                    width: '206px',
                    height: '145px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid transparent',
                    zIndex: 10
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                    e.target.style.borderColor = '#667eea';
                    e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'transparent';
                    e.target.style.transform = 'scale(1)';
                }}
                title="Practice Math Skills and Try It Mode"
            />

            {/* Glossary Section - Bottom Middle */}
            <div
                onClick={handleGlossaryClick}
                style={{
                    position: 'absolute',
                    left: '267px',
                    top: '458px',
                    width: '214px',
                    height: '171px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid transparent',
                    zIndex: 10
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                    e.target.style.borderColor = '#667eea';
                    e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'transparent';
                    e.target.style.transform = 'scale(1)';
                }}
                title="Access Glossary of Terms"
            />

            {/* TOC Available notification - clickable */}
            <div
                onClick={onToggleTOC}
                style={{
                    position: 'absolute',
                    left: '650px',
                    top: '349px',
                    width: '177px',
                    height: '107px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid transparent',
                    zIndex: 10
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                    e.target.style.borderColor = '#667eea';
                    e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'transparent';
                    e.target.style.transform = 'scale(1)';
                }}
                title="Open Table of Contents"
            />

            {/* Closed Captioning notification - clickable */}
            <div
                onClick={onToggleCaptions}
                style={{
                    position: 'absolute',
                    left: '506px',
                    top: '464px',
                    width: '177px',
                    height: '132px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid transparent',
                    zIndex: 10
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                    e.target.style.borderColor = '#667eea';
                    e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'transparent';
                    e.target.style.transform = 'scale(1)';
                }}
                title="Toggle Closed Captions"
            />

            {/* Render all the background images and shapes */}
            {slideData.content.images.map((image, index) => (
                <div
                    key={image.id}
                    style={{
                        position: 'absolute',
                        left: image.position.x + 'px',
                        top: image.position.y + 'px',
                        width: image.position.width + 'px',
                        height: image.position.height + 'px',
                        backgroundImage: `url("${image.imagePath}")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        zIndex: 1
                    }}
                />
            ))}

            {slideData.content.shapes.map((shape, index) => (
                <div
                    key={shape.id}
                    style={{
                        position: 'absolute',
                        left: shape.position.x + 'px',
                        top: shape.position.y + 'px',
                        width: shape.position.width + 'px',
                        height: shape.position.height + 'px',
                        backgroundImage: `url("${shape.imagePath}")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        zIndex: shape.text ? 3 : 1
                    }}
                />
            ))}

            {/* Auto-advance countdown - will show the auto-start timer */}
            {slideData.content.textCaptions.map((caption, index) => (
                (caption.id.includes('_98') || caption.title.includes('4') || caption.title.includes('3') || caption.title.includes('2') || caption.title.includes('1')) && (
                    <div
                        key={caption.id}
                        style={{
                            position: 'absolute',
                            left: caption.position.x + 'px',
                            top: caption.position.y + 'px',
                            width: caption.position.width + 'px',
                            height: caption.position.height + 'px',
                            backgroundImage: `url("${caption.imagePath}")`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            zIndex: 4
                        }}
                    />
                )
            ))}
        </div>
    );
};

export default FirstSlide;