import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

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
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>What Are Technical Indicators?</h2>
                    </div>
                    <p>Technical indicators are mathematical calculations based on price, volume, or open interest. They help traders identify trends, momentum, volatility, and potential reversal points.</p>

                    <div className="glass-card">
                        <h3>The Four Main Categories</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>1. Trend Indicators</h4>
                                <p><strong>Purpose:</strong> Identify direction and strength of trends</p>
                                <p><strong>Examples:</strong> Moving Averages, MACD, ADX</p>
                                <p><strong>Best For:</strong> Trending markets</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#3b82f6' }}>2. Momentum Indicators</h4>
                                <p><strong>Purpose:</strong> Measure speed of price changes</p>
                                <p><strong>Examples:</strong> RSI, Stochastic, ROC</p>
                                <p><strong>Best For:</strong> Identifying overbought/oversold conditions</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#fbbf24' }}>3. Volatility Indicators</h4>
                                <p><strong>Purpose:</strong> Measure price fluctuation intensity</p>
                                <p><strong>Examples:</strong> Bollinger Bands, ATR</p>
                                <p><strong>Best For:</strong> Gauging market uncertainty and breakout potential</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#a855f7' }}>4. Volume Indicators</h4>
                                <p><strong>Purpose:</strong> Confirm price movements with volume</p>
                                <p><strong>Examples:</strong> OBV, Volume Profile, VWAP</p>
                                <p><strong>Best For:</strong> Validating trends and spotting divergences</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Moving Averages: The Foundation</h2>
                    </div>
                    <p>Moving averages smooth out price data to create a constantly updating average price. They're the building block for many other indicators.</p>

                    <div className="glass-card darker">
                        <h3>Simple Moving Average (SMA)</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.1rem' }}><strong>Formula:</strong> SMA = Sum of Prices / Number of Periods</p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example: 5-Day SMA</strong></p>
                            <p>Last 5 closing prices: ₹100, ₹102, ₹101, ₹103, ₹104</p>
                            <p>SMA = (100 + 102 + 101 + 103 + 104) / 5 = <strong>₹102</strong></p>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <h4>Exponential Moving Average (EMA)</h4>
                            <p><strong>Difference:</strong> Gives more weight to recent prices</p>
                            <p><strong>Advantage:</strong> Reacts faster to price changes</p>
                            <p><strong>Use Case:</strong> Better for short-term trading and fast-moving markets</p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <h4>Common MA Periods</h4>
                            <ul>
                                <li><strong>20-day MA:</strong> Short-term trend (1 month)</li>
                                <li><strong>50-day MA:</strong> Intermediate trend (2.5 months)</li>
                                <li><strong>200-day MA:</strong> Long-term trend (10 months)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Moving Average Crossovers</h2>
                    </div>
                    <p>When a fast MA crosses a slow MA, it signals a potential trend change. This is one of the most popular trading strategies.</p>

                    <div className="glass-card">
                        <h3>The Golden Cross & Death Cross</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>✅ Golden Cross (Bullish)</h4>
                                <p><strong>Signal:</strong> 50-day MA crosses ABOVE 200-day MA</p>
                                <p><strong>Meaning:</strong> Short-term momentum exceeds long-term trend</p>
                                <p><strong>Action:</strong> Consider buying or holding long positions</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Stock at ₹500, 50-day MA crosses above 200-day MA → Bullish signal, potential uptrend starting</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ef4444' }}>❌ Death Cross (Bearish)</h4>
                                <p><strong>Signal:</strong> 50-day MA crosses BELOW 200-day MA</p>
                                <p><strong>Meaning:</strong> Short-term momentum weakening</p>
                                <p><strong>Action:</strong> Consider selling or avoiding long positions</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Stock at ₹500, 50-day MA crosses below 200-day MA → Bearish signal, potential downtrend starting</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                            <p><strong>⚠️ Warning:</strong> Crossovers are lagging indicators. By the time the cross happens, the move may already be underway. Use in combination with other indicators!</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>RSI: Relative Strength Index</h2>
                    </div>
                    <p>RSI measures momentum on a scale of 0-100. It identifies overbought and oversold conditions.</p>

                    <div className="glass-card darker">
                        <h3>Understanding RSI</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p><strong>Formula:</strong> RSI = 100 - [100 / (1 + RS)]</p>
                            <p>Where RS = Average Gain / Average Loss over 14 periods</p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <h4>RSI Zones</h4>
                            <table style={{ width: '100%', marginTop: '1rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>RSI Value</th>
                                        <th style={{ padding: '0.5rem' }}>Zone</th>
                                        <th style={{ padding: '0.5rem' }}>Interpretation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>70-100</td>
                                        <td style={{ padding: '0.5rem', color: '#ef4444' }}>Overbought</td>
                                        <td style={{ padding: '0.5rem' }}>Potential pullback or consolidation</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>50-70</td>
                                        <td style={{ padding: '0.5rem', color: '#22c55e' }}>Bullish</td>
                                        <td style={{ padding: '0.5rem' }}>Healthy uptrend</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>30-50</td>
                                        <td style={{ padding: '0.5rem', color: '#ef4444' }}>Bearish</td>
                                        <td style={{ padding: '0.5rem' }}>Downtrend or weakness</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>0-30</td>
                                        <td style={{ padding: '0.5rem', color: '#22c55e' }}>Oversold</td>
                                        <td style={{ padding: '0.5rem' }}>Potential bounce or reversal</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <h4>Trading Strategy Example</h4>
                            <p><strong>Buy Signal:</strong> RSI drops below 30 (oversold), then crosses back above 30</p>
                            <p><strong>Sell Signal:</strong> RSI rises above 70 (overbought), then crosses back below 70</p>
                            <p style={{ marginTop: '0.5rem', color: '#fbbf24' }}><strong>Note:</strong> In strong trends, RSI can stay overbought/oversold for extended periods. Don't fight the trend!</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>MACD: Moving Average Convergence Divergence</h2>
                    </div>
                    <p>MACD shows the relationship between two moving averages. It reveals momentum changes and potential trend reversals.</p>

                    <div className="glass-card">
                        <h3>MACD Components</h3>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>1. MACD Line:</strong> 12-day EMA - 26-day EMA</p>
                            <p><strong>2. Signal Line:</strong> 9-day EMA of MACD Line</p>
                            <p><strong>3. Histogram:</strong> MACD Line - Signal Line</p>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <h4>How to Read MACD</h4>
                            <ul>
                                <li><strong>MACD crosses above Signal Line:</strong> Bullish signal (buy)</li>
                                <li><strong>MACD crosses below Signal Line:</strong> Bearish signal (sell)</li>
                                <li><strong>MACD crosses above zero:</strong> Uptrend confirmation</li>
                                <li><strong>MACD crosses below zero:</strong> Downtrend confirmation</li>
                                <li><strong>Histogram expanding:</strong> Momentum increasing</li>
                                <li><strong>Histogram contracting:</strong> Momentum weakening</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <h4>⚠️ Divergence Warning</h4>
                            <p><strong>Bearish Divergence:</strong> Price makes new high, but MACD makes lower high</p>
                            <p><strong>Meaning:</strong> Momentum is weakening despite price rise → Potential reversal</p>
                            <p style={{ marginTop: '0.5rem' }}><strong>Bullish Divergence:</strong> Price makes new low, but MACD makes higher low</p>
                            <p><strong>Meaning:</strong> Selling pressure weakening → Potential bounce</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Bollinger Bands</h2>
                    </div>
                    <p>Bollinger Bands measure volatility and identify overbought/oversold conditions relative to recent price action.</p>

                    <div className="glass-card darker">
                        <h3>Band Construction</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p><strong>Middle Band:</strong> 20-day SMA</p>
                            <p><strong>Upper Band:</strong> Middle Band + (2 × Standard Deviation)</p>
                            <p><strong>Lower Band:</strong> Middle Band - (2 × Standard Deviation)</p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <h4>Trading Strategies</h4>

                            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <h4>1. Band Squeeze (Low Volatility)</h4>
                                    <p><strong>Signal:</strong> Bands narrow significantly</p>
                                    <p><strong>Meaning:</strong> Volatility compression → Big move coming soon</p>
                                    <p><strong>Action:</strong> Prepare for breakout in either direction</p>
                                </div>

                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <h4>2. Band Touch (Mean Reversion)</h4>
                                    <p><strong>Signal:</strong> Price touches upper band</p>
                                    <p><strong>Meaning:</strong> Potentially overbought → May pull back to middle</p>
                                    <p><strong>Signal:</strong> Price touches lower band</p>
                                    <p><strong>Meaning:</strong> Potentially oversold → May bounce to middle</p>
                                </div>

                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <h4>3. Band Walk (Strong Trend)</h4>
                                    <p><strong>Signal:</strong> Price consistently hugs upper band</p>
                                    <p><strong>Meaning:</strong> Very strong uptrend → Don't short!</p>
                                    <p><strong>Signal:</strong> Price consistently hugs lower band</p>
                                    <p><strong>Meaning:</strong> Very strong downtrend → Don't buy!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Combining Indicators</h2>
                    </div>
                    <p>No single indicator is perfect. Combining multiple indicators reduces false signals and increases confidence.</p>

                    <div className="glass-card">
                        <h3>Example: Triple Confirmation Strategy</h3>

                        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', marginTop: '1.5rem' }}>
                            <h4>✅ Strong Buy Signal (All 3 Agree)</h4>
                            <p><strong>1. Trend:</strong> Price above 50-day MA (uptrend confirmed)</p>
                            <p><strong>2. Momentum:</strong> RSI crosses above 30 from oversold (momentum turning positive)</p>
                            <p><strong>3. Volume:</strong> Volume increasing on up days (buying pressure confirmed)</p>
                            <p style={{ marginTop: '0.5rem', color: '#22c55e' }}><strong>Action:</strong> High-confidence buy signal!</p>
                        </div>

                        <div style={{ padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', marginTop: '1rem' }}>
                            <h4>⚠️ Conflicting Signals (Mixed)</h4>
                            <p><strong>1. Trend:</strong> Price above 50-day MA (bullish)</p>
                            <p><strong>2. Momentum:</strong> RSI at 75 (overbought - bearish)</p>
                            <p><strong>3. Volume:</strong> Volume declining (weak - bearish)</p>
                            <p style={{ marginTop: '0.5rem', color: '#fbbf24' }}><strong>Action:</strong> Wait for clearer signals or reduce position size</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Common Indicator Mistakes</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div className="glass-card danger">
                            <h4>❌ Mistake 1: Indicator Overload</h4>
                            <p><strong>Error:</strong> Using 10+ indicators on one chart</p>
                            <p><strong>Reality:</strong> Analysis paralysis - too many conflicting signals</p>
                            <p><strong>Fix:</strong> Use 2-3 complementary indicators maximum (1 trend + 1 momentum + 1 volume)</p>
                        </div>

                        <div className="glass-card danger">
                            <h4>❌ Mistake 2: Ignoring Price Action</h4>
                            <p><strong>Error:</strong> Following indicators blindly without looking at price</p>
                            <p><strong>Reality:</strong> Indicators lag price - price is king!</p>
                            <p><strong>Fix:</strong> Use indicators to confirm what price is already showing</p>
                        </div>

                        <div className="glass-card danger">
                            <h4>❌ Mistake 3: Same Settings for All Stocks</h4>
                            <p><strong>Error:</strong> Using 14-period RSI for both volatile and stable stocks</p>
                            <p><strong>Reality:</strong> Different stocks need different settings</p>
                            <p><strong>Fix:</strong> Adjust periods based on stock volatility and your timeframe</p>
                        </div>

                        <div className="glass-card danger">
                            <h4>❌ Mistake 4: Fighting the Trend</h4>
                            <p><strong>Error:</strong> Shorting because RSI is overbought in strong uptrend</p>
                            <p><strong>Reality:</strong> RSI can stay overbought for weeks in strong trends</p>
                            <p><strong>Fix:</strong> Trade with the trend, not against it</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">09</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Indicators are tools, not crystal balls</strong> - They help filter noise, not predict future</li>
                            <li>✅ <strong>Moving averages identify trends</strong> - 50/200 day crossovers signal major shifts</li>
                            <li>✅ <strong>RSI shows momentum</strong> - \u003c30 oversold, \u003e70 overbought, but can stay extreme in trends</li>
                            <li>✅ <strong>MACD reveals momentum changes</strong> - Watch for crossovers and divergences</li>
                            <li>✅ <strong>Bollinger Bands measure volatility</strong> - Squeeze = breakout coming, walk = strong trend</li>
                            <li>✅ <strong>Combine indicators for confirmation</strong> - Trend + Momentum + Volume = high confidence</li>
                            <li>✅ <strong>Use 2-3 indicators maximum</strong> - More isn't better, it's confusing</li>
                            <li>✅ <strong>Price action is king</strong> - Indicators confirm, price leads</li>
                            <li>✅ <strong>Adjust settings for each stock</strong> - Volatile stocks need different parameters</li>
                            <li>✅ <strong>Don't fight strong trends</strong> - Overbought can get more overbought</li>
                            <li>✅ <strong>Watch for divergences</strong> - Price vs indicator disagreement signals reversals</li>
                            <li>✅ <strong>Backtest your strategy</strong> - Verify indicators work for your style before trading real money</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master the Basics First</h3>
                    <p>Start with one indicator from each category: Moving Averages (trend), RSI (momentum), and Volume. Master these before adding more complexity.</p>
                    <Link to="/education/vwap-volume" className="primary-btn">Learn VWAP & Volume</Link>
                </div>
            </div>
        </div>
    );
};

export default Indicators;
