import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const TradeAnalytics: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill success">Performance Mastery</div>
                    <h1>Post-Trade Analytics & Performance Review</h1>
                    <p className="hero-lead">The real work begins after the trade is closed. Learn to audit your performance, identify systemic leaks in your strategy, and continuously improve your edge.</p>
                </div>
                <div className="hero-visual">
                    <div className="analytics-visual">
                        <div className="radar-ping"></div>
                        <div className="data-points"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>Why Post-Trade Analysis Matters</h2>
                    </div>
                    <p>Most traders focus on finding the next trade. Professionals focus on learning from past trades. <strong>Your trading journal is more valuable than any indicator.</strong></p>

                    <div className="glass-card">
                        <h3>The Performance Feedback Loop</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                                <p><strong>1. Execute Trade</strong> → Follow your strategy</p>
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px', borderLeft: '4px solid #a855f7' }}>
                                <p><strong>2. Record Details</strong> → Entry, exit, reasoning, emotions</p>
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', borderLeft: '4px solid #fbbf24' }}>
                                <p><strong>3. Analyze Results</strong> → What worked? What didn't?</p>
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', borderLeft: '4px solid #22c55e' }}>
                                <p><strong>4. Refine Strategy</strong> → Adjust based on data</p>
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                                <p><strong>5. Repeat</strong> → Continuous improvement</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Key Insight:</strong> Without analysis, you're just gambling. With analysis, you're building a system that improves over time.</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Expectancy: The Holy Grail Metric</h2>
                    </div>
                    <p>Expectancy tells you how much you can expect to make (or lose) per trade over the long run. It's the single most important metric for trading success.</p>

                    <div className="glass-card darker">
                        <h3>The Expectancy Formula</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}><strong>Expectancy = (Win Rate × Average Win) - (Loss Rate × Average Loss)</strong></p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example 1: Profitable System</strong></p>
                            <ul>
                                <li>Win Rate: 40% (4 out of 10 trades win)</li>
                                <li>Average Win: ₹2,000</li>
                                <li>Loss Rate: 60% (6 out of 10 trades lose)</li>
                                <li>Average Loss: ₹500</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Calculation:</strong></p>
                            <p>Expectancy = (0.40 × ₹2,000) - (0.60 × ₹500)</p>
                            <p>Expectancy = ₹800 - ₹300 = <strong>₹500 per trade</strong></p>
                            <p style={{ marginTop: '0.5rem', color: '#22c55e' }}><strong>Result:</strong> Highly profitable! Even with only 40% win rate, you make ₹500 per trade on average.</p>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Example 2: Losing System</strong></p>
                            <ul>
                                <li>Win Rate: 70% (7 out of 10 trades win)</li>
                                <li>Average Win: ₹300</li>
                                <li>Loss Rate: 30% (3 out of 10 trades lose)</li>
                                <li>Average Loss: ₹1,000</li>
                            </ul>
                            <p style={{ marginTop: '1rem' }}><strong>Calculation:</strong></p>
                            <p>Expectancy = (0.70 × ₹300) - (0.30 × ₹1,000)</p>
                            <p>Expectancy = ₹210 - ₹300 = <strong>-₹90 per trade</strong></p>
                            <p style={{ marginTop: '0.5rem', color: '#ef4444' }}><strong>Result:</strong> Losing system! Despite 70% win rate, you lose ₹90 per trade on average.</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Opportunity Cost Analysis</h2>
                    </div>
                    <p>Opportunity cost measures the profit you left on the table by exiting too early or entering too late.</p>

                    <div className="glass-card">
                        <h3>Measuring Missed Profits</h3>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example Trade:</strong></p>
                            <ul>
                                <li>Entry: ₹500 (100 shares)</li>
                                <li>Exit: ₹520 (profit: ₹2,000)</li>
                                <li>Highest price after exit (within 1 hour): ₹540</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Opportunity Cost Calculation:</strong></p>
                            <p>Potential Profit: (₹540 - ₹500) × 100 = ₹4,000</p>
                            <p>Actual Profit: (₹520 - ₹500) × 100 = ₹2,000</p>
                            <p>Opportunity Cost: ₹4,000 - ₹2,000 = <strong>₹2,000</strong></p>
                            <p style={{ marginTop: '0.5rem', color: '#fbbf24' }}><strong>Analysis:</strong> You left 50% of potential profit on the table. Consider using trailing stops!</p>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <h4>Tracking Opportunity Cost</h4>
                            <p>The platform automatically scans the 1-hour window following every trade exit. If you consistently have high opportunity cost (40%+), you need to work on your exit strategy.</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Win Rate vs Average Win/Loss</h2>
                    </div>
                    <p>Understanding the relationship between these metrics is crucial for building a profitable system.</p>

                    <div className="glass-card darker">
                        <h3>The Trade-Off Matrix</h3>

                        <table style={{ width: '100%', marginTop: '1.5rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.5rem' }}>Win Rate</th>
                                    <th style={{ padding: '0.5rem' }}>Avg Win</th>
                                    <th style={{ padding: '0.5rem' }}>Avg Loss</th>
                                    <th style={{ padding: '0.5rem' }}>Expectancy</th>
                                    <th style={{ padding: '0.5rem' }}>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>90%</td>
                                    <td style={{ padding: '0.5rem' }}>₹100</td>
                                    <td style={{ padding: '0.5rem' }}>₹1,000</td>
                                    <td style={{ padding: '0.5rem' }}>-₹10</td>
                                    <td style={{ padding: '0.5rem', color: '#ef4444' }}>Losing</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>50%</td>
                                    <td style={{ padding: '0.5rem' }}>₹1,000</td>
                                    <td style={{ padding: '0.5rem' }}>₹500</td>
                                    <td style={{ padding: '0.5rem' }}>+₹250</td>
                                    <td style={{ padding: '0.5rem', color: '#22c55e' }}>Winning</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>30%</td>
                                    <td style={{ padding: '0.5rem' }}>₹3,000</td>
                                    <td style={{ padding: '0.5rem' }}>₹500</td>
                                    <td style={{ padding: '0.5rem' }}>+₹550</td>
                                    <td style={{ padding: '0.5rem', color: '#22c55e' }}>Highly Winning</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>70%</td>
                                    <td style={{ padding: '0.5rem' }}>₹500</td>
                                    <td style={{ padding: '0.5rem' }}>₹1,500</td>
                                    <td style={{ padding: '0.5rem' }}>-₹100</td>
                                    <td style={{ padding: '0.5rem', color: '#ef4444' }}>Losing</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Key Insights:</strong></p>
                            <ul>
                                <li>High win rate doesn't guarantee profitability</li>
                                <li>Low win rate can still be highly profitable</li>
                                <li>What matters is: (Win Rate × Avg Win) \u003e (Loss Rate × Avg Loss)</li>
                                <li>Most successful traders have 40-60% win rates with 2:1+ reward:risk</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Drawdown Analysis</h2>
                    </div>
                    <p>Drawdown measures how much your account declined from its peak. It's a critical risk metric that reveals your system's volatility.</p>

                    <div className="glass-card">
                        <h3>Understanding Drawdown</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}><strong>Drawdown % = ((Peak - Trough) / Peak) × 100</strong></p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example:</strong></p>
                            <ul>
                                <li>Account Peak: ₹1,50,000</li>
                                <li>Account Trough (lowest point): ₹1,20,000</li>
                                <li>Drawdown: ((₹1,50,000 - ₹1,20,000) / ₹1,50,000) × 100 = <strong>20%</strong></li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <h4>Drawdown Severity Levels</h4>
                            <table style={{ width: '100%', marginTop: '1rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Drawdown</th>
                                        <th style={{ padding: '0.5rem' }}>Severity</th>
                                        <th style={{ padding: '0.5rem' }}>Action Required</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>\u003c 10%</td>
                                        <td style={{ padding: '0.5rem', color: '#22c55e' }}>Normal</td>
                                        <td style={{ padding: '0.5rem' }}>Continue trading</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>10-20%</td>
                                        <td style={{ padding: '0.5rem', color: '#fbbf24' }}>Moderate</td>
                                        <td style={{ padding: '0.5rem' }}>Review recent trades, reduce size</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>20-30%</td>
                                        <td style={{ padding: '0.5rem', color: '#f97316' }}>Severe</td>
                                        <td style={{ padding: '0.5rem' }}>Stop trading, analyze system</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>\u003e 30%</td>
                                        <td style={{ padding: '0.5rem', color: '#ef4444' }}>Critical</td>
                                        <td style={{ padding: '0.5rem' }}>Complete strategy overhaul needed</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>⚠️ Recovery Math:</strong> Remember, a 20% drawdown requires 25% gain to recover, and a 50% drawdown requires 100% gain! Protect your capital!</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Strategy Regime Analysis</h2>
                    </div>
                    <p>Markets cycle through different regimes (trending, sideways, volatile). Your strategy may work in one regime but fail in another.</p>

                    <div className="glass-card darker">
                        <h3>Identifying Market Regimes</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>Trending Market</h4>
                                <p><strong>Characteristics:</strong> Clear direction, higher highs/lower lows, strong momentum</p>
                                <p><strong>Best Strategies:</strong> Trend following, breakouts, momentum trading</p>
                                <p><strong>Avoid:</strong> Mean reversion, range trading</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#fbbf24' }}>Sideways Market</h4>
                                <p><strong>Characteristics:</strong> Bounded range, no clear direction, choppy price action</p>
                                <p><strong>Best Strategies:</strong> Range trading, mean reversion, selling options</p>
                                <p><strong>Avoid:</strong> Trend following, breakout trading</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ef4444' }}>Volatile Market</h4>
                                <p><strong>Characteristics:</strong> Large price swings, high uncertainty, news-driven</p>
                                <p><strong>Best Strategies:</strong> Reduced position size, wider stops, scalping</p>
                                <p><strong>Avoid:</strong> Large positions, tight stops</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Action Item:</strong> Track your performance by market regime. If you're losing in sideways markets but winning in trends, simply avoid trading during choppy periods!</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>The Trading Journal Template</h2>
                    </div>
                    <p>A proper trading journal captures both quantitative and qualitative data for each trade.</p>

                    <div className="glass-card">
                        <h3>Essential Journal Fields</h3>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Pre-Trade (Before Entry):</strong></p>
                            <ul>
                                <li>Date & Time</li>
                                <li>Stock Symbol</li>
                                <li>Market Regime (trending/sideways/volatile)</li>
                                <li>Setup/Pattern (e.g., "VWAP bounce", "Golden cross")</li>
                                <li>Entry Reason (Why are you taking this trade?)</li>
                                <li>Entry Price Target</li>
                                <li>Stop Loss Price</li>
                                <li>Target Price</li>
                                <li>Position Size (shares)</li>
                                <li>Risk Amount (₹)</li>
                                <li>Risk-Reward Ratio</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>During Trade:</strong></p>
                            <ul>
                                <li>Actual Entry Price</li>
                                <li>Actual Entry Time</li>
                                <li>Emotional State (calm/anxious/excited)</li>
                                <li>Any adjustments made (stop moves, partial exits)</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Post-Trade (After Exit):</strong></p>
                            <ul>
                                <li>Exit Price</li>
                                <li>Exit Time</li>
                                <li>Exit Reason (hit target/stop/manual)</li>
                                <li>P&L (₹)</li>
                                <li>P&L (%)</li>
                                <li>MAE (Max Adverse Excursion)</li>
                                <li>MFE (Max Favorable Excursion)</li>
                                <li>Hold Time</li>
                                <li>Fees Paid</li>
                                <li>What Went Right?</li>
                                <li>What Went Wrong?</li>
                                <li>Lessons Learned</li>
                                <li>Screenshot of Chart</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Weekly Performance Review</h2>
                    </div>
                    <p>Set aside time every week to review your trading performance and identify patterns.</p>

                    <div className="glass-card darker">
                        <h3>Weekly Review Checklist</h3>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>✅ Metrics to Calculate:</strong></p>
                            <ul>
                                <li>Total P&L for the week</li>
                                <li>Win Rate (% of winning trades)</li>
                                <li>Average Win vs Average Loss</li>
                                <li>Expectancy per trade</li>
                                <li>Largest Win & Largest Loss</li>
                                <li>Current Drawdown from peak</li>
                                <li>Average hold time (winners vs losers)</li>
                                <li>Profit Capture Ratio (realized / MFE)</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>📊 Questions to Ask:</strong></p>
                            <ul>
                                <li>Did I follow my trading plan?</li>
                                <li>Which setups worked best?</li>
                                <li>Which setups failed?</li>
                                <li>Am I holding losers too long?</li>
                                <li>Am I exiting winners too early?</li>
                                <li>What was my emotional state during losses?</li>
                                <li>Did I revenge trade after a loss?</li>
                                <li>What's one thing to improve next week?</li>
                            </ul>
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
                            <li>✅ <strong>Trading journal is essential</strong> - Without data, you're guessing</li>
                            <li>✅ <strong>Expectancy determines profitability</strong> - (Win Rate × Avg Win) - (Loss Rate × Avg Loss)</li>
                            <li>✅ <strong>Win rate alone is meaningless</strong> - 90% win rate can still lose money</li>
                            <li>✅ <strong>Track opportunity cost</strong> - How much profit are you leaving on table?</li>
                            <li>✅ <strong>Monitor drawdown religiously</strong> - Stop trading at 20-30% drawdown</li>
                            <li>✅ <strong>Strategies are regime-dependent</strong> - What works in trends fails in chop</li>
                            <li>✅ <strong>Review trades weekly</strong> - Identify patterns in your performance</li>
                            <li>✅ <strong>Hold winners longer than losers</strong> - Classic sign of profitable trader</li>
                            <li>✅ <strong>Record emotional state</strong> - Emotions drive mistakes</li>
                            <li>✅ <strong>Screenshot every trade</strong> - Visual review reveals patterns</li>
                            <li>✅ <strong>Focus on process, not outcomes</strong> - Good process leads to good results</li>
                            <li>✅ <strong>Continuous improvement is the edge</strong> - Markets evolve, you must too</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>The Journey Never Ends</h3>
                    <p>You've completed the institutional trader's education path. Now, the only thing left is to trade, fail, learn, and repeat until pattern recognition becomes instinctive. Remember: the best traders are the ones who survived the longest.</p>
                    <Link to="/education" className="primary-btn">Review All Lessons</Link>
                </div>
            </div>
        </div>
    );
};

export default TradeAnalytics;
