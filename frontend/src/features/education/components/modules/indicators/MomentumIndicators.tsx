import React from 'react';

const MomentumIndicators: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">04</span>
                    <h2>RSI: Relative Strength Index</h2>
                </div>
                <div className="glass-card darker">
                    <p>Range: 0-100. Overbought &gt; 70, Oversold &lt; 30. Watch for trend confirmation or reversals.</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">05</span>
                    <h2>MACD</h2>
                </div>
                <div className="glass-card">
                    <p>Difference between 12 and 26-period EMAs. Crosses and Histogram reveal momentum shifts. Watch for <strong>Divergence</strong> (Price vs MACD disagreement).</p>
                </div>
            </section>
        </>
    );
};

export default MomentumIndicators;
