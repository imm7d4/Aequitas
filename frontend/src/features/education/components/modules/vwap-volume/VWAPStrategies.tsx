import React from 'react';

const VWAPStrategies: React.FC = () => {
    return (
        <section className="guide-section align-right">
            <div className="section-header">
                <span className="step-num">03</span>
                <h2>Trading with VWAP</h2>
            </div>
            <div className="glass-card">
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div className="strategy success">
                        <h4>1. VWAP Bounce</h4>
                        <p>Pullback to VWAP in uptrend. Buy on bounce with volume.</p>
                    </div>
                    <div className="strategy info">
                        <h4>2. VWAP Breakout</h4>
                        <p>Consolidation below VWAP. Buy on sudden break with 2x volume.</p>
                    </div>
                    <div className="strategy warning">
                        <h4>3. VWAP Fade</h4>
                        <p>Price 2-3% extended from VWAP. Mean reversion trade.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VWAPStrategies;
