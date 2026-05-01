import React from 'react';

const ExecutionFailures: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">02</span>
                    <h2>Reason 2: Price Never Reached Your Limit</h2>
                </div>
                <div className="glass-card danger">
                    <h3>❌ Price Gaps</h3>
                    <p>Price JUMPED from ₹502 directly to ₹498. It never traded at ₹500. Markets are discontinuous.</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">03</span>
                    <h2>Reason 3: Queue Position</h2>
                </div>
                <div className="glass-card danger">
                    <h3>❌ The Problem</h3>
                    <p>Earlier orders at the same price get filled first. You might be 10,000 shares back in the queue.</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">09</span>
                    <h2>Reason 9: Partial Fills</h2>
                </div>
                <div className="glass-card danger">
                    <p>Only some shares available at your price. Common in illiquid stocks or large orders.</p>
                </div>
            </section>
        </>
    );
};

export default ExecutionFailures;
