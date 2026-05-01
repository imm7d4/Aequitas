import React from 'react';

const RiskMistakes: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">01</span>
                    <h2>Trading Without a Stop Loss</h2>
                </div>
                <div className="glass-card danger">
                    <h3>❌ The Mistake</h3>
                    <p>Trading without a stop loss is driving without brakes. Disaster is inevitable.</p>
                </div>
                <div className="glass-card">
                    <h3>✅ The Solution</h3>
                    <p>Always set a stop loss BEFORE entry. Rule: Risk 1-2% of capital maximum per trade.</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">09</span>
                    <h2>Ignoring Position Sizing</h2>
                </div>
                <div className="glass-card danger">
                    <p>Risking 50% of capital on one "high conviction" trade is gambling. One wrong move wipes you out.</p>
                </div>
            </section>
        </>
    );
};

export default RiskMistakes;
