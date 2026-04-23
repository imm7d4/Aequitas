import React from 'react';

const RejectionReasons: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">01</span>
                    <h2>Reason 1: Insufficient Funds</h2>
                </div>
                <div className="glass-card danger">
                    <h3>❌ The Problem</h3>
                    <p>Calculation: Base Cost + Market Buffer (1%) + Commission.</p>
                </div>
                <div className="glass-card">
                    <h3>✅ The Solution</h3>
                    <ul>
                        <li>Check available cash before placing orders</li>
                        <li>Account for the 1% buffer on market orders</li>
                    </ul>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">04</span>
                    <h2>Reason 4: Lot Size Violations</h2>
                </div>
                <div className="glass-card danger">
                    <h3>❌ The Problem</h3>
                    <p>Quantity must be a multiple of lot size (e.g., 100, 200, 300).</p>
                </div>
                <div className="glass-card">
                    <h3>✅ The Solution</h3>
                    <ul>
                        <li>Check lot size before placing orders</li>
                        <li>Round to nearest multiple</li>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default RejectionReasons;
