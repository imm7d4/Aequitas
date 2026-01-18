import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const HowAequitasWorks: React.FC = () => {
    return (
        <div className="custom-module-page aequitas-dark">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill">Platform Fundamentals</div>
                    <h1>How Modern Trading Platforms Work</h1>
                    <p className="hero-lead">Understanding the journey of your order from click to execution. Learn how Aequitas processes trades, manages your capital, and ensures fair execution in real-time.</p>
                </div>
                <div className="hero-visual">
                    <div className="heartbeat-ring"></div>
                    <div className="engine-core">AQ</div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The Order Journey: From Click to Execution</h2>
                    </div>
                    <p>When you place a trade on Aequitas, your order goes through a carefully orchestrated journey to ensure fairness, accuracy, and security. Here's what happens behind the scenes:</p>

                    <div className="glass-card">
                        <h3>🎯 Step 1: Order Validation</h3>
                        <p>The moment you click "Buy" or "Sell", the platform instantly checks:</p>
                        <ul>
                            <li><strong>Do you have enough funds?</strong> For a ₹10,000 purchase, you need at least ₹2,000 (20% margin requirement)</li>
                            <li><strong>Is your price valid?</strong> All prices must be in multiples of ₹0.05 (the tick size)</li>
                            <li><strong>Is the stock tradable?</strong> The instrument must be active and available for trading</li>
                        </ul>
                        <div className="info-box tip">
                            <strong>💡 Why the 20% margin?</strong> Aequitas offers 5x leverage, meaning you can control ₹10,000 worth of stock with just ₹2,000. This amplifies both gains and losses, so trade carefully!
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>⚡ Step 2: Funds Are Locked</h3>
                        <p>Once validated, your required capital is immediately <strong>locked</strong> (but not yet spent). This prevents you from accidentally placing multiple orders with the same money.</p>
                        <p><strong>Example:</strong> You have ₹5,000. You place a BUY order for 100 shares at ₹40 = ₹4,000 total. The platform locks ₹800 (20% margin). You now have ₹4,200 available for other trades.</p>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Understanding the 3-Second Heartbeat</h2>
                    </div>
                    <p>Unlike real exchanges where trades happen in microseconds, Aequitas uses a <strong>3-second matching cycle</strong>. Think of it as the platform's "heartbeat" - every 3 seconds, it checks all pending orders to see if they can be filled.</p>

                    <div className="glass-card darker">
                        <h3>Why Not Instant?</h3>
                        <p>Real stock exchanges process millions of orders per second using specialized hardware. Aequitas simulates this experience while balancing:</p>
                        <ul>
                            <li><strong>Realistic price discovery</strong> - Prices need time to move and create trading opportunities</li>
                            <li><strong>Fair order processing</strong> - All orders get checked systematically</li>
                            <li><strong>System efficiency</strong> - Prevents server overload while maintaining responsiveness</li>
                        </ul>

                        <div className="clock-visual-container">
                            <div className="ticker-animation">
                                <div className="bar active"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                            </div>
                            <div className="caption">Every 3 seconds: Check prices → Match orders → Execute trades</div>
                        </div>
                    </div>

                    <div className="info-box warning">
                        <strong>⚠️ What This Means for You:</strong> If you place a limit order, it might not fill immediately even if the price looks right. The platform checks every 3 seconds, so there can be a brief delay. Market orders execute faster but still follow this cycle.
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>How Orders Get Matched</h2>
                    </div>
                    <p>The matching process follows strict rules to ensure fairness:</p>

                    <div className="architecture-diagram-custom">
                        <div className="service-node">
                            <h4>📋 Your Order Waits</h4>
                            <p>Limit orders join a queue, waiting for the right price. Market orders get priority for immediate execution.</p>
                        </div>
                        <div className="connector">→</div>
                        <div className="service-node hotspot">
                            <h4>💰 Price Check</h4>
                            <p>The platform compares your limit price with the current market price. If they match (or better), your order is ready to execute.</p>
                        </div>
                        <div className="connector">→</div>
                        <div className="service-node">
                            <h4>✅ Trade Executed</h4>
                            <p>Your order is filled, fees are calculated (0.03% capped at ₹20), and your portfolio is updated instantly.</p>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>🎁 Price Improvement: You Get the Better Deal</h3>
                        <p>Here's a trader-friendly feature: If you place a BUY limit order at ₹100, but the market price drops to ₹98 before execution, <strong>you pay ₹98, not ₹100</strong>. You always get the best available price!</p>
                        <p><strong>Example:</strong></p>
                        <ul>
                            <li>You want to buy 100 shares, maximum price ₹50</li>
                            <li>Current market price: ₹52 (too high, order waits)</li>
                            <li>Price drops to ₹49 (perfect!)</li>
                            <li>Your order executes at ₹49, saving you ₹100 on the trade</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>T+0 Settlement: Your Money, Instantly Available</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>The Aequitas Advantage</h3>
                        <p>Traditional brokers use <strong>T+2 settlement</strong>, meaning when you sell shares, your cash is locked for 2 business days. Aequitas uses <strong>T+0 instant settlement</strong>.</p>

                        <div className="real-vs-fake-grid">
                            <div className="check-item fake">
                                <h4>🐌 Traditional Broker (T+2)</h4>
                                <p><strong>Monday 10 AM:</strong> You sell ₹50,000 worth of shares</p>
                                <p><strong>Monday-Tuesday:</strong> Money is locked, can't use it</p>
                                <p><strong>Wednesday:</strong> Finally! Cash available for trading</p>
                                <p className="highlight-bad">Lost 2 days of trading opportunities</p>
                            </div>
                            <div className="check-item real">
                                <h4>⚡ Aequitas (T+0)</h4>
                                <p><strong>Monday 10:00 AM:</strong> You sell ₹50,000 worth of shares</p>
                                <p><strong>Monday 10:00 AM:</strong> Cash instantly credited to your account</p>
                                <p><strong>Monday 10:01 AM:</strong> Use the money for your next trade</p>
                                <p className="highlight-good">Trade as many times as you want, same day</p>
                            </div>
                        </div>

                        <div className="info-box tip">
                            <strong>💡 Why This Matters:</strong> In active trading, capital velocity is everything. T+0 settlement means you can compound your gains multiple times per day, not once per week. This is especially powerful for day traders and swing traders.
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Trade Fees: Transparent & Capped</h2>
                    </div>
                    <div className="glass-card">
                        <h3>Simple, Fair Pricing</h3>
                        <p>Every trade incurs a small commission fee:</p>
                        <ul>
                            <li><strong>Commission Rate:</strong> 0.03% of trade value</li>
                            <li><strong>Maximum Cap:</strong> ₹20 per trade (you never pay more than this)</li>
                        </ul>

                        <p><strong>Examples:</strong></p>
                        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Trade Value</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>0.03% Fee</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actual Fee</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>₹5,000</td>
                                    <td style={{ padding: '0.5rem' }}>₹1.50</td>
                                    <td style={{ padding: '0.5rem' }}><strong>₹1.50</strong></td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>₹25,000</td>
                                    <td style={{ padding: '0.5rem' }}>₹7.50</td>
                                    <td style={{ padding: '0.5rem' }}><strong>₹7.50</strong></td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>₹1,00,000</td>
                                    <td style={{ padding: '0.5rem' }}>₹30.00</td>
                                    <td style={{ padding: '0.5rem' }}><strong>₹20.00</strong> (capped!)</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="info-box tip">
                            <strong>💡 Pro Tip:</strong> The fee cap means larger trades are more cost-efficient. A ₹1 lakh trade and a ₹10 lakh trade both cost ₹20 in fees.
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Data Accuracy & Reliability</h2>
                    </div>
                    <p>Aequitas is built on a foundation of accurate, real-time market data. Here's how we ensure reliability:</p>

                    <div className="glass-card">
                        <h3>📊 Real-Time Price Updates</h3>
                        <p>Market prices update continuously throughout the trading day. Your charts, watchlists, and portfolio values reflect live market conditions.</p>
                    </div>

                    <div className="glass-card">
                        <h3>🔒 Trade Integrity</h3>
                        <p>Every trade is permanent and recorded. Once executed, trades cannot be reversed or modified. This mirrors real stock exchange behavior and ensures fair play.</p>
                    </div>

                    <div className="glass-card">
                        <h3>📈 Historical Data</h3>
                        <p>All your trades, orders, and portfolio changes are preserved. You can review your complete trading history anytime to analyze performance and learn from past decisions.</p>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Orders are validated instantly</strong> - You know immediately if your trade can proceed</li>
                            <li>✅ <strong>3-second matching cycle</strong> - Balances speed with realistic market behavior</li>
                            <li>✅ <strong>Price improvement</strong> - You always get the best available price, sometimes better than your limit</li>
                            <li>✅ <strong>T+0 settlement</strong> - Your money is available immediately after selling, no waiting period</li>
                            <li>✅ <strong>Transparent fees</strong> - 0.03% commission, capped at ₹20 per trade</li>
                            <li>✅ <strong>5x leverage available</strong> - Control larger positions with 20% margin (use responsibly!)</li>
                            <li>✅ <strong>Complete trade history</strong> - Every action is recorded for your review and analysis</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Ready to Start Trading?</h3>
                    <p>Now that you understand how the platform works, explore more modules to master order types, risk management, and trading strategies.</p>
                    <Link to="/education" className="primary-btn">Explore More Modules</Link>
                </div>
            </div>
        </div>
    );
};

export default HowAequitasWorks;
