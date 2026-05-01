import React from 'react';

const MarginRules: React.FC = () => {
    return (
        <section className="guide-section">
            <div className="section-header">
                <span className="step-num">03</span>
                <h2>Margin Requirements</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="glass-card">
                    <h4 className="green">Initial Margin (20%)</h4>
                    <p>Cash needed to OPEN a position.</p>
                </div>
                <div className="glass-card">
                    <h4 className="yellow">Maintenance Margin (15%)</h4>
                    <p>Equity needed to KEEP it open.</p>
                </div>
            </div>
            <div className="glass-card danger" style={{ marginTop: '1rem' }}>
                <h4>Liquidation</h4>
                <p>Falling below 15% triggers a "Margin Call" and force-closing of positions.</p>
            </div>
        </section>
    );
};

export default MarginRules;
