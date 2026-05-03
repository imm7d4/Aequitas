import React from 'react';

export const SpreadSection: React.FC = () => (
    <section className="guide-section">
        <div className="section-header">
            <span className="step-num">03</span>
            <h2>Understanding the Bid-Ask Spread</h2>
        </div>
        <p>The spread is the gap between the best bid and best ask. It represents the cost of immediate execution.</p>

        <div className="glass-card">
            <h3>The Hidden Cost of Trading</h3>
            <p><strong>Scenario:</strong> You want to buy and immediately sell 100 shares of a stock.</p>
            <div style={{ marginTop: '1rem' }}>
                <p><strong>Best Bid:</strong> ₹500.00 (you can sell here)</p>
                <p><strong>Best Ask:</strong> ₹500.50 (you must buy here)</p>
                <p><strong>Spread:</strong> ₹0.50</p>
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                <p><strong>If you buy at Ask and sell at Bid:</strong></p>
                <ul>
                    <li>Buy: 100 × ₹500.50 = ₹50,050</li>
                    <li>Sell: 100 × ₹500.00 = ₹50,000</li>
                    <li><strong>Instant Loss: ₹50 (0.1%)</strong></li>
                </ul>
                <p><strong>This is why you start every trade "in the red"!</strong></p>
            </div>
        </div>
    </section>
);

export const DepthSection: React.FC = () => (
    <section className="guide-section align-right">
        <div className="section-header">
            <span className="step-num">04</span>
            <h2>Market Depth & Liquidity Walls</h2>
        </div>
        <p>Market depth shows how many orders are waiting at each price level. Large orders create "walls" that can support or resist price movement.</p>

        <div className="glass-card danger">
            <h3>Example: The Sell Wall</h3>
            <p><strong>Scenario:</strong> You're watching XYZ stock at ₹100. You notice a massive sell order in the book:</p>
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <p><strong>Ask Side:</strong></p>
                <ul>
                    <li>₹100.10: 500 shares</li>
                    <li>₹100.20: 800 shares</li>
                    <li><strong>₹100.50: 50,000 shares</strong> ← MASSIVE WALL!</li>
                </ul>
            </div>
            <p><strong>What this means:</strong> Acts as a "ceiling" - price will struggle to break through.</p>
        </div>
    </section>
);
