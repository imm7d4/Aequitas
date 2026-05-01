import React from 'react';

const RiskPerTrade: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">01</span>
                    <h2>The Foundation: Risk Per Trade</h2>
                </div>
                <p>Rule: <strong>Never risk more than 1-2% of your total capital on a single trade.</strong></p>
                <div className="glass-card">
                    <h3>Why 1-2% Risk?</h3>
                    <p>Prevents "Ruin". With 1% risk, 20 losses leaves 80% capital. With 10% risk, you lose 65% capital!</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">03</span>
                    <h2>The Risk of Ruin</h2>
                </div>
                <div className="glass-card">
                    <p>Recovery is non-linear. 50% loss requires 100% gain to break even. Capital preservation is priority #1.</p>
                </div>
            </section>
        </>
    );
};

export default RiskPerTrade;
