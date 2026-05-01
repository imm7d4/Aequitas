import React from 'react';

const LiquidityBasics: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">01</span>
                    <h2>What is Liquidity?</h2>
                </div>
                <p>Ability to trade quickly without affecting price. High liquidity (Reliance) vs Low liquidity (Small-caps).</p>
                <div className="glass-card">
                    <h3>Bid-Ask Spread: The Liquidity Tax</h3>
                    <p>Spread % = ((Ask - Bid) / Ask) × 100. Tight (0.02%) vs Wide (2%+). Wide spreads make trading unprofitable.</p>
                </div>
            </section>
        </>
    );
};

export default LiquidityBasics;
