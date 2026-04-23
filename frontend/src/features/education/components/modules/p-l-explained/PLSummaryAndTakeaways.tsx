import React from 'react';

const PLSummaryAndTakeaways: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">09</span>
                    <h2>Common P&L Mistakes</h2>
                </div>
                <div className="glass-card danger">
                    <h4>❌ Counting Unrealized Gains as Real Money</h4>
                    <p>MTM profit can disappear in seconds. Facts only when realized.</p>
                </div>
                <div className="glass-card danger">
                    <h4>❌ Ignoring Fees in Targets</h4>
                    <p>Must account for ₹40 round-trip and slippage buffers.</p>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">10</span>
                    <h2>Key Takeaways</h2>
                </div>
                <div className="glass-card darker">
                    <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                        <li>✅ Unrealized = Paper, Realized = Final</li>
                        <li>✅ Fees: 0.03% capped at ₹20 per side</li>
                        <li>✅ Slippage reduces your actual payout</li>
                        <li>✅ Short Selling formula is reversed</li>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default PLSummaryAndTakeaways;
