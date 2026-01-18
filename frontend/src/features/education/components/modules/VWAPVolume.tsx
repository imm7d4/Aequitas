import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const VWAPVolume: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill success">Institutional Standard</div>
                    <h1>VWAP & Volume Profile</h1>
                    <p className="hero-lead">Price is what you pay; Volume is the proof. VWAP is the "Fair Value" benchmark used by institutional algorithms to execute billion-dollar trades.</p>
                </div>
                <div className="hero-visual">
                    <div className="vwap-visual">
                        <div className="vwap-line"></div>
                        <div className="volume-bars"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>VWAP (Volume Weighted Average Price)</h2>
                    </div>
                    <p>Unlike a normal moving average, VWAP considers the <strong>volume</strong> of shares traded at each price. It represents the true average price paid per share throughout the day.</p>
                    <div className="glass-card">
                        <h3>The Algorithm's Benchmark</h3>
                        <p>Institutional buyers goal is to buy <strong>below</strong> VWAP and sell <strong>above</strong> VWAP. If the price is far from the VWAP line, it is considered "Stretched".</p>
                        <div className="info-box logic">
                            <strong>Calculation:</strong> <code>∑ (Price * Volume) / ∑ Volume</code>. This is computed in real-time by the Aequitas <code>AnalyticsService</code>.
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Volume Profile (Horizontal Volume)</h2>
                    </div>
                    <p>The standard volume at the bottom of a chart shows <em>when</em> trades happened. Volume Profile shows <em>at what price</em> they happened.</p>
                    <div className="property-grid">
                        <div className="prop-card">
                            <h4>Point of Control (POC)</h4>
                            <p>The price level where the most volume was traded. These levels act as massive support/resistance zones.</p>
                        </div>
                        <div className="prop-card">
                            <h4>Low Volume Nodes</h4>
                            <p>Prices where very few trades occurred. Price tends to "slice" through these zones very quickly (Gapping potential).</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Interpreting Volume Climax</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>The Exhaustion Signal</h3>
                        <p>A massive spike in volume accompanying a small price move often indicates <strong>Absorption</strong>—a big player is 'blocking' the trend by taking every single order.</p>
                        <p className="warning-chip">High Volume + No Price Movement = Imminent Reversal.</p>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Summary: Trust the Volume</h3>
                    <p>Price can lie (manipulation). Volume cannot. Always verify your indicator signals with the Volume Profile.</p>
                    <Link to="/education" className="primary-btn">Analyze Liquidity</Link>
                </div>
            </div>
        </div>
    );
};

export default VWAPVolume;
