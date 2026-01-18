import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const PLExplained: React.FC = () => {
    return (
        <div className="custom-module-page margin-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Financial Literacy</div>
                    <h1>P&L Explained</h1>
                    <p className="hero-lead">Profit is an opinion; Cash is a fact. Learn the difference between Unrealized (floating) and Realized (locked) gains in the Aequitas engine.</p>
                </div>
                <div className="hero-visual">
                    <div className="pl-visual">
                        <div className="floating-bubble">Unrealized</div>
                        <div className="locked-box">Realized</div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>Unrealized P&L (Floating)</h2>
                    </div>
                    <p>Also known as <strong>MTM (Mark-to-Market)</strong>. This is your profit if you were to close your position <em>right now</em> at the current LTP.</p>
                    <div className="glass-card">
                        <h3>The Calculation</h3>
                        <code>(Current Price - Avg Entry Price) * Quantity</code>
                        <div className="info-box tip">
                            <strong>Dynamic Nature:</strong> Your Unrealized P&L updates every 3 seconds as the <code>PortfolioService</code> receives new market data. It is not "Real" money until you exit.
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Realized P&L (Settled)</h2>
                    </div>
                    <p>The moment you "Square Off" a position, the <code>AnalyticsService</code> locks in the difference. This becomes <strong>Realized P&L</strong>.</p>
                    <div className="math-grid-dense">
                        <div className="math-card">
                            <h4>The Net formula</h4>
                            <code>Realized = Gross P&L - Fees - Commissions</code>
                            <p>Transaction costs (0.05%) are subtracted instantly upon trade settlement.</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>The Ghost of Slippage</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>Why did my P&L change after I closed?</h3>
                        <p>This is a common beginner question. If the LTP is 100 and you place a Market Sell, you might fill at 99.80. Your <strong>Realized P&L</strong> will be based on 99.80, even if the last chart tick was 100.</p>
                        <p className="warning-chip">Always account for the 'Exit Friction' when planning your profit targets.</p>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Summary: Realized is Reality</h3>
                    <p>Don't spend your unrealized gains. Only the Realized P&L updates your <strong>Withdrawable Balance</strong>.</p>
                    <Link to="/portfolio" className="primary-btn">View My Portfolio</Link>
                </div>
            </div>
        </div>
    );
};

export default PLExplained;
