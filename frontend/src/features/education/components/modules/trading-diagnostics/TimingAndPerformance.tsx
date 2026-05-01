import React from 'react';

const TimingAndPerformance: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">05</span>
                    <h2>Entry Quality & Hold Time</h2>
                </div>
                <div className="glass-card">
                    <p>Excellent Entry: MAE \u003c Stop Distance. Poor Entry: MAE \u003e Stop Distance.</p>
                    <p style={{ marginTop: '1rem' }}><strong>Hold Time:</strong> Winners should be held longer than losers. Professional ratio: 2:1 winner/loser hold time.</p>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">06</span>
                    <h2>Win Rate vs Profit Factor</h2>
                </div>
                <div className="glass-card darker">
                    <p>Win rate is meaningless without Profit Factor. Target PF \u003e 1.5. A 40% win rate can be highly profitable if losses are small.</p>
                </div>
            </section>
        </>
    );
};

export default TimingAndPerformance;
