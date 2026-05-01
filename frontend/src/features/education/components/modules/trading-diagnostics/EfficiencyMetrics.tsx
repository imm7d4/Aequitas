import React from 'react';

const EfficiencyMetrics: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">01</span>
                    <h2>Trade Path Efficiency</h2>
                </div>
                <p>The path your trade takes determines stress and efficiency. Clean moves with minimal drawdown vs sloppy moves with high drawdown.</p>
                <div className="glass-card">
                    <h4>Profit Capture Ratio</h4>
                    <p style={{ textAlign: 'center' }}><strong>Ratio = (Realized P&L / MFE) × 100</strong></p>
                    <p>Aim for 60%+. Below 40% suggests exit strategies need work.</p>
                </div>
            </section>
        </>
    );
};

export default EfficiencyMetrics;
