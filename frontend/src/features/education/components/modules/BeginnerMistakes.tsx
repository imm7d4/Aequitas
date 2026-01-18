import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const BeginnerMistakes: React.FC = () => {
    return (
        <div className="custom-module-page survival-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill danger">Survival Protocol</div>
                    <h1>Common Beginner Mistakes</h1>
                    <p className="hero-lead">The market is a machine designed to transfer money from the impatient to the patient. Avoid these common 'Simulator Traps' that lead to account wipeouts.</p>
                </div>
                <div className="hero-visual">
                    <div className="warning-shield-visual">
                        <div className="shield-core">!</div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The "Slippage Trap" (Market Orders)</h2>
                    </div>
                    <p>Beginners often think the price they see on the chart is the price they will get. This is rarely true for Market Orders. In Aequitas, a Market Order uses a <strong>1% Price Buffer</strong> for fund validation.</p>
                    <div className="info-box danger">
                        <strong>Why?</strong> If the price moves 0.5% while your order is traveling to the server, you would reach a negative balance. We block this to protect your account.
                    </div>
                    <div className="hard-rule">
                        <strong>The Rule:</strong> Always keep at least 2% of your cash as 'Slippage Insurance' when using Market Orders.
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>The "Quantity Overload" (Lot Sizes)</h2>
                    </div>
                    <p>Aequitas enforces <strong>Lot Sizes</strong> defined by the exchange. If an instrument has a Lot Size of 100, you cannot buy 101 shares.</p>
                    <div className="math-grid-dense">
                        <div className="math-card">
                            <h4>Valid Quantity</h4>
                            <code>Qty % LotSize == 0</code>
                            <p>500 shares (Lot Size 100) = ✅</p>
                        </div>
                        <div className="math-card">
                            <h4>Invalid Quantity</h4>
                            <code>Qty % LotSize != 0</code>
                            <p>150 shares (Lot Size 100) = ❌ (REJECTED)</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>The Revenge Trade (Psychology)</h2>
                    </div>
                    <div className="killers-list">
                        <div className="killer-item">
                            <div className="killer-header">
                                <span className="icon">😡</span>
                                <h3>Revenge Trading</h3>
                            </div>
                            <p>Losing a trade and immediately doubling your position size to "win it back". This is how 90% of simulator accounts reach zero within 24 hours.</p>
                        </div>
                        <div className="killer-item">
                            <div className="killer-header">
                                <span className="icon">🎢</span>
                                <h3>Over-Leveraging</h3>
                            </div>
                            <p>Using 5x leverage on every single trade. One 2% move against you equals a 10% account loss. Five such mistakes and your account is down 50%.</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>The "Wash Trading" Static</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>Ethics of the Simulator</h3>
                        <p>Buying and selling to yourself (Wash Trading) to create fake volume is a crime in real markets. While Aequitas is a simulator, our <code>ComplianceService</code> tracks these patterns.</p>
                        <p className="warning-chip">Suspicious patterns will flag your account in the Leaderboards.</p>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Summary: Don't Be a Statistic</h3>
                    <p>Treat the simulator money like your own hard-earned savings. If you wouldn't do it with ₹1,00,000 real cash, don't do it here.</p>
                    <Link to="/education" className="primary-btn">Review Survival Rules</Link>
                </div>
            </div >
        </div >
    );
};

export default BeginnerMistakes;
