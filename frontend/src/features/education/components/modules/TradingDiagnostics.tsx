import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const TradingDiagnostics: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Quant Intelligence</div>
                    <h1>Trading Diagnostics & Metrics</h1>
                    <p className="hero-lead">Don't just track P&L. Track your efficiency. Aequitas reveals the "Path Dependency" of your trades using institutional-grade math.</p>
                </div>
                <div className="hero-visual">
                    <div className="diagnostic-pulse-visual">
                        <div className="pulse-circle"></div>
                        <div className="data-lines">
                            <span>MAE</span>
                            <span>MFE</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The "Economic Unit" Model (FIFO)</h2>
                    </div>
                    <p>Unlike standard trading accounts that just show "Average Price", Aequitas uses an <strong>Active Unit FIFO Engine</strong>. It treats every entry as a living object until it is explicitly 'Square Offed'.</p>
                    <div className="glass-card">
                        <h3>Path Dependency</h3>
                        <p>Profitable trading isn't about the final P&L; it's about the "efficiency of the path". <strong>The path determines your psychological stress and capital risk.</strong> This calculation is handled by the <code>AnalyticsService</code>.</p>

                        <div className="fifo-visual">
                            <div className="entry-bin">Entry (100)</div>
                            <div className="process-space">
                                <div className="swing down">MAE (-10)</div>
                                <div className="swing up">MFE (+15)</div>
                            </div>
                            <div className="exit-bin">Exit (110)</div>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Key Metrics: MAE & MFE Math</h2>
                    </div>
                    <p>The <code>AnalyticsService</code> calculates these extremes differentiated by your position side (Long vs Short).</p>

                    <div className="metrics-expanded-grid">
                        <div className="metric-box mae">
                            <h4>Max Adverse Excursion (MAE)</h4>
                            <div className="math">Long: Min(Price) - Entry</div>
                            <div className="math">Short: Max(Price) - Entry</div>
                            <p>The furthest the price moved <em>against</em> you. High MAE indicates poor entry timing or "chasing" the market. (Calculated via <code>TradeRepository</code> fallback).</p>
                            <span className="insight">Critical: MAE {">"} StopLoss means your stop was badly placed or skipped.</span>
                        </div>
                        <div className="metric-box mfe">
                            <h4>Max Favorable Excursion (MFE)</h4>
                            <div className="math">Long: Max(Price) - Entry</div>
                            <div className="math">Short: Min(Price) - Entry</div>
                            <p>The "Potential" of the trade. The maximum theoretical profit you could have captured if you were a perfect timer.</p>
                            <span className="insight">Insight: Higher MFE with low P&L means you are "Leaving money on the table".</span>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Tiered Data Priority</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>How we find the "Highs and Lows"</h3>
                        <p>To calculate MAE/MFE, we don't just look at when you clicked. We scan history using a priority fallback system:</p>
                        <ul className="technical-list">
                            <li><strong>Priority 1 (Intraday Candles):</strong> We search the 1-minute OHLC database between your Entry and Exit timestamps.</li>
                            <li><strong>Priority 2 (Execution Ticks):</strong> If candles are missing, we use your actual trade ticks recorded in the <code>TradeRepository</code>.</li>
                            <li><strong>Priority 3 (LTP Fallback):</strong> Lowest accuracy—uses only the Start and End prices.</li>
                        </ul>
                        <div className="info-box logic">
                            <strong>Platform Advantage:</strong> This ensures that even in volatile markets where a database might miss a tick, your diagnostics stay theoretically sound.
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Opportunity Cost (The Invisible Fee)</h2>
                    </div>
                    <div className="efficiency-meter-ui">
                        <div className="math">Cost = ExecutionPrice - NextMinuteOpen</div>
                        <p>If you hesitate and the price moves before your order hits the engine, you've paid an "Opportunity Cost". In Aequitas, we track this to show you if your internet or your reaction speed is hurting your edge.</p>
                        <div className="meter-bar">
                            <div className="fill" style={{ width: '85%' }}></div>
                        </div>
                        <p className="meter-desc">Efficiency: 85% (Low Hesitation). Your Execution was near the minute's optimal price.</p>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Data is the Edge</h3>
                    <p>Professional traders review their MAE/MFE every day. Use the Diagnostics Dashboard to refine your entry timing and exit patience.</p>
                    <Link to="/diagnostics" className="primary-btn">Analyze My Trades</Link>
                </div>
            </div>
        </div>
    );
};

export default TradingDiagnostics;
