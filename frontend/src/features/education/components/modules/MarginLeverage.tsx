import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const MarginLeverage: React.FC = () => {
    return (
        <div className="custom-module-page margin-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill warning">Capital Efficiency</div>
                    <h1>Margin & Leverage</h1>
                    <p className="hero-lead">Leverage is a magnifying glass. It makes the small profits look big, but it makes the small mistakes fatal. Learn to use the Aequitas 5x Engine safely.</p>
                </div>
                <div className="hero-visual">
                    <div className="leverage-visual">
                        <div className="fulcrum"></div>
                        <div className="lever-arm">
                            <span className="weight capital">1x Cash</span>
                            <span className="weight exposure">5x Power</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>Buying Power Math</h2>
                    </div>
                    <p>In Aequitas, your <strong>Buying Power</strong> is a dynamic calculation performed by the <code>AccountService</code>. It represents the maximum exposure you can take based on your current cash and existing collateral.</p>
                    <div className="glass-card">
                        <h3>The 5x Multiplier</h3>
                        <div className="leverage-math-callout">
                            <div className="math-row">
                                <span>Total Account Equity (Cash + Profits)</span>
                                <span>₹2,00,000</span>
                            </div>
                            <div className="math-row">
                                <span>Leverage Multiplier (Standard)</span>
                                <span>5.0x</span>
                            </div>
                            <div className="math-row highlight">
                                <span>Max Theoretical Buying Power</span>
                                <span>₹10,00,000</span>
                            </div>
                        </div>
                        <p className="info-box tip">Notice: This is <strong>Intraday Leverage</strong>. All leveraged positions are automatically squared off near market close in real life. Aequitas allows longer holding currently, but monitor your <code>Margin Monitor</code> dashboard.</p>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>The Margin Lifecycle</h2>
                    </div>
                    <p>Margin is not a fee. It is a <strong>Security Deposit</strong> held by the engine to ensure you can cover potential losses.</p>

                    <div className="ratio-scale">
                        <div className="level healthy">
                            <div className="ratio">20.0%</div>
                            <div>
                                <strong>Initial Margin</strong>
                                <span>The minimum cash required to <strong>Open</strong> a position. (Price * Qty * 0.20)</span>
                            </div>
                        </div>
                        <div className="level warning">
                            <div className="ratio">15.0%</div>
                            <div>
                                <strong>Maintenance Margin</strong>
                                <span>The minimum equity required to <strong>Keep</strong> a position open.</span>
                            </div>
                        </div>
                        <div className="level critical">
                            <div className="ratio">{"<"}12.0%</div>
                            <div>
                                <strong>Liquidation Threshold</strong>
                                <span>The point where the engine may force-close your position to protect its own capital.</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>The Risk Matrix (Mathematical Impact)</h2>
                    </div>
                    <div className="risk-matrix-visual">
                        <div className="matrix-column bull">
                            <h4>Market Move: +2% (Bullish)</h4>
                            <div className="outcome">
                                <strong>No Leverage (1x):</strong> +2% Net Return
                            </div>
                            <div className="outcome high">
                                <strong>Full Leverage (5x):</strong> +10% Net Return
                            </div>
                        </div>
                        <div className="matrix-column bear">
                            <h4>Market Move: -2% (Bearish)</h4>
                            <div className="outcome">
                                <strong>No Leverage (1x):</strong> -2% Net Return
                            </div>
                            <div className="outcome fatal">
                                <strong>Full Leverage (5x):</strong> -10% Net Return
                            </div>
                        </div>
                    </div>
                    <div className="info-box logic">
                        <strong>Math Proof:</strong> When you are 5x leveraged, every 1% move in the stock stock creates a 5% move in your account equity. A 20% drop in stock price = 100% loss of your cash.
                    </div>
                </section>

                <div className="exit-cta">
                    <p>Rule of Thumb: Just because you HAVE 5x leverage doesn't mean you should USE 5x leverage. Start with 1.5x until you can handle the emotional swings.</p>
                    <Link to="/portfolio" className="primary-btn">Check My Buying Power</Link>
                </div>
            </div>
        </div>
    );
};

export default MarginLeverage;
