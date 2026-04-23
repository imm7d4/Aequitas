import React from 'react';

const StopOrderBasics: React.FC = () => {
    return (
        <section className="guide-section">
            <h2>The Conditional Trigger (Sentinel Mode)</h2>
            <p className="large-text">Stop orders activate only when a specific price trigger is hit. They protect positions and automate strategy.</p>

            <div className="glass-card darker">
                <h3>How it Works</h3>
                <p>Stop orders sit in <strong>PENDING</strong> state, checked every 3 seconds. When triggered, they convert to Market or Limit orders.</p>
                <div className="info-box tip">
                    <strong>Intent Preservation:</strong> Ensures stop-losses work correctly and don't create unintentional new positions.
                </div>
            </div>

            <h3>Type 1: STOP (Stop-Market)</h3>
            <div className="example-box">
                <h4>Protecting a Long Position</h4>
                <div className="scenario-timeline">
                    <div className="timeline-step">
                        <div className="step-label">Day 1</div>
                        <div className="step-content">Buy 200 shares @ ₹1,600. Set STOP SELL @ ₹1,520 (Stop Price).</div>
                    </div>
                    <div className="timeline-step warning">
                        <div className="step-label">Day 3</div>
                        <div className="step-content">Price drops to ₹1,518. Trigger condition met (≤ ₹1,520).</div>
                    </div>
                    <div className="timeline-step confirm">
                        <div className="step-label">Result</div>
                        <div className="step-content">Child Market Order created. SELL 200 @ Market. Fills at ₹1,515. Loss limited.</div>
                    </div>
                </div>
            </div>

            <h3>Type 2: STOP_LIMIT</h3>
            <div className="example-box">
                <p>A STOP_LIMIT order has TWO prices: <strong>Stop Price</strong> (when to activate) and <strong>Limit Price</strong> (minimum price to accept).</p>
                <div className="scenario-grid">
                    <div className="scenario-col">
                        <h4>STOP (Market)</h4>
                        <p>Triggers at ₹1,520 → Sells at ANY price. High certainty.</p>
                    </div>
                    <div className="scenario-col">
                        <h4>STOP_LIMIT</h4>
                        <p>Stop ₹1,520 / Limit ₹1,510. Won't sell below ₹1,510. Higher price control.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StopOrderBasics;
