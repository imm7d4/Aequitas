import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const WhyOrdersFail: React.FC = () => {
    return (
        <div className="custom-module-page order-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill danger">Troubleshooting</div>
                    <h1>Why Orders Don't Fill</h1>
                    <p className="hero-lead">"The price touched my limit but I wasn't filled!" Learn the technical reasons why the engine sometimes bypasses your orders.</p>
                </div>
                <div className="hero-visual">
                    <div className="failed-order-visual">
                        <div className="ghost-order"></div>
                        <div className="price-line-jump"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The "Gapping" Paradox</h2>
                    </div>
                    <p>Financial markets are "Discontinuous". Price does not travel; it teleports. If a stock jumps from ₹499 to ₹501, it <strong>never traded</strong> at ₹500.</p>
                    <div className="glass-card">
                        <h3>No Trades = No Fills</h3>
                        <p>If your Buy Limit is at ₹500, but the <code>MatchingService</code> only sees LTP updates for 499 and 501, your order remains pending. There was no counterparty willing to sell at exactly 500 during the 3-second heartbeat.</p>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>The Queue Position (FIFO)</h2>
                    </div>
                    <div className="property-grid">
                        <div className="prop-card">
                            <h4>Too Far Back</h4>
                            <p>Suppose 10,000 shares trade at your price, but there were 50,000 shares ahead of you in the queue. You remain unfilled because more senior orders ate all the available liquidity.</p>
                        </div>
                        <div className="prop-card warning">
                            <h4>The Buffer Factor</h4>
                            <p>For Stop Orders, Aequitas requires a <strong>1% Margin Buffer</strong>. Even if the price is hit, if your cash balance is too low to cover a potential 1% slippage, the <code>OrderService</code> will auto-reject the trigger.</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Validity Timeouts (IOC)</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>The Immediate or Cancel Trap</h3>
                        <p>If you use <strong>IOC (Immediate or Cancel)</strong> validity, your order is only valid for a single <code>MatchingService</code> scan. If it isn't filled in that microsecond, it is instantly killed to prevent "hanging orders".</p>
                        <div className="info-box tip">
                            <strong>Recommendation:</strong> Use <strong>GTC (Good Till Cancelled)</strong> for normal trading to ensure your order sits patiently in the book.
                        </div>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Summary: Check Your Intent</h3>
                    <p>Usually, a failed fill isn't a bug—it's market physics. Adjust your limit price or check your queue seniority.</p>
                    <Link to="/education" className="primary-btn">Review Order Types</Link>
                </div>
            </div>
        </div>
    );
};

export default WhyOrdersFail;
