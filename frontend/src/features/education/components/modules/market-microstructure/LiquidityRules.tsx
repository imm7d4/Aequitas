import React from 'react';

const LiquidityRules: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">05</span>
                    <h2>Maker vs Taker</h2>
                </div>
                <div className="glass-card">
                    <p>Makers add liquidity (Limit orders). Takers consume it (Market orders). Exchanges incentivize Makers with lower fees/rebates.</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">07</span>
                    <h2>Order Flow Toxicity</h2>
                </div>
                <div className="glass-card">
                    <p>Toxic flow (Informed traders) predicts future price. Market makers widen spreads to protect themselves from toxic flow.</p>
                </div>
            </section>
        </>
    );
};

export default LiquidityRules;
