import React from 'react';

const MovingAverageGuide: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">02</span>
                    <h2>Moving Averages</h2>
                </div>
                <div className="glass-card darker">
                    <p>SMA (Simple) vs EMA (Exponential). EMA reacts faster to recent price changes. Common periods: 20, 50, 200.</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">03</span>
                    <h2>MA Crossovers</h2>
                </div>
                <div className="glass-card">
                    <h4>Golden Cross (Bullish)</h4>
                    <p>50-day crosses ABOVE 200-day MA.</p>
                    <h4>Death Cross (Bearish)</h4>
                    <p>50-day crosses BELOW 200-day MA.</p>
                </div>
            </section>
        </>
    );
};

export default MovingAverageGuide;
