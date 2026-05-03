import React from 'react';

export const ShortSqueezeSection: React.FC = () => (
    <div className="example-box danger">
        <h3>The Short Squeeze: When Shorts Get Trapped</h3>
        <p>A short squeeze occurs when a heavily shorted stock starts rising, forcing shorts to cover (buy back), which pushes the price even higher.</p>
        <div className="scenario-timeline">
            <div className="timeline-step"><div className="step-label">Initial State</div><div className="step-content"><p>Stock XYZ @ ₹200. You are SHORT 500 shares.</p></div></div>
            <div className="timeline-step warning"><div className="step-label">Trigger Event</div><div className="step-content"><p>Positive news! Jumps to ₹250. Loss: -₹25,000.</p></div></div>
            <div className="timeline-step danger"><div className="step-label">The Squeeze</div><div className="step-content"><p>Panicked shorts cover. Hits ₹300. Loss: -₹50,000.</p></div></div>
            <div className="timeline-step danger"><div className="step-label">Peak</div><div className="step-content"><p>Hits ₹400. Loss: -₹1,00,000 (500% of margin)!</p></div></div>
        </div>
        <div className="lesson-box">
            <h4>How to Avoid Short Squeezes</h4>
            <ul>
                <li>Check Short Interest (&gt;20% is risky)</li>
                <li>Use Stop-Losses (5-8% above entry)</li>
                <li>Position Sizing (Risk 2-3% of capital)</li>
                <li>Avoid Meme Stocks</li>
            </ul>
        </div>
    </div>
);
