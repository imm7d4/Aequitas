import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const HowAequitasWorks: React.FC = () => {
    return (
        <div className="custom-module-page aequitas-dark">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill">System Architecture</div>
                    <h1>How Aequitas Works</h1>
                    <p className="hero-lead">Aequitas is not just a UI; it's a high-concurrency matching engine built with financial integrity at its core. Understand the 3-second heartbeat that powers your trades.</p>
                </div>
                <div className="hero-visual">
                    <div className="heartbeat-ring"></div>
                    <div className="engine-core">AQ</div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The 3-Second Heartbeat (The Polling Cycle)</h2>
                    </div>
                    <p>In a real-world exchange, matching happens in microseconds. In Aequitas, we use a <strong>3-second Polling Cycle</strong> to balance server load while maintaining realistic price discovery.</p>
                    <div className="glass-card">
                        <h3>Match Frequency</h3>
                        <p>Every 3 seconds, the <code>MatchingService</code> scans the global order book. It fetches the <strong>Last Traded Price (LTP)</strong> from the market data repository and attempts to find "Limit Harmony".</p>

                        <div className="clock-visual-container">
                            <div className="ticker-animation">
                                <div className="bar active"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                            </div>
                            <div className="caption">Each tick represents a server-side scan of your orders.</div>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>The Atomic Order Lifecycle</h2>
                    </div>
                    <p>When you click 'Place Order', Aequitas initiates a series of <strong>Atomic Transactions</strong>. This ensures that if any part of the trade fails, your balance remains safe.</p>

                    <div className="architecture-diagram-custom">
                        <div className="service-node">
                            <h4>1. OrderService</h4>
                            <ul>
                                <li>Validates Tick Size</li>
                                <li>Checks Margin (20%)</li>
                                <li>Locks Funds</li>
                            </ul>
                        </div>
                        <div className="connector">→</div>
                        <div className="service-node hotspot">
                            <h4>2. MatchingService</h4>
                            <ul>
                                <li>Compares LTP to Limit</li>
                                <li>Creates Trade Result</li>
                                <li>Calculates Fees (0.05%)</li>
                            </ul>
                        </div>
                        <div className="connector">→</div>
                        <div className="service-node">
                            <h4>3. PortfolioService</h4>
                            <ul>
                                <li>Updates Avg Price</li>
                                <li>Calculates Unrealized P&L</li>
                                <li>Fires Notification</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>T+0 Settlement (The Real-time Edge)</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>No Waiting for Capital</h3>
                        <p>Unlike traditional brokers with T+2 settlement (Trade Date + 2 Days), Aequitas uses <strong>T+0 Instant Settlement</strong>. The moment your SELL order matches, the cash is credited back to your balance for the next trade.</p>
                        <div className="info-box tip">
                            <strong>Why?</strong> In a simulation environment, capital velocity is key. We want you to be able to compound your account every hour, not every week.
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>The Data Integrity Fallback</h2>
                    </div>
                    <p>Our <code>AnalyticsService</code> is obsessed with accuracy. If real-time price ticks are missing due to high load, the engine falls back to a <strong>Tiered Priority System</strong>:</p>
                    <div className="real-vs-fake-grid">
                        <div className="check-item real">
                            <h4>Priority 1: 1m Candles</h4>
                            <p>Scans the 1-minute OHLC database to find exact Max Adverse Excursion.</p>
                        </div>
                        <div className="check-item fake">
                            <h4>Priority 2: Execution Link</h4>
                            <p>Uses your actual fill prices to calculate "Best Effort" diagnostics if data is missing.</p>
                        </div>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Simulation != Simple</h3>
                    <p>Behind every trade is a Go service ensuring that your profits are mathematically sound and your risk is precisely calculated.</p>
                    <Link to="/education" className="primary-btn">Explore More Modules</Link>
                </div>
            </div>
        </div>
    );
};

export default HowAequitasWorks;
