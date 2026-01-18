import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const LiquidityMetrics: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill warning">Advanced Liquidity</div>
                    <h1>Liquidity & Impact Metrics</h1>
                    <p className="hero-lead">Liquidity is the oxygen of the market. When it runs out, prices collapse. Learn to measure the depth and resilience of the Aequitas order book.</p>
                </div>
                <div className="hero-visual">
                    <div className="liquidity-visual">
                        <div className="pool-ripple"></div>
                        <div className="depth-gauge"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>Market Impact (The "Tax" of Size)</h2>
                    </div>
                    <p>If you try to buy 10,000 shares in a stock that only has 100 shares available at the LTP, you will "eat" through the order book. Your average price will be higher than the current price. This is <strong>Market Impact</strong>.</p>
                    <div className="glass-card">
                        <h3>Slippage vs Impact</h3>
                        <p><strong>Slippage:</strong> Random price movement between order and execution.</p>
                        <p><strong>Impact:</strong> Price movement caused <em>by your own order</em>.</p>
                        <div className="info-box logic">
                            <strong>Platform Tip:</strong> Use the "Depth" chart in the instrument panel. If the Buy/Sell slopes are steep, liquidity is low. Small orders will cause high impact.
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Bid-Ask Imbalance</h2>
                    </div>
                    <p>When there are 5,000 shares on the Bid and only 500 on the Ask, the order book is <strong>Imbalanced</strong>. This often precedes a quick price jump.</p>
                    <div className="math-grid-dense">
                        <div className="math-card">
                            <h4>Imbalance Ratio</h4>
                            <code>(Total Bid Qty) / (Total Ask Qty)</code>
                            <p>Ratio {">"} 2.0 = Heavy Buyer Pressure</p>
                            <p>Ratio {"<"} 0.5 = Heavy Seller Pressure</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>The "Liquidity Voids" (Gaps)</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>Flash Crashes</h3>
                        <p>In the Aequitas engine, if a massive market order depletes the entire order book, a <strong>Liquidity Void</strong> is created. Price will 'teleport' to the next available limit order, regardless of how far away it is.</p>
                        <p className="warning-chip">Never place massive market orders during "Thin" sessions (e.g., pre-market or news events).</p>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Summary: Measure the Depth</h3>
                    <p>Liquidity defines how fast you can get out. Always check the Market Depth before taking high-leverage positions.</p>
                    <Link to="/education" className="primary-btn">Master Microstructure</Link>
                </div>
            </div>
        </div>
    );
};

export default LiquidityMetrics;
