import React from 'react';

/**
 * BlankMaster - Base master slide component
 * Renders the chalkboard grid background (dr/4016.png)
 * Used by slides that don't need Stoichiometry master elements
 * Dimensions: 880x660px
 */
const BlankMaster = ({ children }) => {
    return (
        <div
            className="blank-master"
            style={{
                position: 'absolute',
                width: '880px',
                height: '660px',
                top: 0,
                left: 0,
                backgroundImage: `url('${process.env.PUBLIC_URL}/assets/dr/4016.png')`,
                backgroundSize: '880px 660px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundColor: '#40424e',
                zIndex: 0
            }}
        >
            {children}
        </div>
    );
};

export default BlankMaster;
