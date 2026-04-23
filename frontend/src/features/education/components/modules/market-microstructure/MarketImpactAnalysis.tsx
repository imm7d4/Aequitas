import React from 'react';

const MarketImpactAnalysis: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">03</span>
                    <h2>Market Impact: The Cost of Size</h2>
                </div>
                <div className="glass-card darker">
                    <p>Large orders "eat through" the book, getting progressively worse prices (slippage). Always match order size to market depth.</p>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">06</span>
                    <h2>Liquidity Voids & Flash Crashes</h2>
                </div>
                <div className="glass-card danger">
                    <p>Voids cause price to "teleport". Panic market orders hit empty book levels, crashing price in seconds. Strategy: Never use market orders in thin books.</p>
                </div>
            </section>
        </>
    );
};

export default MarketImpactAnalysis;
