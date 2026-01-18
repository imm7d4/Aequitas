import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const RiskManagement: React.FC = () => {
    return (
        <div className="custom-module-page margin-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill danger">Capital Preservation</div>
                    <h1>Risk Management</h1>
                    <p className="hero-lead">Amateurs focus on how much they can make. Professionals focus on how much they can lose. Master the mathematics of survival.</p>
                </div>
                <div className="hero-visual">
                    <div className="shield-visual">
                        <div className="shield-glow"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The 1% Risk Rule</h2>
                    </div>
                    <p>Never risk more than 1% of your <strong>Total Account Equity</strong> on a single trade. This ensures that even a 10-trade losing streak only reduces your account by 10%.</p>
                    <div className="glass-card">
                        <h3>Position Sizing Math</h3>
                        <code>Qty = (Account Equity * 0.01) / (Entry - StopLoss)</code>
                        <div className="info-box tip">
                            <strong>Example:</strong> Account is ₹1,00,000. 1% Risk = ₹1,000. If your Stop Loss is ₹10 away from entry, you should only buy 100 shares.
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>The "Risk of Ruin" Table</h2>
                    </div>
                    <p>Mathematics proves that once you lose 50% of your capital, you need a 100% gain just to get back to zero. This is the <strong>Non-Linear Trap</strong>.</p>
                    <div className="comparison-table-dense">
                        <table>
                            <thead>
                                <tr>
                                    <th>% Loss</th>
                                    <th>% Gain to B/E</th>
                                    <th>Difficulty</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>10%</td>
                                    <td>11%</td>
                                    <td className="green">Normal</td>
                                </tr>
                                <tr>
                                    <td>25%</td>
                                    <td>33%</td>
                                    <td className="warning">Hard</td>
                                </tr>
                                <tr>
                                    <td>50%</td>
                                    <td>100%</td>
                                    <td className="red">Mythic</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Diversification & Margin</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>Correlation Risk</h3>
                        <p>Buying 5 different Tech stocks is NOT diversification. If the NIFTY IT index drops 3%, all your positions will drop together. This is called <strong>Systemic Risk</strong>.</p>
                        <p className="warning-chip">Monitor your <code>Margin Monitor</code>. Running at 5x leverage across correlated stocks is a recipe for a "Margin Call" liquidation.</p>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Summary: Live to Fight Tomorrow</h3>
                    <p>The best traders are the ones who survived the longest. Respect the math, use Stop Losses, and manage your leverage.</p>
                    <Link to="/education" className="primary-btn">Review Margin Rules</Link>
                </div>
            </div>
        </div>
    );
};

export default RiskManagement;
