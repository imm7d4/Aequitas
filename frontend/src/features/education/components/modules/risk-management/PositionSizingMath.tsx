import React from 'react';

const PositionSizingMath: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">02</span>
                    <h2>Position Sizing Formula</h2>
                </div>
                <div className="glass-card darker">
                    <p style={{ textAlign: 'center' }}><strong>Shares = (Capital × Risk %) / (Entry - Stop Loss)</strong></p>
                    <div className="info-box tip">
                        This ensures you lose exactly your risk % if the stop is hit.
                    </div>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">08</span>
                    <h2>Risk-Reward Ratio</h2>
                </div>
                <div className="glass-card darker">
                    <p>Minimum acceptable: 1:2. Risk ₹1 to make ₹2. With 2:1, you only need 33% win rate to break even.</p>
                </div>
            </section>
        </>
    );
};

export default PositionSizingMath;
