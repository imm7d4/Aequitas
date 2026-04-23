import React from 'react';

const CandleBasics: React.FC = () => {
    return (
        <section className="guide-section">
            <div className="section-header">
                <span className="step-num">01</span>
                <h2>What is a Candlestick?</h2>
            </div>
            <p>A candlestick is a visual representation of price movement over a specific time period. It packs <strong>four critical data points</strong> into one elegant shape.</p>

            <div className="glass-card">
                <h3>📊 The Four Price Points (OHLC)</h3>
                <div className="battle-report-anatomy">
                    <div className="report-item">
                        <strong>🔓 Open (O)</strong>
                        <span>The first price traded when the candle period started. Sets the baseline for the battle.</span>
                    </div>
                    <div className="report-item">
                        <strong>⬆️ High (H)</strong>
                        <span>The highest price reached during the entire period. Shows maximum buyer strength.</span>
                    </div>
                    <div className="report-item">
                        <strong>⬇️ Low (L)</strong>
                        <span>The lowest price reached during the entire period. Shows maximum seller pressure.</span>
                    </div>
                    <div className="report-item">
                        <strong>🔒 Close (C)</strong>
                        <span>The final price traded when the candle period ended. Determines who won the battle.</span>
                    </div>
                </div>
            </div>

            <div className="section-header" style={{ marginTop: '3rem' }}>
                <span className="step-num">02</span>
                <h2>Anatomy of a Candle</h2>
            </div>
            <div className="glass-card darker">
                <h3>🎯 The Body (Real Body)</h3>
                <p>The thick rectangular part. This shows the range between the <strong>Open</strong> and <strong>Close</strong> prices.</p>
                <div className="property-grid">
                    <div className="prop-card">
                        <h4>🟢 Green/Bullish</h4>
                        <p><strong>Close &gt; Open</strong></p>
                        <p>The price moved UP. Buyers were in control.</p>
                    </div>
                    <div className="prop-card warning">
                        <h4>🔴 Red/Bearish</h4>
                        <p><strong>Close &lt; Open</strong></p>
                        <p>The price moved DOWN. Sellers were in control.</p>
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <h3>📏 The Wicks (Shadows)</h3>
                <p>The thin lines showing <strong>extreme price levels</strong> that were tested but not sustained.</p>
                <div className="math-grid-dense">
                    <div className="math-card">
                        <h4>Upper Wick</h4>
                        <p>Shows how high buyers pushed before sellers pushed back.</p>
                    </div>
                    <div className="math-card">
                        <h4>Lower Wick</h4>
                        <p>Shows how low sellers pushed before buyers pushed back.</p>
                    </div>
                </div>
                <div className="info-box warning">
                    <strong>⚠️ Wick Psychology:</strong> Long wicks represent <strong>rejection</strong>.
                </div>
            </div>
        </section>
    );
};

export default CandleBasics;
