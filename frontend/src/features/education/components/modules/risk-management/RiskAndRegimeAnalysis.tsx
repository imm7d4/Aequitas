import React from 'react';

const RiskAndRegimeAnalysis: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">05</span>
                    <h2>Drawdown Analysis</h2>
                </div>
                <div className="glass-card">
                    <p>Drawdown measures decline from peak. Recovery math: 20% loss needs 25% gain; 50% loss needs 100% gain!</p>
                    <table style={{ width: '100%', marginTop: '1rem' }}>
                        <thead>
                            <tr><th>Drawdown</th><th>Severity</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>&lt; 10%</td><td>Normal</td></tr>
                            <tr><td>&gt; 30%</td><td className="red">Critical</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">06</span>
                    <h2>Strategy Regime Analysis</h2>
                </div>
                <div className="glass-card darker">
                    <div className="regime-grid">
                        <div className="regime-card">
                            <h4>Trending</h4>
                            <p>Best: Trend following. Avoid: Mean reversion.</p>
                        </div>
                        <div className="regime-card">
                            <h4>Sideways</h4>
                            <p>Best: Range trading. Avoid: Breakouts.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RiskAndRegimeAnalysis;
