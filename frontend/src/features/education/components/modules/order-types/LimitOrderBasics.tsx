import React from 'react';

const LimitOrderBasics: React.FC = () => {
    return (
        <section className="guide-section">
            <h2>The Patient Execution (Liquidity Maker)</h2>
            <p className="large-text">A Limit order says: <strong>"I will only buy/sell if the price reaches X or better."</strong></p>

            <div className="formula-block">
                <h3>Price Improvement Rule</h3>
                <p className="math">If Limit Price ≥ Market Price (for BUY)</p>
                <p className="math">Then Fill Price = Market Price (better execution)</p>
                <p>If you set a Limit Buy @ ₹100, but the market price (LTP) is ₹98, Aequitas will fill you at ₹98. This is the <strong>Best Execution Guarantee</strong>.</p>
            </div>

            <div className="architecture-diagram-custom">
                <h3>The Queue System</h3>
                <div className="queue-visual">
                    <div className="service-node">
                        <h4>Order Placement</h4>
                        <p>Status: <span className="status-badge pending">PENDING</span></p>
                    </div>
                    <div className="connector">→</div>
                    <div className="service-node">
                        <h4>Price-Time Priority</h4>
                        <p><strong>Price:</strong> Better prices get priority</p>
                    </div>
                    <div className="connector">→</div>
                    <div className="service-node hotspot">
                        <h4>Matching Engine</h4>
                        <p>Checks every 3 seconds</p>
                    </div>
                </div>
            </div>

            <div className="glass-card darker">
                <h3>Validity Types</h3>
                <div className="validity-comparison">
                    <div className="validity-card">
                        <h4>IOC (Immediate or Cancel)</h4>
                        <p>Single 3-second cycle matching. Auto-cancels if not filled.</p>
                    </div>
                    <div className="validity-card">
                        <h4>DAY</h4>
                        <p>Until market close (3:30 PM). Stays active all day.</p>
                    </div>
                    <div className="validity-card">
                        <h4>GTC (Good Till Cancelled)</h4>
                        <p>Persists across days until manually cancelled.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LimitOrderBasics;
