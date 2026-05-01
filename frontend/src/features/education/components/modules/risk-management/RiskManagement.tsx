import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import RiskPerTrade from './RiskPerTrade';
import PositionSizingMath from './PositionSizingMath';
import PortfolioStrategy from './PortfolioStrategy';
import StopLossAndMistakes from './StopLossAndMistakes';

const RiskManagement: React.FC = () => {
    return (
        <div className="custom-module-page margin-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill danger">Capital Preservation</div>
                    <h1>Risk Management Mastery</h1>
                    <p className="hero-lead">Amateurs focus on how much they can make. Professionals focus on how much they can lose. Master the mathematics of survival and position sizing.</p>
                </div>
                <div className="hero-visual">
                    <div className="shield-visual">
                        <div className="shield-glow"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <RiskPerTrade />
                <PositionSizingMath />
                <PortfolioStrategy />

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Maximum Exposure Limits</h2>
                    </div>
                    <div className="glass-card darker">
                        <p>Limit exposure to 20-25% per trade and 30-40% per sector. Always keep a 20-30% cash reserve for safety and opportunity.</p>
                    </div>
                </section>

                <StopLossAndMistakes />

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">10</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Risk 1-2% per trade maximum</strong></li>
                            <li>✅ <strong>Use position sizing formula</strong></li>
                            <li>✅ <strong>Maintenance 2:1 risk-reward minimum</strong></li>
                            <li>✅ <strong>Never move stops away</strong></li>
                            <li>✅ <strong>Preserve capital first</strong> - Survival is success!</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Summary: Survival is Success</h3>
                    <p>The best traders are the ones who survived the longest. Respect the math, use position sizing, and manage your risk religiously.</p>
                    <Link to="/education/margin-leverage" className="primary-btn">Review Margin & Leverage</Link>
                </div>
            </div>
        </div>
    );
};

export default RiskManagement;
