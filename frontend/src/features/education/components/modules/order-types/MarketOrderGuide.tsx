import React from 'react';

const MarketOrderGuide: React.FC = () => {
    return (
        <div className="tab-pane animate-in">
            <section className="guide-section">
                <h2>The Aggressive Entry (Liquidity Taker)</h2>
                <p className="large-text">A Market order says: <strong>"I don't care about the price, I want execution RIGHT NOW."</strong></p>

                <div className="property-grid">
                    <div className="prop-card">
                        <h4>Priority</h4>
                        <p>Highest. You skip the queue in the order book. Your trade is matched instantly with the best available price.</p>
                    </div>
                    <div className="prop-card warning">
                        <h4>Pricing</h4>
                        <p>Variable. You get the best available price (LTP). Aequitas applies a <strong>1% Margin Buffer</strong> to ensure you have enough funds if the price moves during execution.</p>
                    </div>
                    <div className="prop-card">
                        <h4>Impact</h4>
                        <p>You are a "Liquidity Taker". Large market orders can move the price against you as you 'eat through' the order book.</p>
                    </div>
                </div>
            </section>

            <div className="example-box">
                <h3>Real-World Scenario: The Slippage Trap</h3>
                <div className="scenario-timeline">
                    <div className="timeline-step">
                        <div className="step-label">T = 0.0s</div>
                        <div className="step-content">
                            <p><strong>You see:</strong> TCS trading at ₹3,500</p>
                            <p>You decide to buy 1,000 shares using a Market Order</p>
                        </div>
                    </div>
                    <div className="timeline-step">
                        <div className="step-label">T = 0.1s</div>
                        <div className="step-content">
                            <p><strong>Expected Cost:</strong> 1,00,0 × ₹3,500 = ₹35,00,000</p>
                            <p><strong>System Buffer (1%):</strong> ₹35,00,000 × 1.01 = ₹35,35,000</p>
                            <div className="info-box tip">
                                This buffer ensures you have enough funds even if price moves slightly
                            </div>
                        </div>
                    </div>
                    <div className="timeline-step warning">
                        <div className="step-label">T = 0.3s</div>
                        <div className="step-content">
                            <p><strong>Market moves!</strong> Large institutional buy order hits</p>
                            <p>New LTP: ₹3,512</p>
                        </div>
                    </div>
                    <div className="timeline-step danger">
                        <div className="step-label">T = 0.5s</div>
                        <div className="step-content">
                            <p><strong>Your order fills at:</strong> ₹3,512</p>
                            <p>Actual Cost: 1,000 × ₹3,512 = ₹35,12,000</p>
                            <p className="loss-highlight"><strong>Slippage Cost:</strong> ₹12,000 extra paid! (0.34% slippage)</p>
                        </div>
                    </div>
                </div>

                <div className="lesson-box">
                    <h4>📚 Key Lessons</h4>
                    <ul>
                        <li><strong>In volatile markets:</strong> Market orders can cost significantly more than expected</li>
                        <li><strong>For large quantities:</strong> You may "walk up the order book" getting progressively worse prices</li>
                        <li><strong>Best use case:</strong> When speed matters more than price (e.g., stop-loss execution)</li>
                    </ul>
                </div>
            </div>

            <div className="glass-card caution">
                <h3>⚠️ The Flash Crash Risk</h3>
                <p>During extreme volatility, market orders can execute at prices far from the last traded price. In fast-moving markets bid-ask spreads widen dramatically and order book depth evaporates.</p>
            </div>
        </div>
    );
};

export default MarketOrderGuide;
