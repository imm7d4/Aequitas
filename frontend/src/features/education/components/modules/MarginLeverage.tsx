import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const MarginLeverage: React.FC = () => {
    return (
        <div className="custom-module-page margin-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill warning">Capital Efficiency</div>
                    <h1>Understanding Margin & Leverage</h1>
                    <p className="hero-lead">Leverage is a double-edged sword. It amplifies both profits and losses. Learn how 5x leverage works and how to use it safely.</p>
                </div>
                <div className="hero-visual">
                    <div className="leverage-visual">
                        <div className="fulcrum"></div>
                        <div className="lever-arm">
                            <span className="weight capital">1x Cash</span>
                            <span className="weight exposure">5x Power</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>What is Leverage?</h2>
                    </div>
                    <p>Leverage allows you to control a larger position than your actual cash would normally permit. It's like borrowing money from the broker to trade bigger.</p>

                    <div className="glass-card">
                        <h3>The Basic Concept</h3>
                        <p><strong>Without Leverage (1x):</strong></p>
                        <ul>
                            <li>You have ₹1,00,000 cash</li>
                            <li>You can buy ₹1,00,000 worth of stocks</li>
                            <li>Your exposure = Your cash</li>
                        </ul>

                        <p style={{ marginTop: '1.5rem' }}><strong>With 5x Leverage:</strong></p>
                        <ul>
                            <li>You have ₹1,00,000 cash</li>
                            <li>You can buy ₹5,00,000 worth of stocks</li>
                            <li>Your exposure = 5× your cash</li>
                        </ul>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                            <p><strong>How it works:</strong> The broker lends you ₹4,00,000 temporarily, using your ₹1,00,000 as collateral. You must close the position the same day (intraday) or maintain sufficient margin.</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Calculating Buying Power</h2>
                    </div>
                    <p>Your buying power determines the maximum position size you can take.</p>

                    <div className="glass-card darker">
                        <h3>The Formula</h3>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}><strong>Buying Power = Available Cash × Leverage Multiplier</strong></p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example:</strong></p>
                            <ul>
                                <li>Available Cash: ₹2,00,000</li>
                                <li>Leverage: 5x</li>
                                <li>Buying Power = ₹2,00,000 × 5 = <strong>₹10,00,000</strong></li>
                            </ul>
                            <p style={{ marginTop: '0.5rem', color: '#fbbf24' }}><strong>You can take positions worth up to ₹10,00,000!</strong></p>
                        </div>
                    </div>

                    <div className="info-box warning">
                        <strong>⚠️ Critical Warning:</strong> Just because you CAN use 5x leverage doesn't mean you SHOULD. Most professional traders use 1.5x-2x maximum.
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Margin Requirements</h2>
                    </div>
                    <p>Margin is the minimum cash you need to maintain your leveraged position. There are two types:</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                        <div className="glass-card">
                            <h3 style={{ color: '#22c55e' }}>Initial Margin</h3>
                            <p><strong>Definition:</strong> Minimum cash needed to OPEN a position</p>
                            <p><strong>Aequitas Rate:</strong> 20% of position value</p>
                            <p><strong>Formula:</strong> Position Value × 0.20</p>
                            <p><strong>Example:</strong> To buy ₹1,00,000 worth of stock, you need ₹20,000 cash</p>
                        </div>
                        <div className="glass-card">
                            <h3 style={{ color: '#fbbf24' }}>Maintenance Margin</h3>
                            <p><strong>Definition:</strong> Minimum equity needed to KEEP position open</p>
                            <p><strong>Aequitas Rate:</strong> 15% of position value</p>
                            <p><strong>Formula:</strong> Position Value × 0.15</p>
                            <p><strong>Example:</strong> To hold ₹1,00,000 position, you need ₹15,000 equity</p>
                        </div>
                    </div>

                    <div className="glass-card danger" style={{ marginTop: '1rem' }}>
                        <h3>Liquidation Threshold</h3>
                        <p><strong>If your equity falls below maintenance margin (15%), your position may be force-closed!</strong></p>
                        <p>This is called a <strong>margin call</strong> or <strong>liquidation</strong>.</p>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>How Leverage Amplifies Returns</h2>
                    </div>
                    <p>Leverage multiplies your percentage gains and losses by the leverage factor.</p>

                    <div className="glass-card">
                        <h3>Example: 5x Leverage on a Winning Trade</h3>
                        <p><strong>Setup:</strong></p>
                        <ul>
                            <li>Your Cash: ₹1,00,000</li>
                            <li>Leverage: 5x</li>
                            <li>Position Size: ₹5,00,000 (500 shares @ ₹1,000)</li>
                        </ul>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Stock moves from ₹1,000 to ₹1,020 (+2%)</strong></p>
                            <ul>
                                <li>Profit per share: ₹20</li>
                                <li>Total Profit: ₹20 × 500 = ₹10,000</li>
                                <li>Return on YOUR cash: ₹10,000 / ₹1,00,000 = <strong style={{ color: '#22c55e' }}>10%</strong></li>
                            </ul>
                            <p style={{ marginTop: '0.5rem' }}><strong>Without leverage (1x):</strong> You'd only make 2% (₹2,000)</p>
                            <p><strong>With 5x leverage:</strong> You made 10% (₹10,000)</p>
                            <p style={{ color: '#22c55e', marginTop: '0.5rem' }}><strong>Leverage amplified your 2% gain into a 10% gain!</strong></p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>How Leverage Amplifies Losses</h2>
                    </div>
                    <p>The same amplification works in reverse. Losses are multiplied by the leverage factor.</p>

                    <div className="glass-card danger">
                        <h3>❌ Example: 5x Leverage on a Losing Trade</h3>
                        <p><strong>Setup:</strong></p>
                        <ul>
                            <li>Your Cash: ₹1,00,000</li>
                            <li>Leverage: 5x</li>
                            <li>Position Size: ₹5,00,000 (500 shares @ ₹1,000)</li>
                        </ul>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Stock moves from ₹1,000 to ₹980 (-2%)</strong></p>
                            <ul>
                                <li>Loss per share: -₹20</li>
                                <li>Total Loss: -₹20 × 500 = -₹10,000</li>
                                <li>Return on YOUR cash: -₹10,000 / ₹1,00,000 = <strong style={{ color: '#ef4444' }}>-10%</strong></li>
                            </ul>
                            <p style={{ marginTop: '0.5rem' }}><strong>Without leverage (1x):</strong> You'd only lose 2% (-₹2,000)</p>
                            <p><strong>With 5x leverage:</strong> You lost 10% (-₹10,000)</p>
                            <p style={{ color: '#ef4444', marginTop: '0.5rem' }}><strong>Leverage amplified your 2% loss into a 10% loss!</strong></p>
                        </div>
                    </div>

                    <div className="info-box logic" style={{ marginTop: '1rem' }}>
                        <strong>The Math:</strong> With 5x leverage, every 1% move in stock price = 5% move in your account. A 20% drop in stock price = 100% loss of your capital!
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Disaster Scenario: Full Leverage Gone Wrong</h2>
                    </div>
                    <p>This is what happens when you use maximum leverage and the trade goes against you.</p>

                    <div className="glass-card danger">
                        <h3>💀 The Death Spiral</h3>
                        <p><strong>Day 1: The Setup</strong></p>
                        <ul>
                            <li>Your Account: ₹2,00,000</li>
                            <li>You use FULL 5x leverage</li>
                            <li>Position: ₹10,00,000 (1,000 shares @ ₹1,000)</li>
                            <li>Required Margin: ₹2,00,000 (20% of ₹10,00,000)</li>
                        </ul>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Stock drops to ₹960 (-4%)</strong></p>
                            <ul>
                                <li>Loss: -₹40 × 1,000 = -₹40,000</li>
                                <li>Your Equity: ₹2,00,000 - ₹40,000 = ₹1,60,000</li>
                                <li>Position Value: ₹9,60,000</li>
                                <li>Maintenance Margin Required: ₹9,60,000 × 0.15 = ₹1,44,000</li>
                                <li>Your Equity: ₹1,60,000 (still above ₹1,44,000 - safe for now)</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px' }}>
                            <p><strong>Stock drops further to ₹920 (-8% total)</strong></p>
                            <ul>
                                <li>Loss: -₹80 × 1,000 = -₹80,000</li>
                                <li>Your Equity: ₹2,00,000 - ₹80,000 = ₹1,20,000</li>
                                <li>Position Value: ₹9,20,000</li>
                                <li>Maintenance Margin Required: ₹9,20,000 × 0.15 = ₹1,38,000</li>
                                <li style={{ color: '#ef4444' }}><strong>Your Equity (₹1,20,000) \u003c Required Margin (₹1,38,000)</strong></li>
                                <li style={{ color: '#ef4444', fontSize: '1.1rem', marginTop: '0.5rem' }}><strong>🚨 MARGIN CALL! POSITION LIQUIDATED!</strong></li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                            <p><strong>Final Result:</strong></p>
                            <ul>
                                <li>Started with: ₹2,00,000</li>
                                <li>Ended with: ₹1,20,000</li>
                                <li><strong style={{ color: '#ef4444', fontSize: '1.2rem' }}>Loss: ₹80,000 (40% of capital)</strong></li>
                                <li>Stock only dropped 8%, but you lost 40%!</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Safe Scenario: Conservative Leverage</h2>
                    </div>
                    <p>This is how professional traders use leverage responsibly.</p>

                    <div className="glass-card">
                        <h3>✅ The Smart Approach</h3>
                        <p><strong>Day 1: The Setup</strong></p>
                        <ul>
                            <li>Your Account: ₹2,00,000</li>
                            <li>You use ONLY 2x leverage (not full 5x)</li>
                            <li>Position: ₹4,00,000 (400 shares @ ₹1,000)</li>
                            <li>Required Margin: ₹80,000 (20% of ₹4,00,000)</li>
                            <li>Unused Cash Buffer: ₹1,20,000</li>
                        </ul>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Stock drops to ₹920 (-8%, same as disaster scenario)</strong></p>
                            <ul>
                                <li>Loss: -₹80 × 400 = -₹32,000</li>
                                <li>Your Equity: ₹2,00,000 - ₹32,000 = ₹1,68,000</li>
                                <li>Position Value: ₹3,68,000</li>
                                <li>Maintenance Margin Required: ₹3,68,000 × 0.15 = ₹55,200</li>
                                <li style={{ color: '#22c55e' }}><strong>Your Equity (₹1,68,000) \u003e\u003e Required Margin (₹55,200)</strong></li>
                                <li style={{ color: '#22c55e', fontSize: '1.1rem', marginTop: '0.5rem' }}><strong>✅ SAFE! Position still open, no liquidation</strong></li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Final Result:</strong></p>
                            <ul>
                                <li>Started with: ₹2,00,000</li>
                                <li>Current Equity: ₹1,68,000</li>
                                <li><strong>Loss: ₹32,000 (16% of capital)</strong></li>
                                <li>Same 8% stock drop, but you only lost 16% (vs 40% in disaster scenario)</li>
                                <li style={{ color: '#22c55e' }}><strong>You still have ₹1,68,000 to fight another day!</strong></li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Position Sizing with Leverage</h2>
                    </div>
                    <p>The key to safe leverage is proper position sizing. Never use your full buying power!</p>

                    <div className="glass-card darker">
                        <h3>Recommended Leverage Levels</h3>
                        <table style={{ width: '100%', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Experience Level</th>
                                    <th style={{ padding: '0.5rem' }}>Max Leverage</th>
                                    <th style={{ padding: '0.5rem' }}>Risk Level</th>
                                    <th style={{ padding: '0.5rem' }}>Liquidation Risk</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Beginner (0-6 months)</td>
                                    <td style={{ padding: '0.5rem' }}>1x - 1.5x</td>
                                    <td style={{ padding: '0.5rem', color: '#22c55e' }}>Low</td>
                                    <td style={{ padding: '0.5rem', color: '#22c55e' }}>Very Low</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Intermediate (6-24 months)</td>
                                    <td style={{ padding: '0.5rem' }}>1.5x - 2.5x</td>
                                    <td style={{ padding: '0.5rem', color: '#fbbf24' }}>Moderate</td>
                                    <td style={{ padding: '0.5rem', color: '#fbbf24' }}>Low</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Advanced (2+ years)</td>
                                    <td style={{ padding: '0.5rem' }}>2.5x - 3.5x</td>
                                    <td style={{ padding: '0.5rem', color: '#f97316' }}>High</td>
                                    <td style={{ padding: '0.5rem', color: '#f97316' }}>Moderate</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Professional Day Trader</td>
                                    <td style={{ padding: '0.5rem' }}>3.5x - 5x</td>
                                    <td style={{ padding: '0.5rem', color: '#ef4444' }}>Very High</td>
                                    <td style={{ padding: '0.5rem', color: '#ef4444' }}>High</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="info-box tip" style={{ marginTop: '1rem' }}>
                        <strong>💡 Pro Tip:</strong> Even if you're experienced, never use more than 3x leverage unless you have a very specific, well-planned strategy with tight stop losses.
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">09</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Leverage amplifies both gains and losses</strong> - 5x leverage = 5x returns AND 5x losses</li>
                            <li>✅ <strong>Initial margin: 20%</strong> - Need ₹20,000 to open ₹1,00,000 position</li>
                            <li>✅ <strong>Maintenance margin: 15%</strong> - Must maintain ₹15,000 equity to hold ₹1,00,000 position</li>
                            <li>✅ <strong>Liquidation happens fast</strong> - 8% stock drop can wipe out 40% of capital with 5x leverage</li>
                            <li>✅ <strong>Use conservative leverage</strong> - 1.5-2x for most traders, never full 5x</li>
                            <li>✅ <strong>Position sizing is critical</strong> - Risk max 2% of capital per trade</li>
                            <li>✅ <strong>Always use stop losses</strong> - Mandatory with leveraged positions</li>
                            <li>✅ <strong>Keep cash buffer</strong> - Don't use full buying power</li>
                            <li>✅ <strong>Monitor maintenance margin</strong> - Stay well above 15% threshold</li>
                            <li>✅ <strong>Emotional control is key</strong> - Use leverage you can psychologically handle</li>
                            <li>✅ <strong>Never average down with leverage</strong> - Cut losses quickly instead</li>
                            <li>✅ <strong>Experience matters</strong> - Start with 1x, gradually increase as you gain skill</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Learn Short Selling Next</h3>
                    <p>Now that you understand leverage, learn how to profit from falling prices through short selling.</p>
                    <Link to="/education/short-selling" className="primary-btn">Learn Short Selling</Link>
                </div>
            </div>
        </div>
    );
};

export default MarginLeverage;
