import React, { useState } from 'react';
import './ClickActivity.css';

const ClickActivity = ({ activityData }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [clickedBoxes, setClickedBoxes] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [completed, setCompleted] = useState(false);

    // Safety checks for data structure
    if (!activityData || !activityData.questions || activityData.questions.length === 0) {
        return (
            <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
                <h2>Click Activity</h2>
                <p>Activity data is not properly configured</p>
            </div>
        );
    }

    const question = activityData.questions[currentQuestion];
    const clickBoxes = question.boxes || question.clickBoxes || [];

    const handleBoxClick = (boxId) => {
        // Toggle clicked state
        if (clickedBoxes.includes(boxId)) {
            setClickedBoxes(clickedBoxes.filter(id => id !== boxId));
        } else {
            setClickedBoxes([...clickedBoxes, boxId]);
        }
        setShowFeedback(false);
    };

    const handleSubmit = () => {
        // Check if answer is correct based on the problem:
        // Q1: "A chemist makes 1.26 x 103 grams of NaNO3. How many moles is that?"
        //     Given: 1.26 x 103 grams NaNO3, Find: moles NaNO3 (same substance)
        //     Correct: Clickbox_given_1 (NaNO3), Click_Box_35 (moles NaNO3), Click_Box_44 (same)
        // Q2: "If you need 11.2 kg of N2H4, how many grams of H2O2 will be needed?"
        //     Given: N2H4, Find: H2O2 (different substances)
        //     Correct: Click_Box_40 (N2H4), Click_Box_41 (H2O2), Click_Box_42 (different)
        // Q3: "If you have 15.0 moles of NaNO2, how many grams will that be?"
        //     Given: 15.0 moles NaNO2, Find: grams NaNO2 (same substance)
        //     Correct: Click_Box_45 (NaNO2), Click_Box_43 (grams NaNO2), Click_Box_46 (same)

        let isCorrect = false;

        if (currentQuestion === 0) {
            // Question 1: Needs all three correct - given, find, and "same"
            const hasGiven = clickedBoxes.includes('Clickbox_given_1');
            const hasFind = clickedBoxes.includes('Click_Box_35');
            const hasSame = clickedBoxes.includes('Click_Box_44');
            isCorrect = hasGiven && hasFind && hasSame && clickedBoxes.length === 3;
        } else if (currentQuestion === 1) {
            // Question 2: Given N2H4, Find H2O2, different substances
            const hasGiven = clickedBoxes.includes('Click_Box_40');
            const hasFind = clickedBoxes.includes('Click_Box_41');
            const hasDifferent = clickedBoxes.includes('Click_Box_42');
            isCorrect = hasGiven && hasFind && hasDifferent && clickedBoxes.length === 3;
        } else if (currentQuestion === 2) {
            // Question 3: Given NaNO2, Find grams NaNO2, same substance
            const hasGiven = clickedBoxes.includes('Click_Box_45');
            const hasFind = clickedBoxes.includes('Click_Box_43');
            const hasSame = clickedBoxes.includes('Click_Box_46');
            isCorrect = hasGiven && hasFind && hasSame && clickedBoxes.length === 3;
        }

        if (isCorrect) {
            setFeedback('Correct! ✓');
            setShowFeedback(true);

            // Move to next question after short delay
            setTimeout(() => {
                if (currentQuestion < activityData.questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                    setClickedBoxes([]);
                    setShowFeedback(false);
                } else {
                    setCompleted(true);
                }
            }, 1500);
        } else {
            setFeedback('Please try again.');
            setShowFeedback(true);
        }
    };

    const handleReset = () => {
        setCurrentQuestion(0);
        setClickedBoxes([]);
        setFeedback('');
        setShowFeedback(false);
        setCompleted(false);
    };

    if (completed) {
        return (
            <div className="click-activity-complete">
                <h3>Activity Complete! 🎉</h3>
                <p>You've successfully completed all questions.</p>
                <button onClick={handleReset} className="reset-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="click-activity">
            <div className="activity-header">
                <h3>{question.prompt || question.text || "Click Activity"}</h3>
                <p className="question-counter">
                    Question {currentQuestion + 1} of {activityData.questions.length}
                </p>
            </div>

            <div className="click-area">
                {clickBoxes.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '10px',
                        padding: '20px',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        {clickBoxes.map((box, index) => (
                            <div
                                key={box.id}
                                className={`click-box ${clickedBoxes.includes(box.id) ? 'clicked' : ''}`}
                                style={{
                                    padding: '10px',
                                    backgroundColor: clickedBoxes.includes(box.id) ? '#4CAF50' : '#2196F3',
                                    color: 'white',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    minHeight: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => handleBoxClick(box.id)}
                                title={box.id}
                            >
                                {box.id.replace(/_/g, ' ').replace('Click Box', 'Option').replace('Clickbox', 'Click')}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
                        <p>No click boxes found for this activity</p>
                    </div>
                )}
            </div>

            <div className="activity-controls">
                <button
                    onClick={handleSubmit}
                    className="submit-button"
                    disabled={clickedBoxes.length === 0}
                >
                    Submit
                </button>
                <button onClick={handleReset} className="reset-button">
                    Reset Activity
                </button>
            </div>

            {showFeedback && (
                <div className={`feedback ${feedback.includes('Correct') ? 'success' : 'error'}`}>
                    {feedback}
                </div>
            )}
        </div>
    );
};

export default ClickActivity;
