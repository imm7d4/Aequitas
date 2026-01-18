import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const LiquidityMetrics: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill warning">Market Depth</div>
                    <h1>Liquidity & Market Impact</h1>
                    <p className="hero-lead">Liquidity is the oxygen of the market. When it runs out, prices collapse. Learn to measure market depth, understand impact cost, and avoid liquidity traps.</p>
                </div>
                <div className="hero-visual">
                    <div className="liquidity-visual">
                        <div className="pool-ripple"></div>
                        <div className="depth-gauge"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>What is Liquidity?</h2>
                    </div>
                    <p><strong>Liquidity</strong> is the ability to buy or sell an asset quickly without significantly affecting its price. High liquidity = easy to trade, low liquidity = difficult and expensive to trade.</p>

                    <div className="glass-card">
                        <h3>Liquidity Characteristics</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>✅ High Liquidity Stock</h4>
                                <ul>
                                    <li><strong>Tight spread:</strong> ₹500.00 bid, ₹500.10 ask (0.02%)</li>
                                    <li><strong>Deep order book:</strong> 10,000+ shares at each level</li>
                                    <li><strong>High volume:</strong> 10 million+ shares daily</li>
                                    <li><strong>Quick execution:</strong> Orders fill instantly</li>
                                    <li><strong>Low impact:</strong> 1,000 share order barely moves price</li>
                                </ul>
                                <p style={{ marginTop: '0.5rem', color: '#22c55e' }}><strong>Example:</strong> Reliance, TCS, HDFC Bank</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ef4444' }}>❌ Low Liquidity Stock</h4>
                                <ul>
                                    <li><strong>Wide spread:</strong> ₹100.00 bid, ₹102.00 ask (2%)</li>
                                    <li><strong>Thin order book:</strong> 100-500 shares at each level</li>
                                    <li><strong>Low volume:</strong> 10,000 shares daily</li>
                                    <li><strong>Slow execution:</strong> Orders take minutes/hours</li>
                                    <li><strong>High impact:</strong> 1,000 share order moves price 3-5%</li>
                                </ul>
                                <p style={{ marginTop: '0.5rem', color: '#ef4444' }}><strong>Example:</strong> Small-cap stocks, penny stocks</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Bid-Ask Spread: The Liquidity Tax</h2>
                    </div>
                    <p>The bid-ask spread is the difference between the highest buy price and lowest sell price. It's an invisible cost you pay on every trade.</p>

                    <div className="glass-card darker">
                        <h3>Understanding the Spread</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p><strong>Spread % = ((Ask - Bid) / Ask) × 100</strong></p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Example 1: Tight Spread (High Liquidity)</strong></p>
                            <ul>
                                <li>Bid: ₹500.00</li>
                                <li>Ask: ₹500.10</li>
                                <li>Spread: ₹0.10</li>
                                <li>Spread %: (0.10 / 500.10) × 100 = <strong>0.02%</strong></li>
                            </ul>
                            <p style={{ color: '#22c55e', marginTop: '0.5rem' }}><strong>Impact:</strong> Buy 100 shares, pay ₹10 extra (₹0.10 × 100). Minimal cost!</p>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Example 2: Wide Spread (Low Liquidity)</strong></p>
                            <ul>
                                <li>Bid: ₹100.00</li>
                                <li>Ask: ₹103.00</li>
                                <li>Spread: ₹3.00</li>
                                <li>Spread %: (3.00 / 103.00) × 100 = <strong>2.91%</strong></li>
                            </ul>
                            <p style={{ color: '#ef4444', marginTop: '0.5rem' }}><strong>Impact:</strong> Buy 100 shares, pay ₹300 extra! You're down 2.91% before the stock even moves!</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Market Impact: The Cost of Size</h2>
                    </div>
                    <p>When your order is larger than available liquidity, you "eat through" the order book, getting progressively worse prices.</p>

                    <div className="glass-card">
                        <h3>Market Impact Example</h3>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Order Book Snapshot:</strong></p>
                            <table style={{ width: '100%', marginTop: '1rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ padding: '0.5rem' }}>Ask Price</th>
                                        <th style={{ padding: '0.5rem' }}>Ask Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>₹500.50</td>
                                        <td style={{ padding: '0.5rem' }}>500 shares</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>₹500.30</td>
                                        <td style={{ padding: '0.5rem' }}>300 shares</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>₹500.10</td>
                                        <td style={{ padding: '0.5rem' }}>200 shares</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>₹500.00 (LTP)</td>
                                        <td style={{ padding: '0.5rem' }}>-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Scenario: You want to buy 1,000 shares with market order</strong></p>
                            <ul>
                                <li>First 200 shares @ ₹500.10 = ₹1,00,020</li>
                                <li>Next 300 shares @ ₹500.30 = ₹1,50,090</li>
                                <li>Final 500 shares @ ₹500.50 = ₹2,50,250</li>
                            </ul>
                            <p style={{ marginTop: '0.5rem' }}><strong>Total Cost:</strong> ₹5,00,360</p>
                            <p><strong>Average Price:</strong> ₹5,00,360 / 1,000 = ₹500.36</p>
                            <p style={{ color: '#ef4444', marginTop: '0.5rem' }}><strong>Impact:</strong> You paid ₹500.36 vs LTP of ₹500.00 = 0.072% slippage (₹360 extra!)</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Measuring Market Depth</h2>
                    </div>
                    <p>Market depth shows how many shares are available at each price level. Deeper markets can absorb larger orders without significant price impact.</p>

                    <div className="glass-card darker">
                        <h3>Depth Analysis</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>✅ Deep Market (Good)</h4>
                                <p><strong>Top 5 Bid/Ask Levels:</strong></p>
                                <ul>
                                    <li>Each level has 5,000-10,000 shares</li>
                                    <li>Total depth: 50,000+ shares within 0.5%</li>
                                    <li>Can execute 10,000 share order with minimal impact</li>
                                </ul>
                                <p style={{ marginTop: '0.5rem', color: '#22c55e' }}><strong>Ideal for:</strong> Large position sizes, institutional trading</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ef4444' }}>❌ Shallow Market (Risky)</h4>
                                <p><strong>Top 5 Bid/Ask Levels:</strong></p>
                                <ul>
                                    <li>Each level has 100-500 shares</li>
                                    <li>Total depth: 2,000 shares within 0.5%</li>
                                    <li>1,000 share order will cause 2-3% price impact</li>
                                </ul>
                                <p style={{ marginTop: '0.5rem', color: '#ef4444' }}><strong>Risk:</strong> Hard to enter/exit, high slippage, potential flash crashes</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Bid-Ask Imbalance</h2>
                    </div>
                    <p>When there's significantly more buying or selling pressure in the order book, it often precedes price movement.</p>

                    <div className="glass-card">
                        <h3>Imbalance Ratio</h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}><strong>Imbalance Ratio = Total Bid Quantity / Total Ask Quantity</strong></p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <table style={{ width: '100%' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Ratio</th>
                                        <th style={{ padding: '0.5rem' }}>Interpretation</th>
                                        <th style={{ padding: '0.5rem' }}>Expected Move</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>\u003e 2.0</td>
                                        <td style={{ padding: '0.5rem', color: '#22c55e' }}>Heavy Buy Pressure</td>
                                        <td style={{ padding: '0.5rem' }}>Likely to move up</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>1.2 - 2.0</td>
                                        <td style={{ padding: '0.5rem', color: '#22c55e' }}>Moderate Buy Pressure</td>
                                        <td style={{ padding: '0.5rem' }}>Slight upward bias</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>0.8 - 1.2</td>
                                        <td style={{ padding: '0.5rem' }}>Balanced</td>
                                        <td style={{ padding: '0.5rem' }}>Neutral/choppy</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>0.5 - 0.8</td>
                                        <td style={{ padding: '0.5rem', color: '#ef4444' }}>Moderate Sell Pressure</td>
                                        <td style={{ padding: '0.5rem' }}>Slight downward bias</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}>\u003c 0.5</td>
                                        <td style={{ padding: '0.5rem', color: '#ef4444' }}>Heavy Sell Pressure</td>
                                        <td style={{ padding: '0.5rem' }}>Likely to move down</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Example:</strong></p>
                            <ul>
                                <li>Total Bid Quantity (top 5 levels): 15,000 shares</li>
                                <li>Total Ask Quantity (top 5 levels): 5,000 shares</li>
                                <li>Imbalance Ratio: 15,000 / 5,000 = <strong>3.0</strong></li>
                            </ul>
                            <p style={{ marginTop: '0.5rem', color: '#22c55e' }}><strong>Interpretation:</strong> Very heavy buy pressure! 3x more buyers than sellers → Expect upward price movement</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Liquidity Voids & Flash Crashes</h2>
                    </div>
                    <p>When a large market order depletes the entire order book, price can "teleport" to the next available level, creating dramatic price gaps.</p>

                    <div className="glass-card darker">
                        <h3>How Flash Crashes Happen</h3>

                        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginTop: '1.5rem' }}>
                            <h4 style={{ color: '#ef4444' }}>Flash Crash Scenario</h4>
                            <p><strong>Order Book Before:</strong></p>
                            <ul>
                                <li>₹500.00: 100 shares</li>
                                <li>₹499.50: 200 shares</li>
                                <li>₹499.00: 150 shares</li>
                                <li>₹495.00: 500 shares (liquidity void - no orders between ₹499 and ₹495)</li>
                            </ul>
                            <p style={{ marginTop: '1rem' }}><strong>Event:</strong> Panic seller places market sell order for 500 shares</p>
                            <p style={{ marginTop: '0.5rem' }}><strong>Result:</strong></p>
                            <ul>
                                <li>First 100 shares @ ₹500.00</li>
                                <li>Next 200 shares @ ₹499.50</li>
                                <li>Next 150 shares @ ₹499.00</li>
                                <li>Final 50 shares @ ₹495.00 (jumped ₹4!)</li>
                            </ul>
                            <p style={{ marginTop: '0.5rem', color: '#ef4444' }}><strong>Impact:</strong> Price crashed from ₹500 to ₹495 (-1%) in seconds due to liquidity void!</p>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>⚠️ Protection Strategy:</strong></p>
                            <ul>
                                <li>Never use market orders in low liquidity stocks</li>
                                <li>Always check order book depth before trading</li>
                                <li>Use limit orders to control maximum price</li>
                                <li>Avoid trading during pre-market or post-market hours (low liquidity)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Liquidity-Based Trading Strategies</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div className="glass-card">
                            <h4>Strategy 1: Liquidity Wall Breakout</h4>
                            <p><strong>Setup:</strong> Large order (5,000+ shares) sitting at resistance level</p>
                            <p><strong>Signal:</strong> Wall gets absorbed (bought through) with high volume</p>
                            <p><strong>Trade:</strong> Buy on breakout above wall, expect strong move</p>
                            <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> 10,000 share sell wall at ₹505, gets absorbed → Price likely to surge to ₹510+</p>
                        </div>

                        <div className="glass-card">
                            <h4>Strategy 2: Liquidity Trap Fade</h4>
                            <p><strong>Setup:</strong> Price spikes on low volume into liquidity void</p>
                            <p><strong>Signal:</strong> No follow-through buying, volume dries up</p>
                            <p><strong>Trade:</strong> Short the spike, target return to previous support</p>
                            <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Stock spikes from ₹500 to ₹510 on 1/10th normal volume → Likely to fall back to ₹500</p>
                        </div>

                        <div className="glass-card">
                            <h4>Strategy 3: Imbalance Scalping</h4>
                            <p><strong>Setup:</strong> Extreme bid/ask imbalance (ratio \u003e 3.0 or \u003c 0.33)</p>
                            <p><strong>Signal:</strong> Imbalance persists for 2-3 minutes</p>
                            <p><strong>Trade:</strong> Trade in direction of imbalance for quick scalp</p>
                            <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Ratio = 4.0 (heavy buy pressure) → Buy, target 0.3-0.5% quick profit</p>
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
                            <li>✅ <strong>Liquidity = ability to trade without impact</strong> - High liquidity = tight spreads, deep order book</li>
                            <li>✅ <strong>Bid-ask spread is invisible cost</strong> - Wide spreads (2%+) make trading unprofitable</li>
                            <li>✅ <strong>Market impact increases with order size</strong> - Large orders "eat through" order book</li>
                            <li>✅ <strong>Check depth before trading</strong> - Ensure sufficient liquidity for your position size</li>
                            <li>✅ <strong>Imbalance ratio predicts movement</strong> - \u003e2.0 = bullish, \u003c0.5 = bearish</li>
                            <li>✅ <strong>Liquidity voids cause flash crashes</strong> - Price gaps when order book is thin</li>
                            <li>✅ <strong>Never use market orders in illiquid stocks</strong> - Use limit orders to control price</li>
                            <li>✅ <strong>Avoid trading during thin sessions</strong> - Pre-market, post-market, lunch hour</li>
                            <li>✅ <strong>Liquidity walls act as support/resistance</strong> - Large orders create price barriers</li>
                            <li>✅ <strong>Wall absorption signals breakout</strong> - When big order gets filled, expect strong move</li>
                            <li>✅ <strong>Low volume spikes are traps</strong> - Likely to reverse quickly</li>
                            <li>✅ <strong>Size your positions to market depth</strong> - Don't trade 10,000 shares in stock with 1,000 share depth</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Liquidity Defines Your Edge</h3>
                    <p>Always check market depth before taking high-leverage positions. Liquidity determines how fast you can get out, and in volatile markets, speed is survival.</p>
                    <Link to="/education/market-microstructure" className="primary-btn">Learn Market Microstructure</Link>
                </div>
            </div>
        </div>
    );
};

export default LiquidityMetrics;
