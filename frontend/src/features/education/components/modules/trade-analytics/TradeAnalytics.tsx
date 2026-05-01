import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import ExpectancyMetric from './ExpectancyMetric';
import PerformanceTradeOffs from './PerformanceTradeOffs';
import RiskAndRegimeAnalysis from '../risk-management/RiskAndRegimeAnalysis';
import JournalingAndReview from './JournalingAndReview';

const TradeAnalytics: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill success">Performance Mastery</div>
                    <h1>Post-Trade Analytics & Performance Review</h1>
                    <p className="hero-lead">The real work begins after the trade is closed. Learn to audit your performance, identify systemic leaks in your strategy, and continuously improve your edge.</p>
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
                        <h2>Why Post-Trade Analysis Matters</h2>
                    </div>
                    <div className="glass-card">
                        <h3>The Performance Feedback Loop</h3>
                        <p>Execute → Record → Analyze → Refine → Repeat. Without analysis, you're just gambling.</p>
                    </div>
                </section>

                <ExpectancyMetric />
                <PerformanceTradeOffs />
                <RiskAndRegimeAnalysis />
                <JournalingAndReview />

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">09</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Journaling is essential</strong> - Without data, you're guessing</li>
                            <li>✅ <strong>Expectancy drives profit</strong> - Win Rate × Avg Win vs Loss Rate × Avg Loss</li>
                            <li>✅ <strong>Track opportunity cost</strong> - Monitor profit left on the table</li>
                            <li>✅ <strong>Monitor drawdown</strong> - Stop trading at 20-30% decline</li>
                            <li>✅ <strong>Process over outcomes</strong> - Good process leads to long-term success</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>The Journey Never Ends</h3>
                    <p>You've completed the institutional trader's education path. Now, the only thing left is to trade, fail, learn, and repeat until pattern recognition becomes instinctive.</p>
                    <Link to="/education" className="primary-btn">Review All Lessons</Link>
                </div>
            </div>
        </div>
    );
};

export default TradeAnalytics;
