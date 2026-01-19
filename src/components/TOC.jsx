import React from 'react';

const TOC = ({ sections, currentSlideId, onNavigate }) => {
    return (
        <div style={{
            backgroundColor: '#2c2c2c',
            padding: '20px',
            height: '100%',
            overflowY: 'auto',
            color: 'white'
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Table of Contents</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {sections && sections.map((section, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                        <button
                            onClick={() => onNavigate(section.navid || section.id)}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '10px',
                                backgroundColor: currentSlideId === (section.navid || section.id) ? '#4a90e2' : '#444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {section.label || section.title || `Section ${index + 1}`}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TOC;
