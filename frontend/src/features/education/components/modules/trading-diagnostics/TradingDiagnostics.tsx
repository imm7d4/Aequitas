import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import EfficiencyMetrics from './EfficiencyMetrics';
import ExcursionAnalysis from '../trade-analytics/ExcursionAnalysis';
import TimingAndPerformance from './TimingAndPerformance';

const TradingDiagnostics: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Performance Analytics</div>
                    <h1>Trading Diagnostics & Performance Metrics</h1>
                    <p className="hero-lead">Don't just track P&L. Track your efficiency, timing, and execution quality. Learn to diagnose what's working and what's costing you money.</p>
                </div>
                <div className="hero-visual">
                    <div className="diagnostic-pulse-visual">
                        <div className="pulse-circle"></div>
                        <div className="data-lines">
                            <span>MAE</span>
                            <span>MFE</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <EfficiencyMetrics />
                <ExcursionAnalysis />
                <TimingAndPerformance />

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Track trade path, not just outcome</strong></li>
                            <li>✅ <strong>Low MAE = Great entry timing</strong></li>
                            <li>✅ <strong>Target 60%+ profit capture ratio</strong></li>
                            <li>✅ <strong>Keep Profit Factor above 1.5</strong></li>
                            <li>✅ <strong>Hold winners longer than losers</strong></li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master Your Metrics</h3>
                    <p>Professional traders review diagnostics daily. Use these metrics to continuously improve your discipline and quality.</p>
                    <Link to="/education/indicators" className="primary-btn">Learn Technical Indicators</Link>
                </div>
            </div>
        </div>
    );
};

export default TradingDiagnostics;
