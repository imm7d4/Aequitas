import React from 'react';

const OrderBookAnalysis: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">04</span>
                    <h2>Measuring Market Depth</h2>
                </div>
                <div className="glass-card">
                    <p>Depth reveals how many shares sit at each level. Deep books absorb size safely; shallow books are risky and prone to slippage.</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">05</span>
                    <h2>Bid-Ask Imbalance</h2>
                </div>
                <div className="glass-card">
                    <p>Imbalance Ratio = Total Bid Qty / Total Ask Qty. Ratio &gt; 2.0 suggests heavy buy pressure; &lt; 0.5 suggests heavy sell pressure.</p>
                </div>
            </section>
        </>
    );
};

export default OrderBookAnalysis;
