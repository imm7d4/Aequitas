import React from 'react';

const PortfolioStrategy: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">04</span>
                    <h2>Portfolio Allocation</h2>
                </div>
                <div className="glass-card darker">
                    <h4>3-Tier Model</h4>
                    <ul>
                        <li>Tier 1: Core (50-60%)</li>
                        <li>Tier 2: Growth (30-40%)</li>
                        <li>Tier 3: Speculative (5-10%)</li>
                    </ul>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">05</span>
                    <h2>Correlation & Diversification</h2>
                </div>
                <div className="glass-card">
                    <p>Buying 5 tech stocks isn't diversification. Use sector-based allocation to reduce correlated risk.</p>
                </div>
            </section>
        </>
    );
};

export default PortfolioStrategy;
