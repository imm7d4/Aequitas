import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const RiskManagement: React.FC = () => {
    return (
        <div className="custom-module-page margin-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill danger">Capital Preservation</div>
                    <h1>Risk Management Mastery</h1>
                    <p className="hero-lead">Amateurs focus on how much they can make. Professionals focus on how much they can lose. Master the mathematics of survival and position sizing.</p>
                </div>
                <div className="hero-visual">
                    <div className="shield-visual">
                        <div className="shield-glow"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The Foundation: Risk Per Trade</h2>
                    </div>
                    <p>The single most important rule in trading: <strong>Never risk more than 1-2% of your total capital on a single trade.</strong></p>

                    <div className="glass-card">
                        <h3>Why 1-2% Risk?</h3>
                        <p>This ensures that even a long losing streak won't destroy your account. Let's see the math:</p>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example: 1% Risk Rule</strong></p>
                            <ul>
                                <li>Account Size: ₹1,00,000</li>
                                <li>Risk Per Trade: 1% = ₹1,000</li>
                                <li>After 10 consecutive losses: ₹1,00,000 - ₹10,000 = ₹90,000 (90% remaining)</li>
                                <li>After 20 consecutive losses: ₹80,000 (80% remaining)</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Compare with 10% Risk Per Trade:</strong></p>
                            <ul>
                                <li>After 10 consecutive losses: ₹1,00,000 → ₹34,868 (65% loss!)</li>
                                <li>After 20 consecutive losses: ₹1,00,000 → ₹12,158 (88% loss!)</li>
                            </ul>
                            <p style={{ color: '#ef4444', marginTop: '0.5rem' }}><strong>You'd be nearly wiped out!</strong></p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Position Sizing Formula</h2>
                    </div>
                    <p>Knowing your risk percentage is only half the battle. You need to calculate the correct position size.</p>

                    <div className="glass-card darker">
                        <h3>The Position Sizing Formula</h3>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}><strong>Position Size (Shares) = (Account Size × Risk %) / (Entry Price - Stop Loss Price)</strong></p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example Calculation:</strong></p>
                            <ul>
                                <li>Account Size: ₹2,00,000</li>
                                <li>Risk Per Trade: 2% = ₹4,000</li>
                                <li>Entry Price: ₹500</li>
                                <li>Stop Loss: ₹480 (4% below entry)</li>
                                <li>Risk Per Share: ₹500 - ₹480 = ₹20</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Position Size = ₹4,000 / ₹20 = 200 shares</strong></p>
                            <p style={{ marginTop: '0.5rem' }}>Total Investment: 200 × ₹500 = ₹1,00,000</p>
                            <p>If stop loss hits: Loss = 200 × ₹20 = ₹4,000 (exactly 2% of capital)</p>
                            <p style={{ color: '#22c55e', marginTop: '0.5rem' }}><strong>✅ Perfect risk management!</strong></p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>The Risk of Ruin Table</h2>
                    </div>
                    <p>Understanding the mathematics of recovery is crucial. Once you lose a certain percentage, you need a much larger gain to break even.</p>

                    <div className="glass-card">
                        <h3>The Non-Linear Recovery Trap</h3>
                        <table style={{ width: '100%', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>% Loss</th>
                                    <th style={{ padding: '0.5rem' }}>Capital Remaining</th>
                                    <th style={{ padding: '0.5rem' }}>% Gain Needed to Break Even</th>
                                    <th style={{ padding: '0.5rem' }}>Difficulty</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>10%</td>
                                    <td style={{ padding: '0.5rem' }}>₹90,000</td>
                                    <td style={{ padding: '0.5rem' }}>11.1%</td>
                                    <td style={{ padding: '0.5rem', color: '#22c55e' }}>Easy</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>20%</td>
                                    <td style={{ padding: '0.5rem' }}>₹80,000</td>
                                    <td style={{ padding: '0.5rem' }}>25%</td>
                                    <td style={{ padding: '0.5rem', color: '#fbbf24' }}>Moderate</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>30%</td>
                                    <td style={{ padding: '0.5rem' }}>₹70,000</td>
                                    <td style={{ padding: '0.5rem' }}>42.9%</td>
                                    <td style={{ padding: '0.5rem', color: '#f97316' }}>Hard</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>50%</td>
                                    <td style={{ padding: '0.5rem' }}>₹50,000</td>
                                    <td style={{ padding: '0.5rem' }}>100%</td>
                                    <td style={{ padding: '0.5rem', color: '#ef4444' }}>Very Hard</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>75%</td>
                                    <td style={{ padding: '0.5rem' }}>₹25,000</td>
                                    <td style={{ padding: '0.5rem' }}>300%</td>
                                    <td style={{ padding: '0.5rem', color: '#ef4444' }}>Nearly Impossible</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Key Insight:</strong> If you lose 50% of your capital, you need to double your remaining money just to break even. This is why capital preservation is more important than profit maximization!</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Portfolio Allocation Strategy</h2>
                    </div>
                    <p>Don't put all your eggs in one basket. Proper portfolio allocation reduces overall risk.</p>

                    <div className="glass-card darker">
                        <h3>The 3-Tier Allocation Model</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>Tier 1: Core Holdings (50-60%)</h4>
                                <p><strong>Purpose:</strong> Long-term stability and steady growth</p>
                                <p><strong>Assets:</strong> Blue-chip stocks, index funds, stable large-caps</p>
                                <p><strong>Risk Level:</strong> Low</p>
                                <p><strong>Example:</strong> ₹1,00,000 account → ₹50,000-60,000 in Nifty 50 stocks</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#fbbf24' }}>Tier 2: Growth Positions (30-40%)</h4>
                                <p><strong>Purpose:</strong> Active trading and growth opportunities</p>
                                <p><strong>Assets:</strong> Mid-cap stocks, swing trades, sector plays</p>
                                <p><strong>Risk Level:</strong> Moderate</p>
                                <p><strong>Example:</strong> ₹1,00,000 account → ₹30,000-40,000 in active trades</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ef4444' }}>Tier 3: Speculative (5-10%)</h4>
                                <p><strong>Purpose:</strong> High-risk, high-reward opportunities</p>
                                <p><strong>Assets:</strong> Small-caps, leveraged positions, options</p>
                                <p><strong>Risk Level:</strong> High</p>
                                <p><strong>Example:</strong> ₹1,00,000 account → ₹5,000-10,000 maximum</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Correlation Risk & Diversification</h2>
                    </div>
                    <p>True diversification means holding assets that don't move together. Buying 5 tech stocks is NOT diversification!</p>

                    <div className="glass-card">
                        <h3>Understanding Correlation</h3>
                        <p><strong>Correlation</strong> measures how two assets move together, ranging from -1 to +1:</p>

                        <div style={{ marginTop: '1.5rem' }}>
                            <ul>
                                <li><strong>+1.0:</strong> Perfect positive correlation (move exactly together)</li>
                                <li><strong>+0.7 to +0.9:</strong> Strong positive correlation</li>
                                <li><strong>0:</strong> No correlation (independent movements)</li>
                                <li><strong>-0.7 to -0.9:</strong> Strong negative correlation</li>
                                <li><strong>-1.0:</strong> Perfect negative correlation (move exactly opposite)</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <h4>❌ Bad Diversification Example</h4>
                            <p><strong>Portfolio:</strong> TCS, Infosys, Wipro, HCL Tech, Tech Mahindra</p>
                            <p><strong>Problem:</strong> All IT stocks with correlation ~0.85</p>
                            <p><strong>Result:</strong> If NIFTY IT drops 5%, ALL your positions drop together</p>
                            <p style={{ color: '#ef4444' }}><strong>This is concentrated risk, not diversification!</strong></p>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <h4>✅ Good Diversification Example</h4>
                            <p><strong>Portfolio:</strong> Reliance (Energy), HDFC Bank (Finance), TCS (IT), Asian Paints (Consumer), Dr. Reddy's (Pharma)</p>
                            <p><strong>Benefit:</strong> Different sectors with lower correlation (~0.3-0.5)</p>
                            <p><strong>Result:</strong> When one sector falls, others may stay stable or rise</p>
                            <p style={{ color: '#22c55e' }}><strong>True risk reduction through diversification!</strong></p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Maximum Exposure Limits</h2>
                    </div>
                    <p>Set hard limits on how much capital you can deploy at once to prevent overtrading.</p>

                    <div className="glass-card darker">
                        <h3>The Exposure Pyramid</h3>

                        <table style={{ width: '100%', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Limit Type</th>
                                    <th style={{ padding: '0.5rem' }}>Maximum %</th>
                                    <th style={{ padding: '0.5rem' }}>Example (₹1L Account)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Per Single Trade</td>
                                    <td style={{ padding: '0.5rem' }}>20-25%</td>
                                    <td style={{ padding: '0.5rem' }}>₹20,000-25,000</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Per Sector</td>
                                    <td style={{ padding: '0.5rem' }}>30-40%</td>
                                    <td style={{ padding: '0.5rem' }}>₹30,000-40,000</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Total Market Exposure</td>
                                    <td style={{ padding: '0.5rem' }}>70-80%</td>
                                    <td style={{ padding: '0.5rem' }}>₹70,000-80,000</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Leveraged Positions</td>
                                    <td style={{ padding: '0.5rem' }}>20-30%</td>
                                    <td style={{ padding: '0.5rem' }}>₹20,000-30,000</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Cash Reserve</td>
                                    <td style={{ padding: '0.5rem' }}>20-30%</td>
                                    <td style={{ padding: '0.5rem' }}>₹20,000-30,000</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Why Keep Cash Reserve?</strong></p>
                            <ul>
                                <li>Opportunity to buy during market crashes</li>
                                <li>Buffer for margin calls on leveraged positions</li>
                                <li>Psychological comfort during volatile periods</li>
                                <li>Prevents forced selling at bad prices</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Stop Loss Discipline</h2>
                    </div>
                    <p>A stop loss is your insurance policy. Never enter a trade without knowing your exit point.</p>

                    <div className="glass-card">
                        <h3>Stop Loss Placement Strategies</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <h4>1. Percentage-Based Stop Loss</h4>
                                <p><strong>Method:</strong> Set stop at fixed % below entry</p>
                                <p><strong>Example:</strong> Buy at ₹500, stop at ₹475 (5% below)</p>
                                <p><strong>Best For:</strong> Beginners, volatile stocks</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <h4>2. Support-Based Stop Loss</h4>
                                <p><strong>Method:</strong> Place stop below key support level</p>
                                <p><strong>Example:</strong> Buy at ₹520, support at ₹500, stop at ₹495</p>
                                <p><strong>Best For:</strong> Technical traders, swing trades</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <h4>3. ATR-Based Stop Loss</h4>
                                <p><strong>Method:</strong> Use Average True Range (volatility measure)</p>
                                <p><strong>Example:</strong> If ATR = ₹15, set stop 2×ATR = ₹30 below entry</p>
                                <p><strong>Best For:</strong> Advanced traders, adapts to volatility</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <h4>4. Time-Based Stop Loss</h4>
                                <p><strong>Method:</strong> Exit if trade doesn't move in X days</p>
                                <p><strong>Example:</strong> Exit after 5 days if no 3% gain</p>
                                <p><strong>Best For:</strong> Swing traders, opportunity cost management</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Risk-Reward Ratio</h2>
                    </div>
                    <p>Never take a trade unless the potential reward justifies the risk. Minimum acceptable ratio: 1:2 (risk ₹1 to make ₹2).</p>

                    <div className="glass-card darker">
                        <h3>Calculating Risk-Reward Ratio</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}><strong>Risk-Reward Ratio = (Target Price - Entry Price) / (Entry Price - Stop Loss Price)</strong></p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example Trade:</strong></p>
                            <ul>
                                <li>Entry Price: ₹500</li>
                                <li>Stop Loss: ₹480 (Risk: ₹20 per share)</li>
                                <li>Target Price: ₹540 (Reward: ₹40 per share)</li>
                                <li><strong>Risk-Reward Ratio: ₹40 / ₹20 = 2:1</strong></li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Why 2:1 Minimum?</strong></p>
                            <p>With a 2:1 ratio, you only need a 33% win rate to break even:</p>
                            <ul>
                                <li>Win 3 trades: +₹40 × 3 = +₹120</li>
                                <li>Lose 6 trades: -₹20 × 6 = -₹120</li>
                                <li>Net: ₹0 (break even with only 33% wins!)</li>
                            </ul>
                            <p style={{ color: '#22c55e', marginTop: '0.5rem' }}><strong>With 50% win rate and 2:1 ratio, you're consistently profitable!</strong></p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">09</span>
                        <h2>Common Risk Management Mistakes</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div className="glass-card danger">
                            <h4>❌ Mistake 1: Moving Stop Losses</h4>
                            <p><strong>Error:</strong> "Stock is at ₹475, but I'll move my ₹480 stop to ₹470 because I think it will bounce"</p>
                            <p><strong>Reality:</strong> You're increasing your risk after the trade has already moved against you</p>
                            <p><strong>Fix:</strong> NEVER move a stop loss further away. Only move it closer (trailing stop)</p>
                        </div>

                        <div className="glass-card danger">
                            <h4>❌ Mistake 2: Averaging Down Without Plan</h4>
                            <p><strong>Error:</strong> "Stock dropped 10%, I'll buy more to average down my cost"</p>
                            <p><strong>Reality:</strong> You're doubling down on a losing position without new information</p>
                            <p><strong>Fix:</strong> Only average down if it was part of your original plan with specific levels</p>
                        </div>

                        <div className="glass-card danger">
                            <h4>❌ Mistake 3: Revenge Trading</h4>
                            <p><strong>Error:</strong> After a loss, immediately taking a bigger position to "make it back"</p>
                            <p><strong>Reality:</strong> Emotional trading leads to bigger losses</p>
                            <p><strong>Fix:</strong> Take a break after 2-3 consecutive losses. Review what went wrong</p>
                        </div>

                        <div className="glass-card danger">
                            <h4>❌ Mistake 4: Ignoring Correlation</h4>
                            <p><strong>Error:</strong> Having 5 positions all in banking sector</p>
                            <p><strong>Reality:</strong> One RBI policy change affects all positions simultaneously</p>
                            <p><strong>Fix:</strong> Limit sector exposure to 30-40% of portfolio</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">10</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Risk 1-2% per trade maximum</strong> - Protects against losing streaks</li>
                            <li>✅ <strong>Use position sizing formula</strong> - Calculate exact share quantity based on stop loss</li>
                            <li>✅ <strong>Understand recovery mathematics</strong> - 50% loss requires 100% gain to break even</li>
                            <li>✅ <strong>Allocate portfolio in tiers</strong> - 50-60% core, 30-40% growth, 5-10% speculative</li>
                            <li>✅ <strong>Diversify across sectors</strong> - Avoid correlation risk, max 30-40% per sector</li>
                            <li>✅ <strong>Set exposure limits</strong> - Max 20-25% per trade, keep 20-30% cash reserve</li>
                            <li>✅ <strong>Always use stop losses</strong> - Never enter without exit plan</li>
                            <li>✅ <strong>Maintain 2:1 risk-reward minimum</strong> - Ensures profitability with 50% win rate</li>
                            <li>✅ <strong>Never move stops away</strong> - Only tighten, never widen</li>
                            <li>✅ <strong>Avoid revenge trading</strong> - Take breaks after consecutive losses</li>
                            <li>✅ <strong>Keep trading journal</strong> - Track what works and what doesn't</li>
                            <li>✅ <strong>Preserve capital first</strong> - You can't trade if you're broke</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Summary: Survival is Success</h3>
                    <p>The best traders are the ones who survived the longest. Respect the math, use position sizing, and manage your risk religiously. Capital preservation always comes before profit maximization.</p>
                    <Link to="/education/margin-leverage" className="primary-btn">Review Margin & Leverage</Link>
                </div>
            </div>
        </div>
    );
};

export default RiskManagement;
