import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const Indicators: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Data Science</div>
                    <h1>Technical Indicators</h1>
                    <p className="hero-lead">Indicators are mathematical derivatives of price and volume. They don't predict the future, but they filter the noise of the present.</p>
                </div>
                <div className="hero-visual">
                    <div className="indicator-visual">
                        <div className="sine-wave"></div>
                        <div className="signal-dot"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The "Moving Average" (Trend Filter)</h2>
                    </div>
                    <p>The most basic building block. It smooths out price data to create a constantly updating average price. In Aequitas, these are calculated in the <code>IndicatorService</code>.</p>
                    <div className="glass-card">
                        <h3>SMA vs EMA</h3>
                        <p><strong>SMA (Simple):</strong> Treats all days equally. Slow to react.</p>
                        <p><strong>EMA (Exponential):</strong> Gives more weight to recent prices. Reacts faster to new trends.</p>
                        <div className="info-box tip">
                            <strong>The "Golden Cross":</strong> When a fast EMA (e.g., 20) crosses above a slow EMA (e.g., 50), it traditionally signals a bullish trend shift.
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Relative Strength Index (RSI)</h2>
                    </div>
                    <p>RSI is a <strong>Momentum Oscillator</strong>. it measures the speed and change of price movements on a scale of 0 to 100.</p>
                    <div className="math-grid-dense">
                        <div className="math-card">
                            <h4>{">"} 70: Overbought</h4>
                            <p>The price has moved too fast, too soon. Expect a pullback or consolidation.</p>
                        </div>
                        <div className="math-card">
                            <h4>{"<"} 30: Oversold</h4>
                            <p>The sellers are exhausted. Potential bounce zone.</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Convergence/Divergence (MACD)</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>The Momentum Engine</h3>
                        <p>MACD reveals the relationship between two moving averages. When the gap between them widens, momentum is increasing. When it shrinks (Convergence), the trend is weakening.</p>
                        <p className="warning-chip">Beware of "Divergence": When Price makes a new high but MACD makes a lower high. This is a classic warning of an impending reversal.</p>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Summary: Don't Indicators Overload</h3>
                    <p>Too many indicators lead to "Analysis Paralysis". Pick 2-3 that suit your style and master them.</p>
                    <Link to="/education" className="primary-btn">Next: VWAP Deep-Dive</Link>
                </div>
            </div>
        </div>
    );
};

export default Indicators;
