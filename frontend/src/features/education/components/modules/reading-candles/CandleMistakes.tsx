import React from 'react';

const CandleMistakes: React.FC = () => {
    return (
        <section className="guide-section">
            <div className="section-header">
                <span className="step-num">08</span>
                <h2>Common Mistakes to Avoid</h2>
            </div>

            <div className="glass-card caution">
                <h3>❌ Mistake #1: Trading Every Pattern</h3>
                <p>Most patterns are just noise. Wait for <strong>high-quality setups</strong> with volume confirmation.</p>
            </div>

            <div className="glass-card caution">
                <h3>❌ Mistake #2: Ignoring the Trend</h3>
                <p>A bullish pattern in a strong downtrend is likely to fail. <strong>Trend is your friend.</strong></p>
            </div>

            <div className="glass-card caution">
                <h3>❌ Mistake #3: Wrong Timeframe</h3>
                <p>Focus on 15-minute or higher timeframes; 1-minute charts are unreliable.</p>
            </div>

            <div className="glass-card caution">
                <h3>❌ Mistake #4: No Stop Loss</h3>
                <p>Even the best patterns can fail. Always set a stop loss.</p>
            </div>
        </section>
    );
};

export default CandleMistakes;
