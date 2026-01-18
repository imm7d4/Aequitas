import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const OrderBookModule: React.FC = () => {
    return (
        <div className="custom-module-page order-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill success">Market Depth</div>
                    <h1>Reading the Order Book & Market Depth</h1>
                    <p className="hero-lead">The chart shows history; the Order Book shows the future. Learn to read the intentions of thousands of traders and predict short-term price movements.</p>
                </div>
                <div className="hero-visual">
                    <div className="order-book-visual">
                        <div className="ask-wall"></div>
                        <div className="spread-label">Spread</div>
                        <div className="bid-wall"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>What is an Order Book?</h2>
                    </div>
                    <p>The Order Book is a live, real-time list of all pending buy and sell orders for a stock. It shows you exactly where traders want to buy or sell, and in what quantities.</p>

                    <div className="glass-card">
                        <h3>The Two Sides of the Book</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>📗 Bid Side (Buyers)</h4>
                                <p><strong>Who:</strong> Traders waiting to BUY</p>
                                <p><strong>Price:</strong> Maximum they'll pay</p>
                                <p><strong>Sorted:</strong> Highest price first</p>
                                <p><strong>Example:</strong> "I'll buy 100 shares at ₹500"</p>
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ef4444' }}>📕 Ask Side (Sellers)</h4>
                                <p><strong>Who:</strong> Traders waiting to SELL</p>
                                <p><strong>Price:</strong> Minimum they'll accept</p>
                                <p><strong>Sorted:</strong> Lowest price first</p>
                                <p><strong>Example:</strong> "I'll sell 100 shares at ₹502"</p>
                            </div>
                        </div>
                    </div>

                    <div className="info-box tip">
                        <strong>💡 Key Insight:</strong> The order book only shows <strong>limit orders</strong>. Market orders execute immediately and don't appear in the book.
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Reading a Real Order Book</h2>
                    </div>
                    <p>Let's analyze a real order book for Reliance Industries:</p>

                    <div className="glass-card darker">
                        <h3>Reliance Order Book Snapshot</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', marginTop: '1rem' }}>
                            {/* Bid Side */}
                            <div>
                                <h4 style={{ color: '#22c55e', textAlign: 'center' }}>BID (Buy Orders)</h4>
                                <table style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Price</th>
                                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                                            <td style={{ padding: '0.5rem' }}><strong>₹2,450.00</strong></td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right' }}><strong>500</strong></td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem' }}>₹2,449.95</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>1,200</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem' }}>₹2,449.90</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>800</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem' }}>₹2,449.50</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>3,000</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem' }}>₹2,449.00</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>2,500</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Spread */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}>
                                <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Spread</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>₹0.10</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>(0.004%)</div>
                                </div>
                            </div>

                            {/* Ask Side */}
                            <div>
                                <h4 style={{ color: '#ef4444', textAlign: 'center' }}>ASK (Sell Orders)</h4>
                                <table style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Price</th>
                                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                                            <td style={{ padding: '0.5rem' }}><strong>₹2,450.10</strong></td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right' }}><strong>600</strong></td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem' }}>₹2,450.15</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>900</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem' }}>₹2,450.20</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>1,500</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem' }}>₹2,450.50</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>5,000</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem' }}>₹2,451.00</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>4,000</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <h4>What This Tells Us:</h4>
                            <ul>
                                <li><strong>Best Bid:</strong> ₹2,450.00 (highest price buyers will pay)</li>
                                <li><strong>Best Ask:</strong> ₹2,450.10 (lowest price sellers will accept)</li>
                                <li><strong>Spread:</strong> ₹0.10 (very tight - highly liquid stock)</li>
                                <li><strong>Bid Depth:</strong> 8,000 shares waiting to buy within ₹1 of best bid</li>
                                <li><strong>Ask Depth:</strong> 12,000 shares waiting to sell within ₹1 of best ask</li>
                                <li><strong>Imbalance:</strong> More sellers than buyers → slight selling pressure</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Understanding the Bid-Ask Spread</h2>
                    </div>
                    <p>The spread is the gap between the best bid and best ask. It represents the cost of immediate execution.</p>

                    <div className="glass-card">
                        <h3>The Hidden Cost of Trading</h3>
                        <p><strong>Scenario:</strong> You want to buy and immediately sell 100 shares of a stock.</p>

                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Best Bid:</strong> ₹500.00 (you can sell here)</p>
                            <p><strong>Best Ask:</strong> ₹500.50 (you must buy here)</p>
                            <p><strong>Spread:</strong> ₹0.50</p>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>If you buy at Ask and sell at Bid:</strong></p>
                            <ul>
                                <li>Buy: 100 × ₹500.50 = ₹50,050</li>
                                <li>Sell: 100 × ₹500.00 = ₹50,000</li>
                                <li><strong>Instant Loss: ₹50 (0.1%)</strong></li>
                            </ul>
                            <p><strong>This is why you start every trade "in the red"!</strong></p>
                        </div>
                    </div>

                    <div className="glass-card darker">
                        <h3>Spread Comparison by Liquidity</h3>
                        <table style={{ width: '100%', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Stock Type</th>
                                    <th style={{ padding: '0.5rem' }}>Typical Spread</th>
                                    <th style={{ padding: '0.5rem' }}>% of Price</th>
                                    <th style={{ padding: '0.5rem' }}>Trading Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Large Cap (Reliance, TCS)</td>
                                    <td style={{ padding: '0.5rem' }}>₹0.05 - ₹0.20</td>
                                    <td style={{ padding: '0.5rem' }}>0.001% - 0.01%</td>
                                    <td style={{ padding: '0.5rem', color: '#22c55e' }}>Negligible</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Mid Cap</td>
                                    <td style={{ padding: '0.5rem' }}>₹0.50 - ₹2.00</td>
                                    <td style={{ padding: '0.5rem' }}>0.05% - 0.2%</td>
                                    <td style={{ padding: '0.5rem', color: '#fbbf24' }}>Moderate</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Small Cap / Illiquid</td>
                                    <td style={{ padding: '0.5rem' }}>₹2.00 - ₹10.00</td>
                                    <td style={{ padding: '0.5rem' }}>0.5% - 2%</td>
                                    <td style={{ padding: '0.5rem', color: '#ef4444' }}>High Cost!</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Market Depth & Liquidity Walls</h2>
                    </div>
                    <p>Market depth shows how many orders are waiting at each price level. Large orders create "walls" that can support or resist price movement.</p>

                    <div className="glass-card danger">
                        <h3>Example: The Sell Wall</h3>
                        <p><strong>Scenario:</strong> You're watching XYZ stock at ₹100. You notice a massive sell order in the book:</p>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Ask Side:</strong></p>
                            <ul>
                                <li>₹100.10: 500 shares</li>
                                <li>₹100.20: 800 shares</li>
                                <li><strong>₹100.50: 50,000 shares</strong> ← MASSIVE WALL!</li>
                                <li>₹101.00: 1,000 shares</li>
                            </ul>
                        </div>

                        <p><strong>What this means:</strong></p>
                        <ul>
                            <li>Someone (likely an institution) wants to sell 50,000 shares at ₹100.50</li>
                            <li>For price to go above ₹100.50, buyers must absorb all 50,000 shares</li>
                            <li>At ₹100.50 × 50,000 = ₹50,00,000 worth of buying pressure needed</li>
                            <li><strong>This wall acts as a "ceiling" - price will struggle to break through</strong></li>
                        </ul>

                        <div className="info-box warning">
                            <strong>⚠️ Trading Strategy:</strong> Avoid buying when you see a massive sell wall above current price. The wall will likely cap upside movement.
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>Example: The Buy Wall (Support)</h3>
                        <p><strong>Scenario:</strong> Stock is at ₹200, and you see a large buy wall below:</p>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Bid Side:</strong></p>
                            <ul>
                                <li>₹199.90: 600 shares</li>
                                <li>₹199.80: 900 shares</li>
                                <li><strong>₹199.50: 40,000 shares</strong> ← BUY WALL!</li>
                                <li>₹199.00: 1,500 shares</li>
                            </ul>
                        </div>

                        <p><strong>What this means:</strong></p>
                        <ul>
                            <li>Strong buying interest at ₹199.50</li>
                            <li>This level acts as "support" - price unlikely to fall below it easily</li>
                            <li>If you're bullish, this is a good entry zone (near support)</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Price-Time Priority (Queue Mechanics)</h2>
                    </div>
                    <p>When multiple orders exist at the same price, who gets filled first? The exchange uses a strict <strong>Price-Time Priority</strong> system.</p>

                    <div className="glass-card darker">
                        <h3>The Two Rules</h3>
                        <ol style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li><strong>Rule 1: Price Priority</strong>
                                <ul>
                                    <li>Best prices always fill first</li>
                                    <li>For buyers: Highest bid wins</li>
                                    <li>For sellers: Lowest ask wins</li>
                                </ul>
                            </li>
                            <li><strong>Rule 2: Time Priority (at same price)</strong>
                                <ul>
                                    <li>If multiple orders at same price, earliest order fills first</li>
                                    <li>First In, First Out (FIFO)</li>
                                    <li>Being 1 second earlier can mean the difference between a fill and a miss</li>
                                </ul>
                            </li>
                        </ol>
                    </div>

                    <div className="glass-card">
                        <h3>Real Example: Queue Position Matters</h3>
                        <p><strong>Scenario:</strong> Stock is at ₹500. Three traders place buy limit orders at ₹500:</p>

                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Order Queue at ₹500:</strong></p>
                            <ol>
                                <li>Trader A: 1,000 shares (placed at 10:00:00 AM)</li>
                                <li>Trader B: 500 shares (placed at 10:00:05 AM)</li>
                                <li>Trader C: 800 shares (placed at 10:00:10 AM)</li>
                            </ol>
                        </div>

                        <p><strong>What happens when a seller comes with 1,200 shares at ₹500?</strong></p>
                        <ul>
                            <li>✅ Trader A: Gets 1,000 shares (first in queue)</li>
                            <li>✅ Trader B: Gets 200 shares (partial fill)</li>
                            <li>❌ Trader C: Gets 0 shares (still waiting)</li>
                        </ul>

                        <p><strong>Trader B's remaining 300 shares and Trader C's 800 shares stay in the queue, waiting for more sellers.</strong></p>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Market Impact & Order Size</h2>
                    </div>
                    <p>Large orders can "move the market" by consuming multiple price levels in the order book.</p>

                    <div className="glass-card danger">
                        <h3>Example: Walking Up the Book</h3>
                        <p><strong>Scenario:</strong> You place a market buy order for 5,000 shares. Here's the ask side:</p>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Ask Side (Sellers):</strong></p>
                            <ul>
                                <li>₹300.00: 1,000 shares</li>
                                <li>₹300.05: 1,500 shares</li>
                                <li>₹300.10: 1,200 shares</li>
                                <li>₹300.20: 2,000 shares</li>
                            </ul>
                        </div>

                        <p><strong>Your 5,000-share market order fills like this:</strong></p>
                        <ul>
                            <li>1,000 shares @ ₹300.00 = ₹3,00,000</li>
                            <li>1,500 shares @ ₹300.05 = ₹4,50,075</li>
                            <li>1,200 shares @ ₹300.10 = ₹3,60,120</li>
                            <li>1,300 shares @ ₹300.20 = ₹3,90,260</li>
                        </ul>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Total Cost:</strong> ₹15,00,455</p>
                            <p><strong>Average Price:</strong> ₹15,00,455 ÷ 5,000 = ₹300.09</p>
                            <p><strong>Expected Price:</strong> ₹300.00</p>
                            <p><strong>Slippage:</strong> ₹0.09 per share × 5,000 = ₹450 extra cost!</p>
                        </div>

                        <p><strong>Lesson:</strong> Large market orders "walk up" (or down) the order book, getting progressively worse prices.</p>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Order Book Imbalances</h2>
                    </div>
                    <p>Comparing bid vs ask depth can predict short-term price direction.</p>

                    <div className="glass-card">
                        <h3>Bullish Imbalance (More Buyers)</h3>
                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Bid Depth (top 5 levels):</strong> 15,000 shares</p>
                            <p><strong>Ask Depth (top 5 levels):</strong> 5,000 shares</p>
                            <p><strong>Ratio:</strong> 3:1 (buyers outnumber sellers)</p>
                        </div>
                        <p style={{ marginTop: '1rem', color: '#22c55e' }}><strong>Interpretation:</strong> Strong buying pressure. Price likely to move up as buyers absorb the limited supply.</p>
                    </div>

                    <div className="glass-card danger">
                        <h3>Bearish Imbalance (More Sellers)</h3>
                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Bid Depth (top 5 levels):</strong> 4,000 shares</p>
                            <p><strong>Ask Depth (top 5 levels):</strong> 18,000 shares</p>
                            <p><strong>Ratio:</strong> 1:4.5 (sellers outnumber buyers)</p>
                        </div>
                        <p style={{ marginTop: '1rem', color: '#ef4444' }}><strong>Interpretation:</strong> Heavy selling pressure. Price likely to drop as sellers overwhelm limited demand.</p>
                    </div>

                    <div className="info-box warning">
                        <strong>⚠️ Caveat:</strong> Large players can "spoof" the order book by placing fake walls and canceling them. Always combine order book analysis with other indicators.
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Practical Trading Strategies</h2>
                    </div>

                    <div className="glass-card darker">
                        <h3>Strategy 1: Joining the Queue</h3>
                        <p><strong>Goal:</strong> Get filled at the best price without moving the market.</p>
                        <p><strong>How:</strong></p>
                        <ul>
                            <li>Place a limit order at the current best bid (to buy) or best ask (to sell)</li>
                            <li>You join the queue at that price level</li>
                            <li>Wait for your turn (time priority)</li>
                        </ul>
                        <p><strong>Pros:</strong> No slippage, best price</p>
                        <p><strong>Cons:</strong> Might not fill if price moves away</p>
                    </div>

                    <div className="glass-card">
                        <h3>Strategy 2: Crossing the Spread</h3>
                        <p><strong>Goal:</strong> Guarantee immediate execution.</p>
                        <p><strong>How:</strong></p>
                        <ul>
                            <li>To buy: Place limit order at current best ask (or use market order)</li>
                            <li>To sell: Place limit order at current best bid (or use market order)</li>
                        </ul>
                        <p><strong>Pros:</strong> Instant fill</p>
                        <p><strong>Cons:</strong> Pay the spread cost</p>
                    </div>

                    <div className="glass-card">
                        <h3>Strategy 3: Improving the Best Price</h3>
                        <p><strong>Goal:</strong> Get to the front of the queue.</p>
                        <p><strong>How:</strong></p>
                        <ul>
                            <li>Best bid is ₹500.00? Place your buy at ₹500.05</li>
                            <li>You become the new best bid (price priority)</li>
                            <li>Next seller will match with you first</li>
                        </ul>
                        <p><strong>Pros:</strong> Front of queue, high fill probability</p>
                        <p><strong>Cons:</strong> Pay slightly more (or receive slightly less)</p>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">09</span>
                        <h2>Common Mistakes to Avoid</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div className="glass-card danger">
                            <h4>❌ Mistake 1: Ignoring the Spread on Illiquid Stocks</h4>
                            <p><strong>Error:</strong> Trading small-cap stocks with ₹5 spreads without accounting for the cost.</p>
                            <p><strong>Impact:</strong> Starting 1-2% in the red immediately.</p>
                            <p><strong>Fix:</strong> Check spread before trading. If spread \u003e 0.5%, use limit orders and be patient.</p>
                        </div>

                        <div className="glass-card danger">
                            <h4>❌ Mistake 2: Large Market Orders in Thin Books</h4>
                            <p><strong>Error:</strong> Placing a 10,000-share market order when total depth is only 5,000 shares.</p>
                            <p><strong>Impact:</strong> Massive slippage, walking up/down multiple price levels.</p>
                            <p><strong>Fix:</strong> Break large orders into smaller chunks. Use limit orders.</p>
                        </div>

                        <div className="glass-card danger">
                            <h4>❌ Mistake 3: Trusting Fake Walls</h4>
                            <p><strong>Error:</strong> Seeing a huge buy wall and assuming it's real support.</p>
                            <p><strong>Impact:</strong> Wall gets canceled before price reaches it. You're left holding the bag.</p>
                            <p><strong>Fix:</strong> Walls can disappear. Don't base entire strategy on them. Use stop losses.</p>
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
                            <li>✅ <strong>Order book shows live supply/demand</strong> - Bid side (buyers), Ask side (sellers)</li>
                            <li>✅ <strong>Spread is the cost of immediacy</strong> - Tight spread = liquid, wide spread = illiquid</li>
                            <li>✅ <strong>Depth reveals pressure</strong> - More bids = buying pressure, more asks = selling pressure</li>
                            <li>✅ <strong>Walls act as support/resistance</strong> - Large orders create price barriers</li>
                            <li>✅ <strong>Price-time priority rules</strong> - Best price first, then earliest order</li>
                            <li>✅ <strong>Large orders cause slippage</strong> - Market orders walk through multiple price levels</li>
                            <li>✅ <strong>Imbalances predict movement</strong> - 3:1 bid/ask ratio suggests upward pressure</li>
                            <li>✅ <strong>Join the queue for best prices</strong> - Limit orders at best bid/ask</li>
                            <li>✅ <strong>Walls can be fake</strong> - Don't rely solely on order book, use stop losses</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master Order Execution Next</h3>
                    <p>Now that you understand the order book, learn why orders sometimes don't fill and how to troubleshoot execution issues.</p>
                    <Link to="/education/why-orders-fail" className="primary-btn">Why Orders Don't Fill</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderBookModule;
