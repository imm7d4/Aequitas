import React from 'react';

const SingleCandlePatterns: React.FC = () => {
    return (
        <section className="guide-section">
            <div className="section-header">
                <span className="step-num">03</span>
                <h2>Single Candle Patterns</h2>
            </div>
            <p>Individual candles can provide powerful insights into market psychology.</p>

            <div className="glass-card">
                <h3>🔨 Hammer (Bullish Reversal)</h3>
                <p><strong>Appearance:</strong> Small body at the top, long lower wick (2-3x body size)</p>
                <p><strong>Psychology:</strong> Sellers pushed down hard, but buyers rejected lower prices strongly.</p>
                <div className="info-box tip">
                    <strong>Best Context:</strong> Appears after a downtrend, near support levels.
                </div>
            </div>

            <div className="glass-card darker">
                <h3>🌠 Shooting Star (Bearish Reversal)</h3>
                <p><strong>Appearance:</strong> Small body at the bottom, long upper wick (2-3x body size)</p>
                <p><strong>Psychology:</strong> Buyers pushed up hard, but sellers rejected higher prices strongly.</p>
            </div>

            <div className="glass-card">
                <h3>➕ Doji (Indecision)</h3>
                <p><strong>Appearance:</strong> Open and Close are nearly identical.</p>
                <p><strong>Types:</strong> Dragonfly (Bullish), Gravestone (Bearish), Long-legged (Extreme indecision).</p>
            </div>

            <div className="glass-card darker">
                <h3>🟩 Marubozu (Strong Conviction)</h3>
                <p><strong>Appearance:</strong> Large body with little to no wicks.</p>
                <p><strong>Signal:</strong> Strong continuation of current trend.</p>
            </div>
        </section>
    );
};

export default SingleCandlePatterns;
