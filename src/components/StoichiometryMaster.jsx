import React from 'react';

/**
 * StoichiometryMaster - Simplified master slide with composite background
 * Uses single composite image (stoichiometry_ver2020.png) that includes:
 * - Chalkboard background
 * - Header equation image (orange banner)
 * - Sticky notes for "given" and "find" labels  
 * - Moles conversion diagram (blue boxes with "to" labels)
 * - Separator lines
 * - All z-index complexity resolved in single image
 * 
 * Used by slides teaching stoichiometry problem-solving
 */
const StoichiometryMaster = ({ children }) => {
    const publicUrl = process.env.PUBLIC_URL;

    return (
        <div
            style={{
                position: 'relative',
                width: '880px',
                height: '660px',
                backgroundImage: `url(${publicUrl}/assets/dr/stoichiometry_ver2020.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: 0
            }}
        >
            {/* Slide-specific content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {children}
            </div>
        </div>
    );
};

export default StoichiometryMaster;
