import React from 'react';

const LeverageGuidelinesSummary: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">08</span>
                    <h2>Leverage Guidelines</h2>
                </div>
                <div className="glass-card darker">
                    <ul>
                        <li>Beginner: 1x - 1.5x</li>
                        <li>Intermediate: 1.5x - 2.5x</li>
                        <li>Advanced: 2.5x - 3.5x</li>
                        <li>Professional: 3.5x - 5x</li>
                    </ul>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">09</span>
                    <h2>Key Takeaways</h2>
                </div>
                <div className="glass-card darker">
                    <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                        <li>✅ <strong>Leverage is a multiplier</strong> - Returns and losses</li>
                        <li>✅ <strong>Maintain margin</strong> - Watch 15% threshold</li>
                        <li>✅ <strong>Use conservative sizing</strong> - Don't use full power</li>
                        <li>✅ <strong>Mandatory SL</strong> - Crucial for leveraged trades</li>
                        <li>✅ <strong>Never average down</strong> - Cut losses instead</li>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default LeverageGuidelinesSummary;
