import React from 'react';

const PerformanceTradeOffs: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">03</span>
                    <h2>Opportunity Cost Analysis</h2>
                </div>
                <div className="glass-card">
                    <h3>Measuring Missed Profits</h3>
                    <p>Profit left on the table by exiting too early. (Max Potential Profit - Actual Profit).</p>
                    <div className="info-box tip">
                        High opportunity cost? Consider using trailing stops!
                    </div>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">04</span>
                    <h2>Win Rate vs Average Win/Loss</h2>
                </div>
                <div className="glass-card darker">
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr><th>Win Rate</th><th>Avg Win</th><th>Avg Loss</th><th>Result</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>90%</td><td>₹100</td><td>₹1,000</td><td className="red">Losing</td></tr>
                            <tr><td>30%</td><td>₹3,000</td><td>₹500</td><td className="green">Winning</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
};

export default PerformanceTradeOffs;
