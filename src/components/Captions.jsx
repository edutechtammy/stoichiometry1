import React from 'react';

const Captions = ({ text, position = 'bottom' }) => {
    return (
        <div style={{
            position: 'absolute',
            [position]: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '80%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            lineHeight: '1.5',
            zIndex: 1000,
            textAlign: 'center'
        }}>
            {text}
        </div>
    );
};

export default Captions;
