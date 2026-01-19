// Reusable Dialog/Popup component
import React from 'react';

/**
 * Props:
 * - type: string (e.g., 'quiz', 'message', etc.)
 * - message: string
 * - onAction: function
 */
function Dialog({ type, message, onAction }) {
    return (
        <div className="dialog">
            {/* Render dialog content here */}
        </div>
    );
}

export default Dialog;
