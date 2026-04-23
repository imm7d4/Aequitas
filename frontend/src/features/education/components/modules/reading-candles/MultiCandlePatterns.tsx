import React from 'react';

const MultiCandlePatterns: React.FC = () => {
    return (
        <section className="guide-section align-right">
            <div className="section-header">
                <span className="step-num">04</span>
                <h2>Two-Candle Patterns</h2>
            </div>
            <div className="glass-card">
                <h3>🔄 Bullish Engulfing</h3>
                <p>Small red candle followed by large green candle that completely "engulfs" previous body. Strong bullish reversal.</p>
            </div>
            <div className="glass-card darker">
                <h3>🔄 Bearish Engulfing</h3>
                <p>Small green candle followed by large red candle. Strong bearish reversal.</p>
            </div>

            <div className="section-header" style={{ marginTop: '3rem' }}>
                <span className="step-num">05</span>
                <h2>Three-Candle Patterns</h2>
            </div>
            <div className="glass-card">
                <h3>⭐ Morning Star</h3>
                <p>Large red → Small-bodied → Large green. Highly reliable bullish reversal.</p>
            </div>
            <div className="glass-card darker">
                <h3>🌙 Evening Star</h3>
                <p>Large green → Small-bodied → Large red. Highly reliable bearish reversal.</p>
            </div>
            <div className="glass-card">
                <h3>🎖️ Three White Soldiers</h3>
                <p>Three consecutive large green candles. Strong uptrend continuation.</p>
            </div>
        </section>
    );
};

export default MultiCandlePatterns;
