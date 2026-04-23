import React from 'react';

const TrailingStopGuide: React.FC = () => {
    return (
        <section className="guide-section">
            <h3>Type 3: TRAILING_STOP (Trailing Stop)</h3>
            <div className="example-box">
                <p>A trailing stop <strong>moves with the price</strong> in your favor, but never moves against you. It ratchets up as the price hits new highs.</p>

                <div className="formula-block">
                    <h4>Trailing Stop Logic (SELL)</h4>
                    <p className="math">Stop Price = Highest Price Seen - Trail Amount</p>
                </div>

                <div className="scenario-timeline">
                    <div className="timeline-step">
                        <div className="step-label">Entry</div>
                        <div className="step-content">Buy 50 Reliance @ ₹2,400. Trail Amount: ₹50. Initial Stop: ₹2,350.</div>
                    </div>
                    <div className="timeline-step">
                        <div className="step-label">Rises</div>
                        <div className="step-content">Price hits ₹2,480. <strong>New High!</strong> Stop auto-adjusts to ₹2,430.</div>
                    </div>
                    <div className="timeline-step">
                        <div className="step-label">Rallies</div>
                        <div className="step-content">Price hits ₹2,550. Stop adjusts to ₹2,500. Profit locked!</div>
                    </div>
                    <div className="timeline-step warning">
                        <div className="step-label">Trigger</div>
                        <div className="step-content">Price drops to ₹2,495. Trigger! Trailing stop activates, sells at market.</div>
                    </div>
                </div>

                <div className="trailing-visual">
                    <h4>How it follows price</h4>
                    <div className="price-chart-simple">
                        <div className="price-line"></div>
                        <div className="trail-line"></div>
                    </div>
                </div>
            </div>

            <div className="glass-card caution">
                <h3>⚠️ The Gap Risk Problem</h3>
                <p>All stop orders have a critical weakness: <strong>overnight gaps</strong>. No protection against overnight news or circuit breakers.</p>
                <div className="scenario-col danger">
                    <p>Own shares @ ₹1,000. Stop-loss @ ₹950. Stock opens @ ₹600. Your stop triggers at ₹600, not ₹950.</p>
                </div>
            </div>

            <div className="stop-types-grid">
                <div className="stop-card sell">
                    <h4>Sell Stop (Stop Loss)</h4>
                    <p>Triggers when LTP ≤ Stop Price. Protects long positions.</p>
                </div>
                <div className="stop-card buy">
                    <h4>Buy Stop (Breakout)</h4>
                    <p>Triggers when LTP ≥ Stop Price. Catch breakouts or cover shorts.</p>
                </div>
            </div>
        </section>
    );
};

export default TrailingStopGuide;
