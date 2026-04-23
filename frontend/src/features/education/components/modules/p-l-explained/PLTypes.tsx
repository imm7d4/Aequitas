import React from 'react';

const PLTypes: React.FC = () => {
    return (
        <section className="guide-section">
            <div className="section-header">
                <span className="step-num">01</span>
                <h2>The Two Types of P&L</h2>
            </div>
            <p>Every trade has two P&L states: <strong>Unrealized</strong> (floating) and <strong>Realized</strong> (locked in).</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                <div className="glass-card">
                    <h3 style={{ color: '#fbbf24' }}>📊 Unrealized P&L</h3>
                    <p>Profit/loss on open positions based on current market price. Not real money until you close.</p>
                </div>
                <div className="glass-card">
                    <h3 style={{ color: '#22c55e' }}>💰 Realized P&L</h3>
                    <p>Actual profit/loss from closed positions. Real money added to your account.</p>
                </div>
            </div>
        </section>
    );
};

export default PLTypes;
