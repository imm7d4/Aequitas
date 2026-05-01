import React from 'react';

const VolumeAnalysisTakeaways: React.FC = () => {
    return (
        <section className="guide-section">
            <div className="section-header">
                <span className="step-num">08</span>
                <h2>Key Takeaways</h2>
            </div>
            <div className="glass-card darker">
                <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                    <li>✅ <strong>VWAP = Institutional Fair Value</strong></li>
                    <li>✅ <strong>Price \u003e VWAP is Bullish</strong></li>
                    <li>✅ <strong>POC acts as price magnet</strong></li>
                    <li>✅ <strong>LVN (Low Volume Node) = Fast movement</strong></li>
                    <li>✅ <strong>Volume confirms price intent</strong></li>
                    <li>✅ <strong>VWAP resets daily</strong></li>
                </ul>
            </div>
        </section>
    );
};

export default VolumeAnalysisTakeaways;
