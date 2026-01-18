import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const TradingDiagnostics: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Performance Analytics</div>
                    <h1>Trading Diagnostics & Performance Metrics</h1>
                    <p className="hero-lead">Don't just track P&L. Track your efficiency, timing, and execution quality. Learn to diagnose what's working and what's costing you money.</p>
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
                        <h2>Understanding Trade Path Efficiency</h2>
                    </div>
                    <p>Two traders can have the same final P&L but vastly different trade quality. The <strong>path</strong> your trade takes determines your stress, risk, and capital efficiency.</p>

                    <div className="glass-card">
                        <h3>Path Dependency Example</h3>
                        <p><strong>Trader A and Trader B both make ₹5,000 profit on the same trade:</strong></p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>Trader A: Efficient Path</h4>
                                <ul>
                                    <li>Entry: ₹500</li>
                                    <li>Worst drawdown: ₹495 (-1%)</li>
                                    <li>Best peak: ₹550 (+10%)</li>
                                    <li>Exit: ₹550</li>
                                    <li><strong>Profit: ₹5,000</strong></li>
                                </ul>
                                <p style={{ marginTop: '0.5rem', color: '#22c55e' }}>✅ Clean trade, minimal stress, captured full move</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ef4444' }}>Trader B: Inefficient Path</h4>
                                <ul>
                                    <li>Entry: ₹500</li>
                                    <li>Worst drawdown: ₹450 (-10%)</li>
                                    <li>Best peak: ₹600 (+20%)</li>
                                    <li>Exit: ₹550</li>
                                    <li><strong>Profit: ₹5,000</strong></li>
                                </ul>
                                <p style={{ marginTop: '0.5rem', color: '#ef4444' }}>❌ High stress, poor timing, left ₹5,000 on table</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Key Insight:</strong> Trader B experienced 10x more drawdown and missed 50% of the potential profit. Same final P&L, but vastly different trade quality!</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>MAE: Max Adverse Excursion</h2>
                    </div>
                    <p><strong>MAE</strong> measures the worst drawdown your trade experienced. It reveals entry timing quality and risk tolerance.</p>

                    <div className="glass-card darker">
                        <h3>How MAE is Calculated</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p><strong>For Long Positions:</strong></p>
                            <p style={{ fontSize: '1.1rem' }}>MAE = Entry Price - Lowest Price Reached</p>
                            <p style={{ marginTop: '0.5rem' }}><strong>For Short Positions:</strong></p>
                            <p style={{ fontSize: '1.1rem' }}>MAE = Highest Price Reached - Entry Price</p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example: Long Trade</strong></p>
                            <ul>
                                <li>Entry: ₹1,000 (100 shares)</li>
                                <li>Lowest price during trade: ₹960</li>
                                <li>Exit: ₹1,050</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>MAE Calculation:</strong></p>
                            <p>Per Share: ₹1,000 - ₹960 = ₹40</p>
                            <p>Total: ₹40 × 100 = ₹4,000 max drawdown</p>
                            <p>Percentage: (₹40 / ₹1,000) × 100 = 4% MAE</p>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Final P&L:</strong></p>
                            <p>(₹1,050 - ₹1,000) × 100 = ₹5,000 profit</p>
                            <p style={{ color: '#fbbf24', marginTop: '0.5rem' }}><strong>Analysis:</strong> You endured ₹4,000 drawdown to make ₹5,000. Risk-reward was tight!</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>MFE: Max Favorable Excursion</h2>
                    </div>
                    <p><strong>MFE</strong> measures the best unrealized profit your trade reached. It reveals exit timing quality and profit capture efficiency.</p>

                    <div className="glass-card">
                        <h3>How MFE is Calculated</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p><strong>For Long Positions:</strong></p>
                            <p style={{ fontSize: '1.1rem' }}>MFE = Highest Price Reached - Entry Price</p>
                            <p style={{ marginTop: '0.5rem' }}><strong>For Short Positions:</strong></p>
                            <p style={{ fontSize: '1.1rem' }}>MFE = Entry Price - Lowest Price Reached</p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example: Long Trade</strong></p>
                            <ul>
                                <li>Entry: ₹500 (200 shares)</li>
                                <li>Highest price during trade: ₹580</li>
                                <li>Exit: ₹540</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <p><strong>MFE Calculation:</strong></p>
                            <p>Per Share: ₹580 - ₹500 = ₹80</p>
                            <p>Total: ₹80 × 200 = ₹16,000 max potential</p>
                            <p>Percentage: (₹80 / ₹500) × 100 = 16% MFE</p>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Actual P&L:</strong></p>
                            <p>(₹540 - ₹500) × 200 = ₹8,000 profit</p>
                            <p style={{ color: '#ef4444', marginTop: '0.5rem' }}><strong>Analysis:</strong> You left ₹8,000 on the table (50% of potential)! Exit timing needs work.</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Profit Capture Ratio</h2>
                    </div>
                    <p>This metric reveals how much of the available profit you actually captured. It's calculated by comparing your realized P&L to your MFE.</p>

                    <div className="glass-card darker">
                        <h3>The Formula</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}><strong>Profit Capture Ratio = (Realized P&L / MFE) × 100</strong></p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example from Previous Section:</strong></p>
                            <ul>
                                <li>MFE: ₹16,000</li>
                                <li>Realized P&L: ₹8,000</li>
                                <li>Capture Ratio: (₹8,000 / ₹16,000) × 100 = <strong>50%</strong></li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <h4>Interpreting Capture Ratios:</h4>
                            <table style={{ width: '100%', marginTop: '1rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Ratio</th>
                                        <th style={{ padding: '0.5rem' }}>Meaning</th>
                                        <th style={{ padding: '0.5rem' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>80-100%</td>
                                        <td style={{ padding: '0.5rem', color: '#22c55e' }}>Excellent</td>
                                        <td style={{ padding: '0.5rem' }}>Keep doing what you're doing</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>60-80%</td>
                                        <td style={{ padding: '0.5rem', color: '#22c55e' }}>Good</td>
                                        <td style={{ padding: '0.5rem' }}>Acceptable, minor improvements possible</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>40-60%</td>
                                        <td style={{ padding: '0.5rem', color: '#fbbf24' }}>Average</td>
                                        <td style={{ padding: '0.5rem' }}>Work on exit timing, use trailing stops</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>\u003c40%</td>
                                        <td style={{ padding: '0.5rem', color: '#ef4444' }}>Poor</td>
                                        <td style={{ padding: '0.5rem' }}>Major exit strategy overhaul needed</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Entry Quality Score</h2>
                    </div>
                    <p>Your entry quality is revealed by comparing MAE to your stop loss distance. Good entries minimize drawdown.</p>

                    <div className="glass-card">
                        <h3>Analyzing Entry Quality</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>✅ Excellent Entry</h4>
                                <p><strong>Scenario:</strong> Entry ₹500, Stop ₹480, MAE ₹495</p>
                                <p><strong>Analysis:</strong> MAE (₹5) \u003c Stop Distance (₹20)</p>
                                <p><strong>Meaning:</strong> Trade immediately moved in your favor. Perfect timing!</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#fbbf24' }}>⚠️ Average Entry</h4>
                                <p><strong>Scenario:</strong> Entry ₹500, Stop ₹480, MAE ₹485</p>
                                <p><strong>Analysis:</strong> MAE (₹15) ≈ 75% of Stop Distance (₹20)</p>
                                <p><strong>Meaning:</strong> Entry was okay but could be improved. Consider waiting for better setups.</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ef4444' }}>❌ Poor Entry</h4>
                                <p><strong>Scenario:</strong> Entry ₹500, Stop ₹480, MAE ₹475</p>
                                <p><strong>Analysis:</strong> MAE (₹25) \u003e Stop Distance (₹20)</p>
                                <p><strong>Meaning:</strong> You should have been stopped out! Either you moved your stop (bad) or your stop was too tight. Entry timing was poor - you chased the stock.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Win Rate vs Profit Factor</h2>
                    </div>
                    <p>Win rate alone is meaningless. A 90% win rate with small wins and huge losses is worse than 40% win rate with big wins.</p>

                    <div className="glass-card darker">
                        <h3>Understanding the Metrics</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p><strong>Win Rate:</strong> (Winning Trades / Total Trades) × 100</p>
                            <p style={{ marginTop: '0.5rem' }}><strong>Profit Factor:</strong> Total Profits / Total Losses</p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <h4>Example: High Win Rate, Low Profit Factor (BAD)</h4>
                            <p><strong>10 trades:</strong></p>
                            <ul>
                                <li>9 wins @ ₹500 each = ₹4,500</li>
                                <li>1 loss @ ₹5,000 = -₹5,000</li>
                                <li><strong>Win Rate:</strong> 90%</li>
                                <li><strong>Profit Factor:</strong> ₹4,500 / ₹5,000 = 0.9</li>
                                <li style={{ color: '#ef4444' }}><strong>Net P&L: -₹500 (LOSING!)</strong></li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <h4>Example: Low Win Rate, High Profit Factor (GOOD)</h4>
                            <p><strong>10 trades:</strong></p>
                            <ul>
                                <li>4 wins @ ₹3,000 each = ₹12,000</li>
                                <li>6 losses @ ₹500 each = -₹3,000</li>
                                <li><strong>Win Rate:</strong> 40%</li>
                                <li><strong>Profit Factor:</strong> ₹12,000 / ₹3,000 = 4.0</li>
                                <li style={{ color: '#22c55e' }}><strong>Net P&L: +₹9,000 (WINNING!)</strong></li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Target Profit Factor:</strong> Aim for 1.5+ (making ₹1.50 for every ₹1 lost)</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Average Hold Time Analysis</h2>
                    </div>
                    <p>How long you hold trades reveals your trading style and can highlight inefficiencies.</p>

                    <div className="glass-card">
                        <h3>Hold Time Patterns</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <h4>Winners vs Losers Hold Time</h4>
                                <p><strong>Ideal Pattern:</strong> Winners held longer than losers</p>
                                <ul>
                                    <li>Average winning trade: 5 days</li>
                                    <li>Average losing trade: 2 days</li>
                                    <li style={{ color: '#22c55e' }}><strong>✅ Good! "Cut losses short, let winners run"</strong></li>
                                </ul>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                <h4>❌ Problem Pattern</h4>
                                <p><strong>Bad Pattern:</strong> Losers held longer than winners</p>
                                <ul>
                                    <li>Average winning trade: 1 day</li>
                                    <li>Average losing trade: 7 days</li>
                                    <li style={{ color: '#ef4444' }}><strong>❌ Bad! "Taking profits too early, holding losers hoping for recovery"</strong></li>
                                </ul>
                                <p style={{ marginTop: '0.5rem' }}>This is the #1 mistake retail traders make!</p>
                            </div>
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
                            <li>✅ <strong>Track trade path, not just P&L</strong> - Two identical profits can have vastly different quality</li>
                            <li>✅ <strong>MAE reveals entry quality</strong> - Lower MAE = better timing</li>
                            <li>✅ <strong>MFE reveals exit quality</strong> - Higher capture ratio = better exits</li>
                            <li>✅ <strong>Target 60%+ profit capture ratio</strong> - Capturing most of available profit</li>
                            <li>✅ <strong>MAE should be \u003c stop distance</strong> - If MAE \u003e stop, entry was poor</li>
                            <li>✅ <strong>Win rate alone is meaningless</strong> - Focus on profit factor (1.5+ target)</li>
                            <li>✅ <strong>Hold winners longer than losers</strong> - Classic "cut losses, let winners run"</li>
                            <li>✅ <strong>Review trades weekly</strong> - Identify patterns in your MAE/MFE data</li>
                            <li>✅ <strong>Keep a trading journal</strong> - Document what worked and what didn't</li>
                            <li>✅ <strong>Focus on process, not outcomes</strong> - Good process leads to good results over time</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master Your Metrics</h3>
                    <p>Professional traders review their diagnostics daily. Use these metrics to continuously improve your entry timing, exit discipline, and overall trade quality.</p>
                    <Link to="/education/indicators" className="primary-btn">Learn Technical Indicators</Link>
                </div>
            </div>
        </div>
    );
};

export default TradingDiagnostics;
