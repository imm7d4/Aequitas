import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const ReadingPrices: React.FC = () => {
    return (
        <div className="custom-module-page chart-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Market Psychology</div>
                    <h1>Reading Prices & Charts</h1>
                    <p className="hero-lead">Prices aren't numbers; they are records of human negotiation. Learn the 'Auction Model' and how Aequitas turns raw ticks into visual stories.</p>
                </div>
                <div className="hero-visual">
                    <div className="candle-anatomy-hero">
                        <div className="wick"></div>
                        <div className="body green"></div>
                        <div className="wick"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The "Auction Model" Mental Model</h2>
                    </div>
                    <p>Every price update (LTP) is a <strong>Successful Negotiation</strong>. If the Last Traded Price is ₹1,050, it means a buyer and seller agreed that this was a fair exchange in that microsecond.</p>
                    <div className="glass-card">
                        <h3>Anatomy of a Battle Report</h3>
                        <div className="battle-report-anatomy">
                            <div className="report-item">
                                <strong>The Open</strong>
                                <span>The first handshake of the minute.</span>
                            </div>
                            <div className="report-item">
                                <strong>The High/Low</strong>
                                <span>The extreme limits of what the buyer or seller could tolerate.</span>
                            </div>
                            <div className="report-item">
                                <strong>The Close</strong>
                                <span>The final consensus before time ran out.</span>
                            </div>
                        </div>
                        <p>When the Close <code>{">"}</code> Open, the "Bulls" won the period. When Close <code>{"<"}</code> Open, the "Bears" successfully pushed the value down.</p>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Aggregation Scales (Raw Ticks &rarr; OHLC)</h2>
                    </div>
                    <p>The Aequitas backend receives thousands of raw trade ticks. To make sense of them, we aggregate them into <strong>Timeframes</strong>. This is done in the <code>CandleService</code>.</p>

                    <div className="timeframe-grid">
                        <div className="tf-card">
                            <h4>1-Minute (1m)</h4>
                            <p>The heartbeat of scalpers. Shows raw volatility and immediate imbalances.</p>
                            <div className="tag">High Density</div>
                        </div>
                        <div className="tf-card">
                            <h4>5-Minute (5m)</h4>
                            <p>Filters out the "noise". Used by intraday traders to spot trends.</p>
                            <div className="tag">Balanced</div>
                        </div>
                        <div className="tf-card">
                            <h4>Daily (D)</h4>
                            <p>The "Zoom Out" view. Shows the long-term intent of institutional players.</p>
                            <div className="tag">Strategic</div>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>The Gaps & Slippage Reality</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>Price Jump Discontinuity</h3>
                        <p>Price does not always move in ₹0.05 increments. If a major news event hits, the price might jump from ₹100 to ₹105 without trading at ₹101, ₹102, etc. These are called <strong>Gaps</strong>.</p>
                        <div className="info-box warning">
                            <strong>Platform Impact:</strong> In <code>MatchingService.go</code>, if your Limit Order is at ₹102 but the price jumps to ₹105, we fill you at ₹105 (Market Price). This is why your actual fill might be "Better" than the chart line.
                        </div>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Summary: Don't Chase the Candle</h3>
                    <p>Charts are lagging indicators. The "Real Truth" is always the Order Book (which we cover in the next module).</p>
                    <Link to="/education" className="primary-btn">View Order Book Guide</Link>
                </div>
            </div>
        </div>
    );
};

export default ReadingPrices;
