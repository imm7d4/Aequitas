import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import IndicatorCategories from './IndicatorCategories';
import MovingAverageGuide from './MovingAverageGuide';
import MomentumIndicators from './MomentumIndicators';
import VolatilityAndStrategy from '../risk-management/VolatilityAndStrategy';

const Indicators: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Technical Analysis</div>
                    <h1>Technical Indicators Masterclass</h1>
                    <p className="hero-lead">Indicators are mathematical derivatives of price and volume. They don't predict the future, but they filter the noise and reveal hidden patterns in market behavior.</p>
                </div>
                <div className="hero-visual">
                    <div className="indicator-visual">
                        <div className="sine-wave"></div>
                        <div className="signal-dot"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <IndicatorCategories />
                <MovingAverageGuide />
                <MomentumIndicators />
                
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Combining Indicators</h2>
                    </div>
                    <div className="glass-card">
                        <p>No single indicator is perfect. Use a "Triple Confirmation" strategy: Trend (MA) + Momentum (RSI/MACD) + Volume (VWAP). When all three align, confidence increases significantly.</p>
                    </div>
                </section>

                <VolatilityAndStrategy />

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">09</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Indicators filter noise</strong> - Not magic crystal balls</li>
                            <li>✅ <strong>Moving averages define trend</strong> - Use 50/200 day crosses</li>
                            <li>✅ <strong>RSI identifies over-extensions</strong> - Watch for divergences</li>
                            <li>✅ <strong>Bollinger Bands gauge volatility</strong> - Squeeze = potential breakout</li>
                            <li>✅ <strong>Price Action is King</strong> - Indicators are the support cast</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master the Basics First</h3>
                    <p>Start with one indicator from each category. Master these before adding more complexity.</p>
                    <Link to="/education/vwap-volume" className="primary-btn">Learn VWAP & Volume</Link>
                </div>
            </div>
        </div>
    );
};

export default Indicators;
