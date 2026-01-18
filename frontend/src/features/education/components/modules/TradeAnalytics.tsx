import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const TradeAnalytics: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill success">Expert Analysis</div>
                    <h1>Post-Trade Analytics</h1>
                    <p className="hero-lead">The real work begins after the trade is closed. Learn to audit your performance and identify the systemic leaks in your strategy.</p>
                </div>
                <div className="hero-visual">
                    <div className="analytics-visual">
                        <div className="radar-ping"></div>
                        <div className="data-points"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The "Opportunity Cost" Metric</h2>
                    </div>
                    <p>Suppose you exit a trade at ₹105 for a profit. But 10 minutes later, the price is ₹115. Your <strong>Opportunity Cost</strong> is ₹10. This is the "hidden loss" of exiting too early.</p>
                    <div className="glass-card">
                        <h3>Auditing the Exit</h3>
                        <p>Our <code>AnalyticsService</code> scans the 1-hour window following every trade. If you consistently leave 50%+ of the move on the table, your "Profit Capture Ratio" is low. You need to work on your "Letting winners run" psychology.</p>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>P&L Expectancy Math</h2>
                    </div>
                    <p>Trading is a game of probabilities. You don't need a 90% Win Rate to be rich; you need a positive <strong>Expectancy</strong>.</p>
                    <div className="math-grid-dense">
                        <div className="math-card">
                            <h4>Expectancy Formula</h4>
                            <code>(Win Rate * Avg Win) - (Loss Rate * Avg Loss)</code>
                            <p>WR: 40% | Win: ₹2,000 | Loss: ₹500</p>
                            <p><strong>Exp: +₹500 per trade</strong> (Highly Profitable)</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Strategic Auditing</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>Strategy Overfitting</h3>
                        <p>A strategy that worked perfectly last week might fail this week. Markets transition through <strong>Regimes</strong> (Trending, Sideways, Volatile). If your strategy is designed for trends, you will 'leak' money in a sideways market.</p>
                        <div className="info-box tip">
                            <strong>Audit Step:</strong> Check your <code>Trade Diagnostics</code> for "MAE Clustering". If all your losers have very high MAE, your entries are too aggressive or your stops are too loose.
                        </div>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Final Summary: The Trader's Journey</h3>
                    <p>You have completed the Institutional Trader's Path. Now, the only thing left is to trade, fail, learn, and repeat until the pattern recognition is instinctive.</p>
                    <Link to="/education" className="primary-btn">Review All Lessons</Link>
                </div>
            </div>
        </div>
    );
};

export default TradeAnalytics;
