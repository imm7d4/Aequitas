import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import ExchangeMechanics from './ExchangeMechanics';
import MatchingPriority from './MatchingPriority';
import ParticipantDetails from './ParticipantDetails';
import LiquidityRules from './LiquidityRules';

const MarketMicrostructure: React.FC = () => {
    return (
        <div className="custom-module-page aequitas-dark">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill">Market Theory</div>
                    <h1>Market Microstructure</h1>
                    <p className="hero-lead">Under the hood of every trade isn't just data—it's mechanisms. Learn how modern exchanges work, how orders are matched, and how participants create price discovery.</p>
                </div>
                <div className="hero-visual">
                    <div className="gear-visual">
                        <div className="gear large"></div>
                        <div className="gear small"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <ExchangeMechanics />

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>The Double Auction Model</h2>
                    </div>
                    <div className="glass-card darker">
                        <p>Prices emerge from continuous interaction. Every market buy eats existing ask orders; every market sell hits bids. Price moves when one side is exhausted.</p>
                    </div>
                </section>

                <MatchingPriority />
                <ParticipantDetails />
                <LiquidityRules />

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Information Asymmetry</h2>
                    </div>
                    <div className="glass-card darker">
                        <p>Informed traders have informational edges. Noise traders provide the volatility that informed traders and market makers capitalize on.</p>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Price-Time Priority rules the book</strong></li>
                            <li>✅ <strong>Makers add, Takers consume liquidity</strong></li>
                            <li>✅ <strong>Use limit orders to save on fees</strong></li>
                            <li>✅ <strong>Toxic flow widens market spreads</strong></li>
                            <li>✅ <strong>Retail competes with professionals/Algos</strong></li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>The Market is a Complex Ecosystem</h3>
                    <p>Understanding microstructure helps you navigate modern trading environments where algorithms and professionals dominate.</p>
                    <Link to="/education/trade-analytics" className="primary-btn">Master Trade Analytics</Link>
                </div>
            </div>
        </div>
    );
};

export default MarketMicrostructure;
