import React from 'react';

const IndicatorCategories: React.FC = () => {
    return (
        <section className="guide-section">
            <div className="section-header">
                <span className="step-num">01</span>
                <h2>Indicator Categories</h2>
            </div>
            <div className="glass-card">
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div className="cat-card success">
                        <h4>1. Trend</h4>
                        <p>Identify direction. Examples: Moving Averages, MACD.</p>
                    </div>
                    <div className="cat-card info">
                        <h4>2. Momentum</h4>
                        <p>Measure speed. Examples: RSI, Stochastics.</p>
                    </div>
                    <div className="cat-card warning">
                        <h4>3. Volatility</h4>
                        <p>Measure intensity. Examples: Bollinger Bands, ATR.</p>
                    </div>
                    <div className="cat-card primary">
                        <h4>4. Volume</h4>
                        <p>Confirm pressure. Examples: VWAP, OBV.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IndicatorCategories;
