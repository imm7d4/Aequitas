import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import VWAPBasics from './VWAPBasics';
import VWAPStrategies from './VWAPStrategies';
import VolumeProfileDetails from './VolumeProfileDetails';
import VolumeAnalysisTakeaways from './VolumeAnalysisTakeaways';

const VWAPVolume: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill success">Institutional Standard</div>
                    <h1>VWAP & Volume Profile Mastery</h1>
                    <p className="hero-lead">Price is what you pay; Volume is the proof. VWAP is the "Fair Value" benchmark used by institutional algorithms. Learn to trade like the big players.</p>
                </div>
                <div className="hero-visual">
                    <div className="vwap-visual">
                        <div className="vwap-line"></div>
                        <div className="volume-bars"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <VWAPBasics />

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Calculations</h2>
                    </div>
                    <div className="glass-card darker">
                        <p>VWAP is theΣ (Price × Volume) for each trade / total volume. It resets every morning at market open. It represents the true cost basis of all participants for that day.</p>
                    </div>
                </section>

                <VWAPStrategies />
                <VolumeProfileDetails />

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Combining VWAP & Profile</h2>
                    </div>
                    <div className="glass-card">
                        <p>High-probability buy: Price bouncing off VWAP and POC simultaneously with 2x volume. This is "Triple Confluence" where big money defends their basis.</p>
                    </div>
                </section>

                <VolumeAnalysisTakeaways />

                <div className="exit-cta">
                    <h3>Trade Like Institutions</h3>
                    <p>VWAP and Volume Profile are professional-grade tools. Master them to understand where big money is positioned.</p>
                    <Link to="/education/liquidity-metrics" className="primary-btn">Learn Liquidity Metrics</Link>
                </div>
            </div>
        </div>
    );
};

export default VWAPVolume;
