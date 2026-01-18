import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const ShortSelling: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'basics' | 'math' | 'risk'>('basics');

    return (
        <div className="custom-module-page short-selling-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill warning">Advanced Mechanics</div>
                    <h1>Short Selling Deep-Dive</h1>
                    <p className="hero-lead">Profit from the fall. Learn how Aequitas manages synthetic inventory, borrowed exposure, and the critical math of 'Equity Inversion'.</p>
                </div>
                <div className="hero-visual">
                    <div className="arrow-down-visual"></div>
                </div>
            </header>

            <div className="content-container">
                <div className="density-tabs">
                    <button className={activeTab === 'basics' ? 'active' : ''} onClick={() => setActiveTab('basics')}>The Mechanism</button>
                    <button className={activeTab === 'math' ? 'active' : ''} onClick={() => setActiveTab('math')}>Financial Math</button>
                    <button className={activeTab === 'risk' ? 'active' : ''} onClick={() => setActiveTab('risk')}>The Aequitas Rules</button>
                </div>

                {activeTab === 'basics' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>The Borrowing Metaphor</h2>
                            <p>In Aequitas, when you short, you are selling shares you <strong>do not yet own</strong>. You are creating a 'Negative Inventory' in the system.</p>
                            <div className="glass-card">
                                <h3>The Short Sequence</h3>
                                <div className="timeline-walkthrough">
                                    <div className="tw-step">
                                        <div className="step-indicator trigger"></div>
                                        <strong>1. Sell Short (Entry)</strong>
                                        <p>You sell 100 shares at ₹500. Aequitas blocks 20% margin from your cash and gives you ₹50,000 proceeds (temporarily locked).</p>
                                    </div>
                                    <div className="tw-step">
                                        <div className="step-indicator"></div>
                                        <strong>2. The Price Drops</strong>
                                        <p>Stock falls to ₹400. Your liability (the 100 shares you owe) is now cheaper to buy back.</p>
                                    </div>
                                    <div className="tw-step">
                                        <div className="step-indicator confirm"></div>
                                        <strong>3. Buy to Cover (Exit)</strong>
                                        <p>You buy back 100 shares at ₹400. You spent ₹40,000 to close a ₹50,000 liability. Result: ₹10,000 Profit.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'math' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>The Equity Inversion Rule</h2>
                            <p>P&L for a Short position is calculated as: <code>(EntryPrice - ExitPrice) * Quantity</code>. Notice the inversion—lower price equals higher profit.</p>

                            <div className="balance-sheet-visual">
                                <div className="bs-row header">
                                    <span>Position Component</span>
                                    <span>Impact on Account</span>
                                </div>
                                <div className="bs-row">
                                    <span>Blocked Margin (20%)</span>
                                    <span>Locked Cash (Dr)</span>
                                </div>
                                <div className="bs-row highlight">
                                    <span>Mark-to-Market (MTM)</span>
                                    <span>Live P&L Tracking</span>
                                </div>
                                <div className="bs-row red">
                                    <span>Liability Value</span>
                                    <span>Quantity * LTP (Cr)</span>
                                </div>
                            </div>

                            <div className="info-box logic">
                                <strong>Technical Note:</strong> If the price doubles (+100%), your loss is -100%. Unlike Long positions, if the price continues to rise, your potential loss is <strong>Mathematically Infinite</strong>.
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'risk' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>The Aequitas "No Hedge" Constraint</h2>
                            <p>To ensure portfolio integrity, Aequitas prevents users from holding opposing views simultaneously. This is enforced in <code>OrderService.go</code>.</p>

                            <div className="real-vs-fake-grid">
                                <div className="check-item fake">
                                    <h4>Scenario: Active Long</h4>
                                    <p>If you own 100 Reliance shares, the 'Short' button will be disabled. You must sell your long position before opening a short view.</p>
                                </div>
                                <div className="check-item real">
                                    <h4>Scenario: Active Short</h4>
                                    <p>If you are short 100 shares, you cannot buy 200 shares to 'switch'. You must cover the 100 first, then open a fresh long.</p>
                                </div>
                            </div>

                            <div className="glass-card darker">
                                <h3>Inventory Availability</h3>
                                <p>While the simulation allows infinite inventory, in the real NSE/BSE markets, you can only short if your broker has shares in their <strong>SLB (Stock Lending & Borrowing)</strong> pool. If no one is lending, you cannot short.</p>
                                <span className="roadmap-pill">Upcoming: SLB Inventory Simulation</span>
                            </div>
                        </section>
                    </div>
                )}

                <div className="exit-cta">
                    <h3>Summary: High Risk, High Reward</h3>
                    <p>Shorting requires 20% margin and a stomach for volatility. Always use Stop Losses to protect against the "Short Squeeze".</p>
                    <Link to="/education" className="primary-btn">Master Your Risk</Link>
                </div>
            </div>
        </div>
    );
};

export default ShortSelling;
