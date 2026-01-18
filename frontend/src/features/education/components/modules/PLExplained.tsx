import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const PLExplained: React.FC = () => {
    return (
        <div className="custom-module-page margin-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Financial Literacy</div>
                    <h1>Understanding Profit & Loss (P&L)</h1>
                    <p className="hero-lead">Master the math behind trading. Learn realized vs unrealized P&L, fee calculations, and how to accurately track your trading performance.</p>
                </div>
                <div className="hero-visual">
                    <div className="pl-visual">
                        <div className="floating-bubble">Unrealized</div>
                        <div className="locked-box">Realized</div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The Two Types of P&L</h2>
                    </div>
                    <p>Every trade has two P&L states: <strong>Unrealized</strong> (floating, paper profit) and <strong>Realized</strong> (locked in, actual profit).</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                        <div className="glass-card">
                            <h3 style={{ color: '#fbbf24' }}>📊 Unrealized P&L</h3>
                            <p><strong>Definition:</strong> Profit/loss on open positions based on current market price</p>
                            <p><strong>Also called:</strong> Paper P&L, Floating P&L, MTM (Mark-to-Market)</p>
                            <p><strong>Status:</strong> Changes every second with price movement</p>
                            <p><strong>Reality:</strong> Not real money until you close the position</p>
                        </div>
                        <div className="glass-card">
                            <h3 style={{ color: '#22c55e' }}>💰 Realized P&L</h3>
                            <p><strong>Definition:</strong> Actual profit/loss from closed positions</p>
                            <p><strong>Also called:</strong> Locked P&L, Settled P&L, Booked P&L</p>
                            <p><strong>Status:</strong> Fixed, doesn't change</p>
                            <p><strong>Reality:</strong> Real money added to/subtracted from your account</p>
                        </div>
                    </div>

                    <div className="info-box tip" style={{ marginTop: '1rem' }}>
                        <strong>💡 Golden Rule:</strong> "Unrealized gains are opinions. Realized gains are facts." Don't count your profits until you close the trade!
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Unrealized P&L Calculation</h2>
                    </div>
                    <p>For open positions, your P&L fluctuates with every price change.</p>

                    <div className="glass-card">
                        <h3>The Formula</h3>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}><strong>Unrealized P&L = (Current Price - Entry Price) × Quantity</strong></p>
                        </div>
                    </div>

                    <div className="glass-card darker">
                        <h3>Example: Long Position</h3>
                        <p><strong>Scenario:</strong> You bought 100 shares of Reliance at ₹2,500</p>

                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>When price is ₹2,550:</strong></p>
                            <ul>
                                <li>Unrealized P&L = (₹2,550 - ₹2,500) × 100</li>
                                <li>Unrealized P&L = ₹50 × 100</li>
                                <li><strong style={{ color: '#22c55e' }}>Unrealized P&L = +₹5,000 (profit)</strong></li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>When price is ₹2,450:</strong></p>
                            <ul>
                                <li>Unrealized P&L = (₹2,450 - ₹2,500) × 100</li>
                                <li>Unrealized P&L = -₹50 × 100</li>
                                <li><strong style={{ color: '#ef4444' }}>Unrealized P&L = -₹5,000 (loss)</strong></li>
                            </ul>
                        </div>

                        <p style={{ marginTop: '1rem', color: '#fbbf24' }}><strong>This P&L updates in real-time as price moves!</strong></p>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Realized P&L Calculation</h2>
                    </div>
                    <p>When you close a position, your P&L becomes "realized" - locked in and final.</p>

                    <div className="glass-card">
                        <h3>The Formula (Before Fees)</h3>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}><strong>Gross P&L = (Exit Price - Entry Price) × Quantity</strong></p>
                        </div>
                    </div>

                    <div className="glass-card danger">
                        <h3>Complete Example with Fees</h3>
                        <p><strong>Trade Details:</strong></p>
                        <ul>
                            <li>Stock: TCS</li>
                            <li>Quantity: 50 shares</li>
                            <li>Entry Price: ₹3,500</li>
                            <li>Exit Price: ₹3,600</li>
                        </ul>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Step 1: Calculate Gross P&L</strong></p>
                            <ul>
                                <li>Gross P&L = (₹3,600 - ₹3,500) × 50</li>
                                <li>Gross P&L = ₹100 × 50</li>
                                <li><strong>Gross P&L = ₹5,000</strong></li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Step 2: Calculate Trading Fees</strong></p>
                            <p>Entry Trade Value: 50 × ₹3,500 = ₹1,75,000</p>
                            <ul>
                                <li>Entry Commission: ₹1,75,000 × 0.0003 = ₹52.50</li>
                                <li>Entry Commission (capped): min(₹52.50, ₹20) = <strong>₹20</strong></li>
                            </ul>
                            <p style={{ marginTop: '0.5rem' }}>Exit Trade Value: 50 × ₹3,600 = ₹1,80,000</p>
                            <ul>
                                <li>Exit Commission: ₹1,80,000 × 0.0003 = ₹54.00</li>
                                <li>Exit Commission (capped): min(₹54.00, ₹20) = <strong>₹20</strong></li>
                            </ul>
                            <p style={{ marginTop: '0.5rem' }}><strong>Total Fees = ₹20 + ₹20 = ₹40</strong></p>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Step 3: Calculate Net Realized P&L</strong></p>
                            <ul>
                                <li>Net P&L = Gross P&L - Fees</li>
                                <li>Net P&L = ₹5,000 - ₹40</li>
                                <li><strong style={{ fontSize: '1.2rem', color: '#22c55e' }}>Net Realized P&L = ₹4,960</strong></li>
                            </ul>
                            <p style={{ marginTop: '0.5rem' }}><strong>This ₹4,960 is added to your account balance!</strong></p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Fee Impact on P&L</h2>
                    </div>
                    <p>Trading fees eat into your profits. Understanding the fee structure is critical.</p>

                    <div className="glass-card">
                        <h3>Aequitas Fee Structure</h3>
                        <ul>
                            <li><strong>Commission Rate:</strong> 0.03% of trade value</li>
                            <li><strong>Cap:</strong> Maximum ₹20 per trade</li>
                            <li><strong>Applied:</strong> On both entry AND exit</li>
                        </ul>
                    </div>

                    <div className="glass-card darker">
                        <h3>Fee Impact Examples</h3>

                        <table style={{ width: '100%', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Trade Value</th>
                                    <th style={{ padding: '0.5rem' }}>0.03% Fee</th>
                                    <th style={{ padding: '0.5rem' }}>Actual Fee</th>
                                    <th style={{ padding: '0.5rem' }}>Round Trip</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>₹10,000</td>
                                    <td style={{ padding: '0.5rem' }}>₹3</td>
                                    <td style={{ padding: '0.5rem' }}>₹3</td>
                                    <td style={{ padding: '0.5rem' }}>₹6</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>₹50,000</td>
                                    <td style={{ padding: '0.5rem' }}>₹15</td>
                                    <td style={{ padding: '0.5rem' }}>₹15</td>
                                    <td style={{ padding: '0.5rem' }}>₹30</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>₹1,00,000</td>
                                    <td style={{ padding: '0.5rem' }}>₹30</td>
                                    <td style={{ padding: '0.5rem', color: '#fbbf24' }}>₹20 (capped)</td>
                                    <td style={{ padding: '0.5rem', color: '#fbbf24' }}>₹40</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>₹5,00,000</td>
                                    <td style={{ padding: '0.5rem' }}>₹150</td>
                                    <td style={{ padding: '0.5rem', color: '#22c55e' }}>₹20 (capped)</td>
                                    <td style={{ padding: '0.5rem', color: '#22c55e' }}>₹40</td>
                                </tr>
                            </tbody>
                        </table>

                        <p style={{ marginTop: '1rem', color: '#22c55e' }}><strong>Good news:</strong> For trades above ₹66,667, fees are capped at ₹20, making large trades more cost-effective!</p>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Slippage Impact on P&L</h2>
                    </div>
                    <p>The price you see isn't always the price you get. Slippage can significantly affect your realized P&L.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Slippage Problem</h3>
                        <p><strong>Scenario:</strong> You're watching a stock at ₹1,000 with +₹5,000 unrealized profit.</p>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>What you expect:</strong></p>
                            <ul>
                                <li>Current Price (LTP): ₹1,000</li>
                                <li>Expected Unrealized P&L: +₹5,000</li>
                                <li>You place a market sell order</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>What actually happens:</strong></p>
                            <ul>
                                <li>Best Bid: ₹998 (highest buyer willing to pay)</li>
                                <li>Your market order fills at ₹998</li>
                                <li>Slippage: ₹1,000 - ₹998 = ₹2 per share</li>
                                <li>If you had 100 shares: ₹2 × 100 = <strong>₹200 lost to slippage</strong></li>
                            </ul>
                            <p style={{ marginTop: '0.5rem' }}><strong>Actual Realized P&L: ₹5,000 - ₹200 - ₹40 (fees) = ₹4,760</strong></p>
                        </div>

                        <p style={{ marginTop: '1rem', color: '#fbbf24' }}><strong>Lesson:</strong> Your unrealized P&L showed ₹5,000, but you only got ₹4,760 due to slippage and fees!</p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ Minimizing Slippage</h3>
                        <ul>
                            <li><strong>Use limit orders</strong> - Control your exit price</li>
                            <li><strong>Trade liquid stocks</strong> - Tight bid-ask spreads</li>
                            <li><strong>Avoid market orders in volatile conditions</strong> - Slippage increases with volatility</li>
                            <li><strong>Account for slippage in profit targets</strong> - If targeting ₹5,000, aim for ₹5,200 unrealized</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Averaging Down/Up</h2>
                    </div>
                    <p>When you buy more shares at different prices, your average entry price changes, affecting your P&L calculation.</p>

                    <div className="glass-card">
                        <h3>Averaging Down Example</h3>
                        <p><strong>Scenario:</strong> You buy shares in multiple tranches as price falls.</p>

                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Trade 1:</strong> Buy 100 shares @ ₹500 = ₹50,000</p>
                            <p><strong>Trade 2:</strong> Buy 100 shares @ ₹480 = ₹48,000</p>
                            <p><strong>Trade 3:</strong> Buy 100 shares @ ₹460 = ₹46,000</p>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Calculate Average Entry Price:</strong></p>
                            <ul>
                                <li>Total Shares: 100 + 100 + 100 = 300</li>
                                <li>Total Cost: ₹50,000 + ₹48,000 + ₹46,000 = ₹1,44,000</li>
                                <li>Average Price = ₹1,44,000 ÷ 300 = <strong>₹480</strong></li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>P&L if you sell all 300 shares at ₹490:</strong></p>
                            <ul>
                                <li>Gross P&L = (₹490 - ₹480) × 300</li>
                                <li>Gross P&L = ₹10 × 300 = ₹3,000</li>
                                <li>Fees = ₹20 (entry 1) + ₹20 (entry 2) + ₹20 (entry 3) + ₹20 (exit) = ₹80</li>
                                <li><strong>Net P&L = ₹3,000 - ₹80 = ₹2,920</strong></li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Short Selling P&L</h2>
                    </div>
                    <p>Short selling P&L works in reverse - you profit when price falls.</p>

                    <div className="glass-card danger">
                        <h3>Short P&L Formula</h3>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}><strong>Short P&L = (Entry Price - Exit Price) × Quantity</strong></p>
                            <p style={{ textAlign: 'center', marginTop: '0.5rem', color: '#fbbf24' }}>Note: Entry and Exit are reversed!</p>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>Short Selling Example</h3>
                        <p><strong>Trade Details:</strong></p>
                        <ul>
                            <li>Short 100 shares @ ₹1,000 (you sell first)</li>
                            <li>Cover (buy back) @ ₹950 (you buy later)</li>
                        </ul>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <p><strong>P&L Calculation:</strong></p>
                            <ul>
                                <li>Gross P&L = (₹1,000 - ₹950) × 100</li>
                                <li>Gross P&L = ₹50 × 100 = ₹5,000</li>
                                <li>Fees = ₹20 (short entry) + ₹20 (cover) = ₹40</li>
                                <li><strong style={{ color: '#22c55e' }}>Net P&L = ₹5,000 - ₹40 = ₹4,960 profit</strong></li>
                            </ul>
                            <p style={{ marginTop: '0.5rem' }}><strong>You profited because price fell from ₹1,000 to ₹950!</strong></p>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>If price rose to ₹1,050 instead:</strong></p>
                            <ul>
                                <li>Gross P&L = (₹1,000 - ₹1,050) × 100</li>
                                <li>Gross P&L = -₹50 × 100 = -₹5,000</li>
                                <li>Fees = ₹40</li>
                                <li><strong style={{ color: '#ef4444' }}>Net P&L = -₹5,000 - ₹40 = -₹5,040 loss</strong></li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Intraday vs Delivery P&L</h2>
                    </div>
                    <p>The timing of when you close your position affects settlement but not P&L calculation.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="glass-card">
                            <h3>Intraday (Same Day)</h3>
                            <ul>
                                <li><strong>Entry & Exit:</strong> Same trading day</li>
                                <li><strong>Settlement:</strong> T+0 (immediate)</li>
                                <li><strong>P&L Credited:</strong> Same day</li>
                                <li><strong>Example:</strong> Buy at 10 AM, sell at 2 PM</li>
                            </ul>
                        </div>
                        <div className="glass-card">
                            <h3>Delivery (Multi-Day)</h3>
                            <ul>
                                <li><strong>Entry & Exit:</strong> Different days</li>
                                <li><strong>Settlement:</strong> T+2 (2 days after trade)</li>
                                <li><strong>P&L Credited:</strong> After settlement</li>
                                <li><strong>Example:</strong> Buy Monday, sell Wednesday</li>
                            </ul>
                        </div>
                    </div>

                    <div className="info-box tip" style={{ marginTop: '1rem' }}>
                        <strong>💡 Important:</strong> P&L calculation is the same for both. The only difference is when the money hits your account!
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">09</span>
                        <h2>Common P&L Mistakes</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div className="glass-card danger">
                            <h4>❌ Mistake 1: Counting Unrealized Gains as Real Money</h4>
                            <p><strong>Error:</strong> "I'm up ₹10,000! I can withdraw it."</p>
                            <p><strong>Reality:</strong> Unrealized P&L can disappear in seconds if price reverses.</p>
                            <p><strong>Fix:</strong> Only count realized P&L as actual profit.</p>
                        </div>

                        <div className="glass-card danger">
                            <h4>❌ Mistake 2: Ignoring Fees in Profit Targets</h4>
                            <p><strong>Error:</strong> "I need ₹1,000 profit, so I'll exit when unrealized shows ₹1,000."</p>
                            <p><strong>Reality:</strong> After fees and slippage, you'll get less than ₹1,000.</p>
                            <p><strong>Fix:</strong> Target ₹1,100 unrealized to get ₹1,000 realized (accounting for ₹40 fees + ₹60 slippage buffer).</p>
                        </div>

                        <div className="glass-card danger">
                            <h4>❌ Mistake 3: Not Tracking Average Price</h4>
                            <p><strong>Error:</strong> Adding to positions without knowing your new average entry price.</p>
                            <p><strong>Reality:</strong> You might think you're profitable when you're actually at a loss.</p>
                            <p><strong>Fix:</strong> Always calculate: Total Cost ÷ Total Shares = Average Price</p>
                        </div>

                        <div className="glass-card danger">
                            <h4>❌ Mistake 4: Confusing Short P&L Direction</h4>
                            <p><strong>Error:</strong> Thinking short P&L works the same as long P&L.</p>
                            <p><strong>Reality:</strong> For shorts, you profit when price FALLS, lose when price RISES.</p>
                            <p><strong>Fix:</strong> Remember: Short P&L = (Entry - Exit) × Quantity (reversed!)</p>
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
                            <li>✅ <strong>Unrealized P&L is paper profit</strong> - Changes with price, not real until closed</li>
                            <li>✅ <strong>Realized P&L is actual profit</strong> - Locked in, added to your account</li>
                            <li>✅ <strong>Always account for fees</strong> - ₹40 round trip (₹20 entry + ₹20 exit) for large trades</li>
                            <li>✅ <strong>Slippage reduces realized P&L</strong> - Market orders fill at bid/ask, not LTP</li>
                            <li>✅ <strong>Averaging changes entry price</strong> - Total Cost ÷ Total Shares</li>
                            <li>✅ <strong>Short P&L is reversed</strong> - Profit when price falls</li>
                            <li>✅ <strong>Don't spend unrealized gains</strong> - Price can reverse anytime</li>
                            <li>✅ <strong>Target higher unrealized P&L</strong> - To account for fees and slippage</li>
                            <li>✅ <strong>Track your average price</strong> - Especially when adding to positions</li>
                            <li>✅ <strong>Settlement timing varies</strong> - Intraday (T+0) vs Delivery (T+2)</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master Margin & Leverage Next</h3>
                    <p>Now that you understand P&L, learn how leverage amplifies both profits and losses.</p>
                    <Link to="/education/margin-leverage" className="primary-btn">Learn Margin & Leverage</Link>
                </div>
            </div>
        </div>
    );
};

export default PLExplained;
