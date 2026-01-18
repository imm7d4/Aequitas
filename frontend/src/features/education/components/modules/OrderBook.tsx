import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const OrderBookModule: React.FC = () => {
    return (
        <div className="custom-module-page order-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill success">Market Depth</div>
                    <h1>Order Book & Depth</h1>
                    <p className="hero-lead">The chart shows history; the Order Book shows the future. Learn to read the intentions of thousands of traders through the Buy and Sell walls.</p>
                </div>
                <div className="hero-visual">
                    <div className="order-book-visual">
                        <div className="ask-wall"></div>
                        <div className="spread-label">Spread</div>
                        <div className="bid-wall"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The "Stack of Intent"</h2>
                    </div>
                    <p>The Order Book is a real-time database of all <strong>Limit Orders</strong> currently sitting in the exchange. It is divided into two halves: the <strong>Ask (Sellers)</strong> and the <strong>Bid (Buyers)</strong>.</p>
                    <div className="glass-card">
                        <h3>Depth of Market (DOM)</h3>
                        <p>In Aequitas, the <code>MatchingService</code> maintains this stack. When you see a large quantity at a specific price, you are looking at a <strong>Liquidity Wall</strong>.</p>
                        <div className="info-box tip">
                            <strong>Institutional Secret:</strong> Large walls often act as "Magnets" or "Shields". A ₹1,00,000 sell wall might take hours to 'eat' through, keeping the price below that level.
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Understanding the Spread</h2>
                    </div>
                    <p>The gap between the highest Bid and the lowest Ask is the <strong>Bid-Ask Spread</strong>. This is the primary cost of liquidity.</p>
                    <div className="math-grid-dense">
                        <div className="math-card">
                            <h4>Spread Calculation</h4>
                            <code>Spread = Best Ask - Best Bid</code>
                            <p>Ask: ₹100.05 | Bid: ₹100.00</p>
                            <p><strong>Spread: ₹0.05</strong></p>
                        </div>
                    </div>
                    <div className="info-box logic">
                        <strong>The Rule:</strong> Highly liquid stocks (like Reliance or HDFC) have tight spreads (₹0.05). Low liquidity stocks might have ₹2.00 spreads, causing instant 1% loss upon entry.
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Order Priority (Price-Time)</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>Who Fills First?</h3>
                        <p>The Aequitas exchange uses a <strong>Price-Time Priority</strong> model:</p>
                        <ol className="technical-list">
                            <li><strong>Price:</strong> The best price (Highest Bid / Lowest Ask) always fills first.</li>
                            <li><strong>Time:</strong> If two traders set the same price, the one who placed the order <strong>first</strong> gets filled first.</li>
                        </ol>
                        <p className="warning-chip">Seconds matter. In the 3-second heartbeat, being first in the queue is the difference between a fill and a miss.</p>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Summary: Visualizing the Friction</h3>
                    <p>The Order Book is where the battle happens. Understanding it helps you avoid entries where you'll be 'trapped' by a massive wall of sellers.</p>
                    <Link to="/education" className="primary-btn">Master Execution</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderBookModule;
