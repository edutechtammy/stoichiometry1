import React from 'react';
import StoichiometryMaster from './StoichiometryMaster';
import BlankMaster from './BlankMaster';
import DragDropActivity from './DragDropActivity';
import ClickActivity from './ClickActivity';
import './SlideArea.css';

// Import slide-specific components
import Slide28137 from './slides/Slide28137';
import FirstSlide from './FirstSlide';

/**
 * SlideArea - Main rendering component for slides
 * Routes to appropriate slide component based on slide ID
 * Applies correct master slide (Blank or Stoichiometry)
 * Implements timing-based element visibility based on audio playback
 */
const SlideArea = ({ slideData, isPlaying, audioTime = 0, onNavigate, onToggleTOC, onToggleCaptions }) => {

    // Helper function to determine if element should be visible based on timing
    const isElementVisible = (element) => {
        // If no timing data, show element (backward compatibility)
        if (!element.startTime && !element.endTime) {
            return true;
        }

        // If not playing audio, show all elements
        if (!isPlaying) {
            return true;
        }

        // Check if current audio time is within element's visibility window
        const startTime = element.startTime || 0;
        const endTime = element.endTime || Infinity;

        return audioTime >= startTime && audioTime <= endTime;
    };

    // Helper function to calculate opacity for fade transitions
    const getElementOpacity = (element) => {
        if (!isPlaying || (!element.startTime && !element.endTime)) {
            return 1; // Full opacity if not using timing or not playing
        }

        const startTime = element.startTime || 0;
        const endTime = element.endTime || Infinity;
        const fadeInDuration = element.fadeInDuration || 0;
        const fadeOutDuration = element.fadeOutDuration || 0;

        let opacity = 1;

        // Handle fade in
        if (fadeInDuration > 0) {
            const fadeInEnd = startTime + fadeInDuration;
            if (audioTime >= startTime && audioTime <= fadeInEnd) {
                opacity = (audioTime - startTime) / fadeInDuration;
            }
        }

        // Handle fade out
        if (fadeOutDuration > 0) {
            const fadeOutStart = endTime - fadeOutDuration;
            if (audioTime >= fadeOutStart && audioTime <= endTime) {
                opacity = (endTime - audioTime) / fadeOutDuration;
            }
        }

        return Math.max(0, Math.min(1, opacity));
    };
    if (!slideData) {
        return (
            <div className="slide-area" style={{
                width: '880px',
                height: '660px',
                backgroundColor: '#40424e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
            }}>
                <p>No slide data available</p>
            </div>
        );
    }

    // Slides that should use Stoichiometry Master (based on Captivate data analysis)
    const stoichiometrySlides = [
        'Slide28137', 'Slide31383', 'Slide31809', 'Slide33288',
        'Slide33700', 'Slide33951', 'Slide37646', 'Slide39911',
        'Slide40210', 'Slide4755', 'Slide7173', 'Slide8701', 'Slide8887',
        'Slide9077', 'Slide9249', 'Slide18443', 'Slide22696', 'Slide23949',
        'Slide39593', 'Slide40393', 'Slide9421', 'Slide9593'
    ];

    const usesStoichiometryMaster = stoichiometrySlides.includes(slideData.id);

    // Debug logging
    console.log(`Rendering slide: ${slideData.id}, uses Stoichiometry: ${usesStoichiometryMaster}`);

    // Route to specific slide components
    const renderSlide = () => {
        switch (slideData.id) {
            case 'Slide3917':
                return (
                    <FirstSlide
                        slideData={slideData}
                        onNavigate={onNavigate}
                        onToggleTOC={onToggleTOC}
                        onToggleCaptions={onToggleCaptions}
                    />
                );

            case 'Slide28137':
                return <Slide28137 slideData={slideData} isPlaying={isPlaying} />;

            // Add more slide cases here as they're implemented
            default:
                // Handle different slide types
                if (slideData.type === 'drag-drop') {
                    const MasterComponent = usesStoichiometryMaster ? StoichiometryMaster : BlankMaster;
                    return (
                        <MasterComponent>
                            <DragDropActivity activity={slideData.interactions?.dragDrop} />
                        </MasterComponent>
                    );
                }

                if (slideData.type === 'click-activity') {
                    const MasterComponent = usesStoichiometryMaster ? StoichiometryMaster : BlankMaster;

                    // Check if we have proper activity data structure
                    const activityData = slideData.content?.clickBoxes ? {
                        questions: [
                            {
                                text: slideData.title || "Click Activity",
                                boxes: slideData.content.clickBoxes
                            }
                        ]
                    } : null;

                    return (
                        <MasterComponent>
                            {activityData ? (
                                <ClickActivity activityData={activityData} />
                            ) : (
                                <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
                                    <h2>{slideData.title}</h2>
                                    <p>Click Activity</p>
                                    <p>Activity data structure needs to be implemented</p>
                                    {slideData.content?.clickBoxes && (
                                        <p>Found {slideData.content.clickBoxes.length} click boxes</p>
                                    )}
                                </div>
                            )}
                        </MasterComponent>
                    );
                }

                if (slideData.type === 'walkthrough') {
                    const MasterComponent = usesStoichiometryMaster ? StoichiometryMaster : BlankMaster;
                    return (
                        <MasterComponent>
                            <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
                                <h2>{slideData.title}</h2>
                                <p>Walkthrough Slide</p>
                                <p>Interactive walkthrough content will be rendered here</p>
                            </div>
                            {/* Render positioned content elements */}
                            {slideData.content?.textCaptions?.map((caption, index) => (
                                caption.position && isElementVisible(caption) && (
                                    <img
                                        key={`caption-${caption.id || index}`}
                                        src={`/assets/dr/${caption.id}.png`}
                                        alt={caption.title || ''}
                                        style={{
                                            position: 'absolute',
                                            left: `${caption.position.x}px`,
                                            top: `${caption.position.y}px`,
                                            width: `${caption.position.width}px`,
                                            height: `${caption.position.height}px`,
                                            zIndex: 5,
                                            opacity: getElementOpacity(caption),
                                            transition: 'opacity 0.3s ease-in-out'
                                        }}
                                        onLoad={() => console.log(`✅ Loaded: ${caption.id}`)}
                                        onError={() => console.log(`❌ Failed to load: ${caption.id}`)}
                                    />
                                )
                            ))}
                        </MasterComponent>
                    );
                }

                // Default rendering for content slides
                const MasterComponent = usesStoichiometryMaster ? StoichiometryMaster : BlankMaster;
                console.log(`Using master: ${usesStoichiometryMaster ? 'StoichiometryMaster' : 'BlankMaster'}`);
                return (
                    <MasterComponent>
                        {/* Render positioned content elements */}
                        {slideData.content?.textCaptions?.map((caption, index) => (
                            caption.position && isElementVisible(caption) && (
                                <img
                                    key={`caption-${caption.id || index}`}
                                    src={`/assets/dr/${caption.id}.png`}
                                    alt={caption.title || ''}
                                    style={{
                                        position: 'absolute',
                                        left: `${caption.position.x}px`,
                                        top: `${caption.position.y}px`,
                                        width: `${caption.position.width}px`,
                                        height: `${caption.position.height}px`,
                                        zIndex: 5,
                                        opacity: getElementOpacity(caption),
                                        transition: 'opacity 0.3s ease-in-out'
                                    }}
                                    onLoad={() => console.log(`✅ Loaded: ${caption.id}`)}
                                    onError={() => console.log(`❌ Failed to load: ${caption.id}`)}
                                />
                            )
                        ))}

                        {/* Render positioned images */}
                        {slideData.content?.images?.map((image, index) => (
                            image.position && isElementVisible(image) && (
                                <img
                                    key={`image-${image.id || index}`}
                                    src={image.imagePath ? `/${image.imagePath}` : `/assets/dr/${image.id}.png`}
                                    alt={image.instance || ''}
                                    style={{
                                        position: 'absolute',
                                        left: `${image.position.x}px`,
                                        top: `${image.position.y}px`,
                                        width: `${image.position.width}px`,
                                        height: `${image.position.height}px`,
                                        zIndex: 3,
                                        opacity: getElementOpacity(image),
                                        transition: 'opacity 0.3s ease-in-out'
                                    }}
                                    onLoad={() => console.log(`✅ Loaded: ${image.imagePath || image.id}`)}
                                    onError={() => console.log(`❌ Failed to load: ${image.imagePath || image.id}`)}
                                />
                            )
                        ))}

                        {/* Render positioned shapes */}
                        {slideData.content?.shapes?.map((shape, index) => (
                            shape.position && isElementVisible(shape) && (
                                <img
                                    key={`shape-${shape.id || index}`}
                                    src={`/assets/dr/${shape.imagePath?.split('/').pop()}`}
                                    alt={shape.text || ''}
                                    style={{
                                        position: 'absolute',
                                        left: `${shape.position.x}px`,
                                        top: `${shape.position.y}px`,
                                        width: `${shape.position.width}px`,
                                        height: `${shape.position.height}px`,
                                        zIndex: 4,
                                        opacity: getElementOpacity(shape),
                                        transition: 'opacity 0.3s ease-in-out'
                                    }}
                                    onLoad={() => console.log(`✅ Loaded: ${shape.id}`)}
                                    onError={() => console.log(`❌ Failed to load: ${shape.id}`)}
                                />
                            )
                        ))}

                        {/* Debug info only in development */}
                        {process.env.NODE_ENV === 'development' && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                padding: '10px',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                fontSize: '12px',
                                borderRadius: '4px',
                                zIndex: 10
                            }}>
                                <div><strong>{slideData.title}</strong></div>
                                <div>ID: {slideData.id}</div>
                                <div>Type: {slideData.type}</div>
                                <div>Master: {usesStoichiometryMaster ? 'Stoichiometry' : 'Blank'}</div>
                                <div>Elements: {(slideData.content?.textCaptions?.length || 0) + (slideData.content?.images?.length || 0) + (slideData.content?.shapes?.length || 0)}</div>
                            </div>
                        )}
                    </MasterComponent>
                );
        }
    };

    return (
        <div className="slide-area" style={{
            position: 'relative',
            width: '880px',
            height: '660px',
            margin: '0 auto',
            overflow: 'hidden'
        }}>
            {renderSlide()}
        </div>
    );
};

export default SlideArea;
