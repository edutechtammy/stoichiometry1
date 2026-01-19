import React, { useState } from 'react';
import './DragDropActivity.css';

/**
 * DragDropActivity - Drag and drop interactive component
 * For Activity 1 (Slide37499): Organize stoichiometry problem sections
 */
function DragDropActivity({ activity }) {
    const [draggedItem, setDraggedItem] = useState(null);
    const [droppedItems, setDroppedItems] = useState({});
    const [feedback, setFeedback] = useState(null);

    // Activity 1 configuration
    const sources = [
        { id: 'sec1', text: 'Section 1', correctTarget: 'target1' },
        { id: 'sec2', text: 'Section 2', correctTarget: 'target2' },
        { id: 'sec3', text: 'Section 3', correctTarget: 'target3' },
        { id: 'start1', text: 'Given / 1', correctTarget: 'target4' },
        { id: 'start2', text: 'Ratio', correctTarget: 'target5' },
        { id: 'start3', text: 'Another Ratio', correctTarget: 'target6' }
    ];

    const targets = [
        { id: 'target1', label: 'Grams to Moles' },
        { id: 'target2', label: 'Moles to Moles' },
        { id: 'target3', label: 'Moles to Grams' },
        { id: 'target4', label: 'Section 1 Start' },
        { id: 'target5', label: 'Section 2 Start' },
        { id: 'target6', label: 'Section 3 Start' }
    ];

    const handleDragStart = (e, source) => {
        setDraggedItem(source);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, target) => {
        e.preventDefault();
        if (!draggedItem) return;

        setDroppedItems(prev => ({
            ...prev,
            [target.id]: draggedItem
        }));
        setDraggedItem(null);
        setFeedback(null);
    };

    const checkAnswers = () => {
        let correct = 0;
        let total = sources.length;

        sources.forEach(source => {
            const dropped = Object.entries(droppedItems).find(
                ([targetId, item]) => item.id === source.id
            );
            if (dropped && dropped[0] === source.correctTarget) {
                correct++;
            }
        });

        if (correct === total) {
            setFeedback({ type: 'success', message: 'Perfect! All items are correctly placed.' });
        } else {
            setFeedback({ type: 'error', message: `${correct} of ${total} correct. Try again!` });
        }
    };

    const reset = () => {
        setDroppedItems({});
        setFeedback(null);
    };

    return (
        <div className="drag-drop-activity">
            <div className="activity-instructions">
                <h3>Drag and Drop Activity</h3>
                <p>Drag the correct 'section titles' and 'start with' items to the proper positions.</p>
            </div>

            {/* Sources (draggable items) */}
            <div className="drag-sources">
                <h4>Drag These:</h4>
                <div className="source-items">
                    {sources.map(source => {
                        const isDropped = Object.values(droppedItems).some(item => item.id === source.id);
                        return (
                            <div
                                key={source.id}
                                className={`draggable-item ${isDropped ? 'dropped' : ''}`}
                                draggable={!isDropped}
                                onDragStart={(e) => handleDragStart(e, source)}
                            >
                                {source.text}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Targets (drop zones) */}
            <div className="drop-targets">
                <h4>Drop Here:</h4>
                <div className="target-grid">
                    {targets.map(target => {
                        const droppedItem = droppedItems[target.id];
                        return (
                            <div
                                key={target.id}
                                className="drop-target"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, target)}
                            >
                                <div className="target-label">{target.label}</div>
                                {droppedItem && (
                                    <div className="dropped-item">
                                        {droppedItem.text}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="activity-controls">
                <button className="btn-check" onClick={checkAnswers}>Check Answers</button>
                <button className="btn-reset" onClick={reset}>Reset</button>
            </div>

            {/* Feedback */}
            {feedback && (
                <div className={`activity-feedback ${feedback.type}`}>
                    {feedback.message}
                </div>
            )}
        </div>
    );
}

export default DragDropActivity;
