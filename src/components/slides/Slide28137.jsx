import React from 'react';
import StoichiometryMaster from '../StoichiometryMaster';

/**
 * Slide28137 - Pre-requisite Skills
 * Uses StoichiometryMaster to display problem-solving framework
 * 
 * Content: List of prerequisite skills needed for stoichiometry
 * - scientific notation
 * - significant digits
 * - balance chemical equations
 * - compute the amu of the molecule
 * - algebra
 */
const Slide28137 = ({ slideData, isPlaying }) => {
    return (
        <StoichiometryMaster>
            {/* Slide-specific content goes here */}
            <div className="slide-content" style={{
                position: 'absolute',
                left: '272px',
                top: '293px',
                width: '316px',
                zIndex: 10
            }}>
                {/* Title: "pre-requisite skills" */}
                <div style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                    pre-requisite skills
                </div>

                {/* Skills list */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    color: 'white',
                    fontSize: '18px'
                }}>
                    <div style={{
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                        algebra
                    </div>

                    <div style={{
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                        scientific notation
                    </div>

                    <div style={{
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                        significant digits
                    </div>

                    <div style={{
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                        compute the amu of the molecule
                    </div>

                    <div style={{
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                        balance chemical equations
                    </div>
                </div>
            </div>

            {/* Next button placeholder - position from Captivate data */}
            <button
                style={{
                    position: 'absolute',
                    left: '737px',
                    top: '589px',
                    width: '101px',
                    height: '28px',
                    backgroundColor: '#4a90e2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    zIndex: 10
                }}
                onClick={() => console.log('Next slide')}
            >
                Next →
            </button>
        </StoichiometryMaster>
    );
};

export default Slide28137;
