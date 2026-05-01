import React from 'react';

const FeeAndSlippageImpact: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">04</span>
                    <h2>Fee Impact on P&L</h2>
                </div>
                <div className="glass-card darker">
                    <table style={{ width: '100%', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                <th>Trade Value</th>
                                <th>Actual Fee</th>
                                <th>Round Trip</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>₹10,000</td><td>₹3</td><td>₹6</td></tr>
                            <tr><td>₹1,00,000</td><td>₹20</td><td>₹40</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">05</span>
                    <h2>Slippage Impact</h2>
                </div>
                <div className="glass-card danger">
                    <p>Unrealized P&L is based on LTP, but market orders fill at Bid/Ask. This "slippage" reduces realized P&L.</p>
                </div>
            </section>
        </>
    );
};

export default FeeAndSlippageImpact;
