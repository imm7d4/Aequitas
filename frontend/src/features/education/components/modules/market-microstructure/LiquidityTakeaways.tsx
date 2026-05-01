import React from 'react';

const LiquidityTakeaways: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">07</span>
                    <h2>Liquidity Trading Strategies</h2>
                </div>
                <div className="glass-card">
                    <ul>
                        <li><strong>Wall Breakout:</strong> Large order absorption signals surge.</li>
                        <li><strong>Void Fade:</strong> Price spikes on low volume likely to reverse.</li>
                        <li><strong>Imbalance Scalping:</strong> Trade in direction of heavy volume pressure.</li>
                    </ul>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">08</span>
                    <h2>Key Takeaways</h2>
                </div>
                <div className="glass-card darker">
                    <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                        <li>✅ <strong>Check depth before sizing</strong></li>
                        <li>✅ <strong>Use limit orders</strong> in thin books</li>
                        <li>✅ <strong>Watch Imbalance Ratio</strong> for bias</li>
                        <li>✅ <strong>Avoid thin sessions</strong> (Lunch, Pre-market)</li>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default LiquidityTakeaways;
