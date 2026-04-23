import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import RiskMistakes from '../risk-management/RiskMistakes';
import LeverageAndOvertrading from '../margin-leverage/LeverageAndOvertrading';
import PsychologicalPitfalls from '../risk-management/PsychologicalPitfalls';
import ExecutionAndPlanning from '../trading-diagnostics/ExecutionAndPlanning';

const BeginnerMistakes: React.FC = () => {
    return (
        <div className="custom-module-page survival-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill danger">Survival Guide</div>
                    <h1>Common Beginner Mistakes & How to Avoid Them</h1>
                    <p className="hero-lead">Learn from others' expensive mistakes. These errors have cost traders millions. Understanding them will save you time, money, and emotional stress.</p>
                </div>
                <div className="hero-visual">
                    <div className="warning-shield-visual">
                        <div className="shield-core">!</div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <RiskMistakes />
                <LeverageAndOvertrading />
                <PsychologicalPitfalls />

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Holding Losers, Selling Winners</h2>
                    </div>
                    <div className="glass-card danger">
                        <p>Most common trap: Cutting profits early while letting losses run. <strong>Professional logic: Let winners run, cut losers quickly.</strong></p>
                    </div>
                </section>

                <ExecutionAndPlanning />

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">11</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Always use stop losses</strong> - Limit losses to 1-2% per trade</li>
                            <li>✅ <strong>Avoid overleveraging</strong> - Protect your total capital</li>
                            <li>✅ <strong>Quality over quantity</strong> - Don't overtrade</li>
                            <li>✅ <strong>Let winners run</strong> - Don't cut profits too early</li>
                            <li>✅ <strong>Plan every trade</strong> - Knowledge is the best defense</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master Order Types Next</h3>
                    <p>Now that you know what NOT to do, learn how to use different order types effectively to execute your strategies.</p>
                    <Link to="/education/order-types" className="primary-btn">Learn Order Types</Link>
                </div>
            </div>
        </div>
    );
};

export default BeginnerMistakes;
