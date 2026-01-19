import React from 'react';

const Playbar = ({ navigationState, onNext, onPrev, onPlay, onPause }) => {
    const { current, total, canGoBack, canGoForward, isPlaying } = navigationState;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
            backgroundColor: '#2c2c2c',
            color: 'white',
            borderTop: '1px solid #444'
        }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={onPrev}
                    disabled={!canGoBack}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: canGoBack ? '#4a90e2' : '#555',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: canGoBack ? 'pointer' : 'not-allowed'
                    }}
                >
                    ← Previous
                </button>

                <button
                    onClick={isPlaying ? onPause : onPlay}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#4a90e2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>

                <button
                    onClick={onNext}
                    disabled={!canGoForward}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: canGoForward ? '#4a90e2' : '#555',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: canGoForward ? 'pointer' : 'not-allowed'
                    }}
                >
                    Next →
                </button>
            </div>

            <div style={{ fontSize: '14px' }}>
                Slide {current} of {total}
            </div>
        </div>
    );
};

export default Playbar;
