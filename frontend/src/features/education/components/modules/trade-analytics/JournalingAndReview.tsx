import React from 'react';

const JournalingAndReview: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">07</span>
                    <h2>The Trading Journal</h2>
                </div>
                <div className="glass-card">
                    <p>Essential fields: Pre-Trade (Setup, Reason), During (Emotions), Post-Trade (MAE, MFE, Lessons).</p>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">08</span>
                    <h2>Weekly Performance Review</h2>
                </div>
                <div className="glass-card darker">
                    <h4>Weekly Checklist</h4>
                    <ul>
                        <li>Calculate Win Rate, Expectancy, Drawdown</li>
                        <li>Ask: Did I follow my plan? Which setups worked?</li>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default JournalingAndReview;
