import React from 'react';

export const SettlementSection: React.FC = () => (
    <section className="guide-section">
        <div className="section-header"><span className="step-num">04</span><h2>T+0 Settlement</h2></div>
        <div className="glass-card darker">
            <div className="real-vs-fake-grid">
                <div className="check-item fake"><h4>🐌 Traditional (T+2)</h4><p>Money locked for 2 days.</p></div>
                <div className="check-item real"><h4>⚡ Aequitas (T+0)</h4><p>Cash instantly available.</p></div>
            </div>
        </div>
    </section>
);

export const FeesSection: React.FC = () => (
    <section className="guide-section">
        <div className="section-header"><span className="step-num">05</span><h2>Trade Fees</h2></div>
        <div className="glass-card">
            <ul>
                <li><strong>Rate:</strong> 0.03% of value</li>
                <li><strong>Cap:</strong> ₹20 per trade</li>
            </ul>
        </div>
    </section>
);
