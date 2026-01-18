import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const MarketMicrostructure: React.FC = () => {
    return (
        <div className="custom-module-page aequitas-dark">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill">Market Theory</div>
                    <h1>Market Microstructure</h1>
                    <p className="hero-lead">Under the hood of every trade isn't just data—it's mechanisms. Learn how the plumbing of the financial world actually moves the needle.</p>
                </div>
                <div className="hero-visual">
                    <div className="gear-visual">
                        <div className="gear large"></div>
                        <div className="gear small"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The Mechanics of Matching</h2>
                    </div>
                    <p>Inside the Aequitas <code>MatchingService</code>, every trade is a result of state-synchronization. We use a <strong>Continuous Double Auction (CDA)</strong> model.</p>
                    <div className="glass-card">
                        <h3>How Matchers "See" You</h3>
                        <p>The engine doesn't care about your strategy; it only cares about your <strong>Instruction</strong>. Instructions are prioritized by Price and then Time (Nano-second resolution in real exchanges; 3-second heartbeats in our simulation).</p>
                        <div className="info-box tip">
                            <strong>Theoretical Note:</strong> In High-Frequency Trading (HFT), the physical length of the fiber optic cable determines your "Time" priority.
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Incentivized Liquidity (Making vs Taking)</h2>
                    </div>
                    <p>Exchanges actually <em>pay</em> traders to place limit orders. This is known as the <strong>Maker-Taker model</strong>.</p>
                    <div className="real-vs-fake-grid">
                        <div className="check-item real">
                            <h4>The Maker</h4>
                            <p>Adds a limit order to the book. Increases stability. Often receives a rebate (lower commission).</p>
                        </div>
                        <div className="check-item fake">
                            <h4>The Taker</h4>
                            <p>Uses a market order to eat liquidity. Decreases stability. Pays the full commission tax.</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Information Asymmetry</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>Who knows what?</h3>
                        <p>In Market Microstructure theory, there are two types of traders:</p>
                        <ul className="technical-list">
                            <li><strong>Informed Traders:</strong> Have private data/research. Their orders move the price permanently.</li>
                            <li><strong>Noise Traders:</strong> Trade randomly for liquidity or emotions. Their orders create volatility but no permanent trend.</li>
                        </ul>
                        <p className="warning-chip">Institutional algorithms are designed to detect "Informed" flow and hide their own intentions from "Noise" traders.</p>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Summary: You Are the Engine</h3>
                    <p>By using Aequitas, you are participating in a simulated microstructure. Every order you place contributes to the density of this ecosystem.</p>
                    <Link to="/education" className="primary-btn">Perform Trade Analytics</Link>
                </div>
            </div>
        </div>
    );
};

export default MarketMicrostructure;
