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
                    <h1>VWAP & Volume Profile Mastery</h1>
                    <p className="hero-lead">Price is what you pay; Volume is the proof. VWAP is the "Fair Value" benchmark used by institutional algorithms to execute billion-dollar trades. Learn to trade like the big players.</p>
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
                        <h2>What is VWAP?</h2>
                    </div>
                    <p><strong>VWAP (Volume Weighted Average Price)</strong> is the average price a stock traded at throughout the day, weighted by volume. It represents the true average price paid per share.</p>

                    <div className="glass-card">
                        <h3>Why VWAP Matters</h3>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Institutional Benchmark:</strong></p>
                            <ul>
                                <li>Fund managers are judged on whether they bought below or sold above VWAP</li>
                                <li>Buying above VWAP = Poor execution (paid more than average)</li>
                                <li>Selling below VWAP = Poor execution (received less than average)</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                            <p><strong>For Retail Traders:</strong></p>
                            <ul>
                                <li>VWAP acts as dynamic support/resistance</li>
                                <li>Price above VWAP = Bullish (buyers in control)</li>
                                <li>Price below VWAP = Bearish (sellers in control)</li>
                                <li>Price bouncing off VWAP = Strong support/resistance level</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>How VWAP is Calculated</h2>
                    </div>
                    <p>VWAP is calculated by taking the sum of (Price × Volume) for each trade, divided by total volume.</p>

                    <div className="glass-card darker">
                        <h3>The Formula</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}><strong>VWAP = Σ (Price × Volume) / Σ Volume</strong></p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example Calculation:</strong></p>
                            <table style={{ width: '100%', marginTop: '1rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ padding: '0.5rem' }}>Time</th>
                                        <th style={{ padding: '0.5rem' }}>Price</th>
                                        <th style={{ padding: '0.5rem' }}>Volume</th>
                                        <th style={{ padding: '0.5rem' }}>Price × Volume</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>9:15 AM</td>
                                        <td style={{ padding: '0.5rem' }}>₹500</td>
                                        <td style={{ padding: '0.5rem' }}>1,000</td>
                                        <td style={{ padding: '0.5rem' }}>₹5,00,000</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>9:30 AM</td>
                                        <td style={{ padding: '0.5rem' }}>₹505</td>
                                        <td style={{ padding: '0.5rem' }}>2,000</td>
                                        <td style={{ padding: '0.5rem' }}>₹10,10,000</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>9:45 AM</td>
                                        <td style={{ padding: '0.5rem' }}>₹510</td>
                                        <td style={{ padding: '0.5rem' }}>1,500</td>
                                        <td style={{ padding: '0.5rem' }}>₹7,65,000</td>
                                    </tr>
                                    <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)', fontWeight: 'bold' }}>
                                        <td style={{ padding: '0.5rem' }}>Total</td>
                                        <td style={{ padding: '0.5rem' }}>-</td>
                                        <td style={{ padding: '0.5rem' }}>4,500</td>
                                        <td style={{ padding: '0.5rem' }}>₹22,75,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <p><strong>VWAP = ₹22,75,000 / 4,500 = ₹505.56</strong></p>
                            <p style={{ marginTop: '0.5rem' }}>This means the average price paid per share (weighted by volume) is ₹505.56</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Trading with VWAP</h2>
                    </div>
                    <p>VWAP provides clear trading signals based on price position relative to the line.</p>

                    <div className="glass-card">
                        <h3>VWAP Trading Strategies</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>✅ Strategy 1: VWAP Bounce (Mean Reversion)</h4>
                                <p><strong>Setup:</strong> Price pulls back to VWAP in an uptrend</p>
                                <p><strong>Entry:</strong> Buy when price bounces off VWAP with volume confirmation</p>
                                <p><strong>Stop Loss:</strong> Below VWAP (typically 0.5-1% below)</p>
                                <p><strong>Target:</strong> Previous high or resistance level</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Stock trending up, pulls back from ₹520 to ₹505 (VWAP), bounces with volume → Buy at ₹506, stop at ₹503, target ₹520</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#3b82f6' }}>✅ Strategy 2: VWAP Breakout</h4>
                                <p><strong>Setup:</strong> Price consolidating below VWAP</p>
                                <p><strong>Entry:</strong> Buy when price breaks above VWAP with strong volume</p>
                                <p><strong>Stop Loss:</strong> Below recent low</p>
                                <p><strong>Target:</strong> 2-3% above VWAP</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Stock at ₹495, VWAP at ₹500, breaks to ₹502 with 2x volume → Buy at ₹502, stop at ₹497, target ₹510-515</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#a855f7' }}>✅ Strategy 3: VWAP Fade (Contrarian)</h4>
                                <p><strong>Setup:</strong> Price extends far from VWAP (2%+)</p>
                                <p><strong>Entry:</strong> Short when price is 2-3% above VWAP with weakening volume</p>
                                <p><strong>Stop Loss:</strong> Above recent high</p>
                                <p><strong>Target:</strong> VWAP</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Stock spikes to ₹520 (3% above ₹505 VWAP) on low volume → Short at ₹518, stop at ₹523, target ₹505</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Volume Profile: Horizontal Volume</h2>
                    </div>
                    <p>While regular volume shows WHEN trades happened, Volume Profile shows AT WHAT PRICE they happened. This reveals where the most trading activity occurred.</p>

                    <div className="glass-card darker">
                        <h3>Understanding Volume Profile</h3>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Key Concepts:</strong></p>
                            <ul>
                                <li><strong>Point of Control (POC):</strong> Price level with highest volume</li>
                                <li><strong>Value Area:</strong> Price range containing 70% of volume</li>
                                <li><strong>High Volume Nodes:</strong> Price levels with significant trading</li>
                                <li><strong>Low Volume Nodes:</strong> Price levels with minimal trading</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <h4>How to Read Volume Profile</h4>
                            <p><strong>High Volume Nodes (POC):</strong></p>
                            <ul>
                                <li>Act as strong support/resistance</li>
                                <li>Price tends to return to these levels</li>
                                <li>Difficult for price to move through quickly</li>
                            </ul>
                            <p style={{ marginTop: '1rem' }}><strong>Low Volume Nodes:</strong></p>
                            <ul>
                                <li>Price moves through quickly (gaps)</li>
                                <li>Weak support/resistance</li>
                                <li>Potential for fast price movement</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Trading with Volume Profile</h2>
                    </div>
                    <p>Volume Profile helps identify high-probability support/resistance zones and potential breakout areas.</p>

                    <div className="glass-card">
                        <h3>Volume Profile Strategies</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>Strategy 1: POC Support/Resistance</h4>
                                <p><strong>Concept:</strong> POC acts as magnet for price</p>
                                <p><strong>Example:</strong></p>
                                <ul>
                                    <li>POC at ₹500 (highest volume traded here)</li>
                                    <li>Price at ₹520 → Likely to pull back toward ₹500</li>
                                    <li>Price at ₹480 → Likely to bounce toward ₹500</li>
                                </ul>
                                <p style={{ marginTop: '0.5rem' }}><strong>Trade:</strong> Buy near POC in uptrend, sell near POC in downtrend</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#3b82f6' }}>Strategy 2: Low Volume Node Breakout</h4>
                                <p><strong>Concept:</strong> Price accelerates through low volume areas</p>
                                <p><strong>Example:</strong></p>
                                <ul>
                                    <li>Low volume node between ₹505-510</li>
                                    <li>Price breaks above ₹505 → Expect fast move to ₹510+</li>
                                    <li>Minimal resistance in this zone</li>
                                </ul>
                                <p style={{ marginTop: '0.5rem' }}><strong>Trade:</strong> Enter on breakout, target next high volume node</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#a855f7' }}>Strategy 3: Value Area Rejection</h4>
                                <p><strong>Concept:</strong> Price rejecting value area signals trend continuation</p>
                                <p><strong>Example:</strong></p>
                                <ul>
                                    <li>Value Area: ₹495-505 (70% of volume)</li>
                                    <li>Price drops to ₹495, immediately bounces → Strong support</li>
                                    <li>Buyers defending value area</li>
                                </ul>
                                <p style={{ marginTop: '0.5rem' }}><strong>Trade:</strong> Buy at value area low, stop below, target value area high</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Volume Analysis Techniques</h2>
                    </div>
                    <p>Volume confirms price movements. High volume validates trends, low volume suggests weakness.</p>

                    <div className="glass-card darker">
                        <h3>Volume Confirmation Signals</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>✅ Bullish Volume Patterns</h4>
                                <ul>
                                    <li><strong>Volume increasing on up days:</strong> Strong buying pressure</li>
                                    <li><strong>Volume decreasing on down days:</strong> Weak selling pressure</li>
                                    <li><strong>Breakout with 2x+ volume:</strong> Valid breakout</li>
                                    <li><strong>Accumulation (high volume, tight range):</strong> Big players buying</li>
                                </ul>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ef4444' }}>❌ Bearish Volume Patterns</h4>
                                <ul>
                                    <li><strong>Volume increasing on down days:</strong> Strong selling pressure</li>
                                    <li><strong>Volume decreasing on up days:</strong> Weak buying pressure</li>
                                    <li><strong>Breakout with low volume:</strong> Likely false breakout</li>
                                    <li><strong>Distribution (high volume, price dropping):</strong> Big players selling</li>
                                </ul>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                            <h4>⚠️ Volume Climax</h4>
                            <p><strong>Signal:</strong> Massive volume spike with small price movement</p>
                            <p><strong>Meaning:</strong> Absorption - big player blocking the move</p>
                            <p><strong>Example:</strong> Stock at ₹500, volume spikes 5x normal, but price only moves to ₹501</p>
                            <p style={{ marginTop: '0.5rem', color: '#fbbf24' }}><strong>Interpretation:</strong> Someone is absorbing all the buying/selling → Potential reversal coming</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Combining VWAP and Volume Profile</h2>
                    </div>
                    <p>Using both tools together provides powerful confluence for trade entries.</p>

                    <div className="glass-card">
                        <h3>High-Probability Setup Example</h3>

                        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', marginTop: '1.5rem' }}>
                            <h4 style={{ color: '#22c55e' }}>✅ Triple Confluence Buy Signal</h4>
                            <p><strong>Setup:</strong></p>
                            <ul>
                                <li><strong>1. VWAP:</strong> Price bouncing off VWAP at ₹500</li>
                                <li><strong>2. Volume Profile:</strong> POC (highest volume) also at ₹500</li>
                                <li><strong>3. Volume:</strong> Bounce happening with 2x normal volume</li>
                            </ul>
                            <p style={{ marginTop: '1rem' }}><strong>Analysis:</strong></p>
                            <p>Three independent signals all pointing to ₹500 as strong support:</p>
                            <ul>
                                <li>Institutions defending VWAP</li>
                                <li>Historical high volume at this price (POC)</li>
                                <li>Current volume confirming buying interest</li>
                            </ul>
                            <p style={{ marginTop: '1rem', color: '#22c55e' }}><strong>Trade:</strong> Buy at ₹501, stop at ₹497, target ₹510+ (very high probability setup!)</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>VWAP = institutional benchmark</strong> - Average price weighted by volume</li>
                            <li>✅ <strong>Price above VWAP = bullish</strong> - Buyers in control</li>
                            <li>✅ <strong>Price below VWAP = bearish</strong> - Sellers in control</li>
                            <li>✅ <strong>VWAP acts as dynamic support/resistance</strong> - Price tends to bounce off it</li>
                            <li>✅ <strong>Volume Profile shows price distribution</strong> - Where most trading occurred</li>
                            <li>✅ <strong>POC = highest volume price</strong> - Acts as magnet for price</li>
                            <li>✅ <strong>Low volume nodes = fast price movement</strong> - Minimal resistance</li>
                            <li>✅ <strong>High volume confirms trends</strong> - Low volume suggests weakness</li>
                            <li>✅ <strong>Volume climax signals reversals</strong> - Huge volume, small price move = absorption</li>
                            <li>✅ <strong>Combine VWAP + Volume Profile</strong> - Confluence increases probability</li>
                            <li>✅ <strong>Breakouts need volume</strong> - 2x+ normal volume validates breakout</li>
                            <li>✅ <strong>VWAP resets daily</strong> - Fresh calculation each trading day</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Trade Like Institutions</h3>
                    <p>VWAP and Volume Profile are professional-grade tools. Master them to understand where big money is positioned and trade with the smart money, not against it.</p>
                    <Link to="/education/liquidity-metrics" className="primary-btn">Learn Liquidity Metrics</Link>
                </div>
            </div>
        </div>
    );
};

export default VWAPVolume;
