import React from 'react';

const PLCalculations: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">02</span>
                    <h2>Unrealized P&L Calculation</h2>
                </div>
                <div className="glass-card">
                    <h3>The Formula</h3>
                    <p style={{ textAlign: 'center' }}><strong>(Current Price - Entry Price) × Quantity</strong></p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">03</span>
                    <h2>Realized P&L Calculation</h2>
                </div>
                <div className="glass-card danger">
                    <h3>Example with Fees</h3>
                    <p>Gross P&L - Fees (entry & exit commission) = Net Realized P&L.</p>
                    <p>Fees are 0.03% capped at ₹20 per side.</p>
                </div>
            </section>
        </>
    );
};

export default PLCalculations;
