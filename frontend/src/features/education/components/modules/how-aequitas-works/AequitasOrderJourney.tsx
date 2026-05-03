import React from 'react';

export const OrderJourneySection: React.FC = () => (
    <section className="guide-section">
        <div className="section-header"><span className="step-num">01</span><h2>The Order Journey</h2></div>
        <div className="glass-card">
            <h3>🎯 Step 1: Order Validation</h3>
            <ul>
                <li><strong>Enough funds?</strong> Long needs 100%, Short needs 20%.</li>
                <li><strong>Price valid?</strong> Multiples of ₹0.05.</li>
                <li><strong>Stock tradable?</strong> Must be active.</li>
            </ul>
        </div>
        <div className="glass-card">
            <h3>⚡ Step 2: Funds Locked</h3>
            <p>Prevents double-spending of capital before matching.</p>
        </div>
    </section>
);

export const HeartbeatSection: React.FC = () => (
    <section className="guide-section align-right">
        <div className="section-header"><span className="step-num">02</span><h2>The 3-Second Heartbeat</h2></div>
        <div className="glass-card darker">
            <p>Aequitas uses a 3-second cycle for realistic price discovery and system efficiency.</p>
            <div className="clock-visual-container">
                <div className="ticker-animation"><div className="bar active"></div><div className="bar"></div><div className="bar"></div></div>
                <div className="caption">Match orders → Execute trades</div>
            </div>
        </div>
    </section>
);
