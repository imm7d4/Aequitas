import React from 'react';

const CandleTradingStrategy: React.FC = () => {
    return (
        <section className="guide-section">
            <div className="section-header">
                <span className="step-num">07</span>
                <h2>Practical Trading Applications</h2>
            </div>

            <div className="glass-card">
                <h3>🎯 Entry Strategies</h3>
                <p><strong>Conservative:</strong> Wait for pattern completion + confirmation candle.</p>
                <p><strong>Aggressive:</strong> Enter during pattern formation (higher risk, better price).</p>
            </div>

            <div className="glass-card darker">
                <h3>🛡️ Stop Loss Placement</h3>
                <ul>
                    <li><strong>Hammer/Shooting Star:</strong> Below/Above the wick.</li>
                    <li><strong>Engulfing:</strong> Below/Above the engulfing candle.</li>
                </ul>
            </div>

            <div className="glass-card">
                <h3>🎯 Profit Targets</h3>
                <ul>
                    <li><strong>Risk-Reward Ratio:</strong> Aim for at least 2:1.</li>
                    <li><strong>Support/Resistance:</strong> Target the next major level.</li>
                </ul>
            </div>
        </section>
    );
};

export default CandleTradingStrategy;
