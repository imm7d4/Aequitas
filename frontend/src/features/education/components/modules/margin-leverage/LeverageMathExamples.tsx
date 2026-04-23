import React from 'react';

const LeverageMathExamples: React.FC = () => {
    return (
        <section className="guide-section">
            <div className="section-header">
                <span className="step-num">04</span>
                <h2>Leverage Math</h2>
            </div>
            <div className="glass-card">
                <h4>Amplification</h4>
                <p>5x Leverage: 2% profit becomes 10% gain. 2% loss becomes 10% loss.</p>
            </div>
            <div className="glass-card danger" style={{ marginTop: '1rem' }}>
                <h4>The Disaster Scenario</h4>
                <p>8% stock drop with 5x leverage wipes out 40% of capital. With 2x leverage, only 16% is lost.</p>
            </div>
        </section>
    );
};

export default LeverageMathExamples;
