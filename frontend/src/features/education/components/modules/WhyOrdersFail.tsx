import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const WhyOrdersFail: React.FC = () => {
    return (
        <div className="custom-module-page order-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill danger">Troubleshooting</div>
                    <h1>Why Orders Don't Fill: Complete Troubleshooting Guide</h1>
                    <p className="hero-lead">"The price touched my limit but I wasn't filled!" Learn the real reasons why orders fail and how to fix them.</p>
                </div>
                <div className="hero-visual">
                    <div className="failed-order-visual">
                        <div className="ghost-order"></div>
                        <div className="price-line-jump"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>Reason 1: Insufficient Funds</h2>
                    </div>
                    <p>The #1 reason orders fail. You don't have enough cash to cover the order value plus fees and buffers.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Problem</h3>
                        <p><strong>Scenario:</strong> You have ₹10,000 cash. You try to buy 100 shares at ₹100.</p>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Required Calculation:</strong></p>
                            <ul>
                                <li>Base Cost: 100 × ₹100 = ₹10,000</li>
                                <li>Market Buffer (1% for market orders): ₹10,000 × 1.01 = ₹10,100</li>
                                <li>Commission: ₹10,000 × 0.0003 = ₹3</li>
                                <li><strong>Total Required: ₹10,103</strong></li>
                            </ul>
                            <p style={{ color: '#ef4444', marginTop: '1rem' }}><strong>You have: ₹10,000</strong></p>
                            <p style={{ color: '#ef4444' }}><strong>Shortfall: ₹103</strong></p>
                            <p><strong>Result: ORDER REJECTED</strong></p>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <ul>
                            <li><strong>Check available cash</strong> before placing orders</li>
                            <li><strong>Account for the 1% buffer</strong> on market orders</li>
                            <li><strong>Reduce quantity</strong> - Try 98 shares instead of 100</li>
                            <li><strong>Use limit orders</strong> - No 1% buffer required</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Reason 2: Price Never Reached Your Limit</h2>
                    </div>
                    <p>The most common misconception: "The chart shows the price touched my level!" But did it really?</p>

                    <div className="glass-card danger">
                        <h3>❌ The Problem: Price Gaps</h3>
                        <p><strong>Scenario:</strong> You place a buy limit order at ₹500. You see the chart showing:</p>
                        <ul>
                            <li>10:00 AM: ₹502</li>
                            <li>10:01 AM: ₹498</li>
                        </ul>
                        <p><strong>Your thinking:</strong> "Price must have passed through ₹500, so my order should have filled!"</p>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Reality:</strong> Price JUMPED from ₹502 directly to ₹498. It never traded at ₹500, ₹501, or ₹499.</p>
                            <p><strong>Markets are discontinuous</strong> - price doesn't "travel," it teleports between levels.</p>
                            <p><strong>No trades at ₹500 = No fill for your ₹500 limit order</strong></p>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <ul>
                            <li><strong>Don't rely on chart lines</strong> - They interpolate between points</li>
                            <li><strong>Check actual trade prices</strong> - Look at the trade history/tape</li>
                            <li><strong>Adjust your limit</strong> - If you want ₹500, consider ₹501 to increase fill probability</li>
                            <li><strong>Use market orders</strong> - If you need guaranteed execution</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Reason 3: Queue Position (Too Far Back)</h2>
                    </div>
                    <p>Your order reached the right price, but there were thousands of orders ahead of you in the queue.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Problem</h3>
                        <p><strong>Scenario:</strong> Stock is at ₹1,000. You place a buy limit at ₹995.</p>

                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Order Book at ₹995:</strong></p>
                            <ol>
                                <li>Trader A: 5,000 shares (placed yesterday)</li>
                                <li>Trader B: 10,000 shares (placed this morning)</li>
                                <li>Trader C: 3,000 shares (placed 1 hour ago)</li>
                                <li><strong>YOU: 500 shares (just placed)</strong></li>
                            </ol>
                        </div>

                        <p style={{ marginTop: '1rem' }}><strong>What happens when price touches ₹995:</strong></p>
                        <ul>
                            <li>Only 8,000 shares trade at ₹995</li>
                            <li>Trader A gets 5,000 shares (filled)</li>
                            <li>Trader B gets 3,000 shares (partial fill, 7,000 still pending)</li>
                            <li>Trader C gets 0 shares (still waiting)</li>
                            <li><strong>YOU get 0 shares (still waiting)</strong></li>
                        </ul>

                        <p style={{ marginTop: '1rem', color: '#ef4444' }}><strong>You're 4th in line. You need 18,500 shares to trade at ₹995 before you get filled!</strong></p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <ul>
                            <li><strong>Improve your price</strong> - Bid ₹996 instead of ₹995 to jump the queue</li>
                            <li><strong>Place orders early</strong> - Time priority matters</li>
                            <li><strong>Check order book depth</strong> - See how many orders are ahead of you</li>
                            <li><strong>Be patient</strong> - Your order might fill later when more volume comes</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Reason 4: Lot Size Violations</h2>
                    </div>
                    <p>Exchanges enforce minimum lot sizes. You can't buy arbitrary quantities.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Problem</h3>
                        <p><strong>Scenario:</strong> Stock has a lot size of 100. You try to buy 150 shares.</p>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Rule:</strong> Quantity must be a multiple of lot size</p>
                            <p><strong>Valid quantities:</strong> 100, 200, 300, 400...</p>
                            <p><strong>Invalid quantities:</strong> 50, 150, 250, 175...</p>
                            <p><strong>Your 150 shares: REJECTED</strong></p>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <ul>
                            <li><strong>Check lot size</strong> before placing orders</li>
                            <li><strong>Round to nearest multiple</strong> - 150 → 100 or 200</li>
                            <li><strong>Platform usually shows lot size</strong> in the order entry form</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Reason 5: Validity Expired</h2>
                    </div>
                    <p>Your order had a time limit, and it expired before filling.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Problem: IOC Orders</h3>
                        <p><strong>Scenario:</strong> You place a limit order with IOC (Immediate or Cancel) validity.</p>

                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>What IOC means:</strong></p>
                            <ul>
                                <li>Order is checked in the next matching cycle (3 seconds)</li>
                                <li>If not filled immediately, order is auto-canceled</li>
                                <li>No waiting, no queue - fill now or cancel</li>
                            </ul>
                        </div>

                        <p style={{ marginTop: '1rem', color: '#ef4444' }}><strong>If price doesn't match in those 3 seconds: ORDER CANCELED</strong></p>
                    </div>

                    <div className="glass-card danger">
                        <h3>❌ The Problem: DAY Orders</h3>
                        <p><strong>Scenario:</strong> You place a limit order with DAY validity at 2:00 PM.</p>
                        <ul>
                            <li>Market closes at 3:30 PM</li>
                            <li>Your order doesn't fill by 3:30 PM</li>
                            <li><strong>Result: Order auto-canceled at market close</strong></li>
                        </ul>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <ul>
                            <li><strong>Use DAY validity</strong> for normal trading (not IOC)</li>
                            <li><strong>Use GTC (Good Till Canceled)</strong> if you want orders to persist across days</li>
                            <li><strong>Check order status</strong> - Canceled orders won't fill</li>
                            <li><strong>Re-place orders</strong> if they expire and you still want them</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Reason 6: Market Closed / Pre-Market Hours</h2>
                    </div>
                    <p>You can place orders anytime, but they only execute during market hours.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Problem</h3>
                        <p><strong>Market Hours:</strong> 9:15 AM - 3:30 PM (Indian markets)</p>

                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Scenario:</strong> You place an order at 8:00 AM or 5:00 PM</p>
                            <ul>
                                <li>Order is accepted and queued</li>
                                <li>But it won't execute until market opens/reopens</li>
                                <li>By then, price might have moved significantly</li>
                            </ul>
                        </div>

                        <p style={{ marginTop: '1rem', color: '#fbbf24' }}><strong>Overnight orders face gap risk</strong> - Stock might open 5% higher or lower than your limit price.</p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <ul>
                            <li><strong>Check market hours</strong> before expecting fills</li>
                            <li><strong>Adjust limits for overnight orders</strong> - Account for potential gaps</li>
                            <li><strong>Cancel and re-place</strong> orders at market open if needed</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Reason 7: Circuit Breakers / Trading Halts</h2>
                    </div>
                    <p>Exchanges halt trading when stocks move too much too fast.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Problem</h3>
                        <p><strong>Circuit Breaker Limits:</strong></p>
                        <table style={{ width: '100%', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Stock Type</th>
                                    <th style={{ padding: '0.5rem' }}>Lower Limit</th>
                                    <th style={{ padding: '0.5rem' }}>Upper Limit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Large Cap (Nifty 50)</td>
                                    <td style={{ padding: '0.5rem' }}>-10%</td>
                                    <td style={{ padding: '0.5rem' }}>+10%</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Mid/Small Cap</td>
                                    <td style={{ padding: '0.5rem' }}>-20%</td>
                                    <td style={{ padding: '0.5rem' }}>+20%</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>What happens when circuit breaker hits:</strong></p>
                            <ul>
                                <li>Trading is halted for 15 minutes</li>
                                <li>No orders can execute</li>
                                <li>Your pending orders stay pending</li>
                                <li>After halt, trading resumes (maybe)</li>
                            </ul>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <ul>
                            <li><strong>Be aware of circuit breakers</strong> - They're normal market mechanics</li>
                            <li><strong>Don't panic</strong> - Wait for trading to resume</li>
                            <li><strong>Reassess your order</strong> - Price might have changed significantly</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Reason 8: Stop Orders Not Triggered</h2>
                    </div>
                    <p>Stop orders only activate when the trigger price is hit. If it's not hit, they stay dormant.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Problem</h3>
                        <p><strong>Scenario:</strong> You own stock at ₹1,000. You set a stop-loss at ₹950.</p>

                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>What you expect:</strong> If stock drops, you'll be protected</p>
                            <p><strong>Reality:</strong> Stock stays at ₹1,005 all day</p>
                            <p><strong>Result:</strong> Stop never triggers, order stays PENDING</p>
                        </div>

                        <p style={{ marginTop: '1rem' }}><strong>Stop orders are "dormant sentinels"</strong> - They only wake up when trigger price is reached.</p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <ul>
                            <li><strong>Check trigger conditions</strong> - Has the stop price been hit?</li>
                            <li><strong>Verify stop price</strong> - Make sure it's set correctly</li>
                            <li><strong>Monitor price movement</strong> - Stop might trigger later</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">09</span>
                        <h2>Reason 9: Partial Fills (Not Enough Liquidity)</h2>
                    </div>
                    <p>Sometimes you get a partial fill - only some of your order executes.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Problem</h3>
                        <p><strong>Scenario:</strong> You want to buy 1,000 shares at ₹500.</p>

                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Order book at ₹500 (Ask side):</strong></p>
                            <ul>
                                <li>Only 400 shares available for sale at ₹500</li>
                                <li>Next level: 600 shares at ₹500.50</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>What happens:</strong></p>
                            <ul>
                                <li>You get 400 shares at ₹500 (FILLED)</li>
                                <li>Remaining 600 shares stay PENDING at ₹500</li>
                                <li>They'll only fill if more sellers come at ₹500</li>
                            </ul>
                        </div>

                        <p style={{ marginTop: '1rem', color: '#fbbf24' }}><strong>This is normal in illiquid stocks or large orders!</strong></p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <ul>
                            <li><strong>Be patient</strong> - Remaining shares might fill later</li>
                            <li><strong>Adjust your limit</strong> - Increase to ₹500.50 to fill faster</li>
                            <li><strong>Break into smaller orders</strong> - Multiple 200-share orders instead of one 1,000-share order</li>
                            <li><strong>Use market orders</strong> - Guaranteed full fill (but at varying prices)</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">10</span>
                        <h2>Diagnostic Flowchart</h2>
                    </div>

                    <div className="glass-card darker">
                        <h3>🔍 Step-by-Step Troubleshooting</h3>

                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem' }}>
                                <p><strong>Step 1: Check Order Status</strong></p>
                                <ul>
                                    <li>PENDING → Order is active, waiting for price/conditions</li>
                                    <li>FILLED → Order executed successfully</li>
                                    <li>PARTIALLY_FILLED → Some shares filled, rest pending</li>
                                    <li>CANCELED → Order was canceled (manually or auto)</li>
                                    <li>REJECTED → Order failed validation</li>
                                </ul>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem' }}>
                                <p><strong>Step 2: If REJECTED, Check:</strong></p>
                                <ul>
                                    <li>✓ Sufficient funds? (Base cost + buffer + fees)</li>
                                    <li>✓ Valid lot size? (Quantity is multiple of lot size)</li>
                                    <li>✓ Valid price? (Within circuit breaker limits)</li>
                                </ul>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem' }}>
                                <p><strong>Step 3: If PENDING, Check:</strong></p>
                                <ul>
                                    <li>✓ Has price reached your limit?</li>
                                    <li>✓ Is market open? (9:15 AM - 3:30 PM)</li>
                                    <li>✓ Is stock halted? (Circuit breaker)</li>
                                    <li>✓ What's your queue position? (Check order book)</li>
                                    <li>✓ Validity still active? (Not expired)</li>
                                </ul>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem' }}>
                                <p><strong>Step 4: If PARTIALLY_FILLED, Check:</strong></p>
                                <ul>
                                    <li>✓ How much liquidity is available at your price?</li>
                                    <li>✓ Do you want to wait or adjust price?</li>
                                </ul>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <p><strong>Step 5: If CANCELED, Check:</strong></p>
                                <ul>
                                    <li>✓ Did you cancel it manually?</li>
                                    <li>✓ Did validity expire? (IOC/DAY)</li>
                                    <li>✓ Was it auto-canceled due to insufficient funds?</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">11</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Most "failures" are normal market mechanics</strong> - Not bugs or errors</li>
                            <li>✅ <strong>Check funds first</strong> - Account for buffer (1%) and fees (0.03%)</li>
                            <li>✅ <strong>Price gaps are real</strong> - Chart lines don't mean trades happened</li>
                            <li>✅ <strong>Queue position matters</strong> - Earlier orders fill first at same price</li>
                            <li>✅ <strong>Lot sizes are enforced</strong> - Must be multiples (100, 200, 300...)</li>
                            <li>✅ <strong>Validity matters</strong> - IOC cancels fast, DAY expires at close, GTC persists</li>
                            <li>✅ <strong>Market hours matter</strong> - Orders only execute 9:15 AM - 3:30 PM</li>
                            <li>✅ <strong>Circuit breakers halt trading</strong> - Normal safety mechanism</li>
                            <li>✅ <strong>Partial fills are normal</strong> - Especially in illiquid stocks</li>
                            <li>✅ <strong>Use the diagnostic flowchart</strong> - Systematic troubleshooting saves time</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master P&L Calculations Next</h3>
                    <p>Now that you understand order execution, learn how to calculate and track your profits and losses accurately.</p>
                    <Link to="/education/pnl-explained" className="primary-btn">Learn P&L Calculations</Link>
                </div>
            </div>
        </div>
    );
};

export default WhyOrdersFail;
