import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const ReadingPrices: React.FC = () => {
    return (
        <div className="custom-module-page chart-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Market Psychology</div>
                    <h1>Reading Prices & Charts</h1>
                    <p className="hero-lead">Prices tell stories of supply, demand, and human psychology. Master the art of reading market prices, understanding bid-ask dynamics, and interpreting what the market is really saying.</p>
                </div>
                <div className="hero-visual">
                    <div className="candle-anatomy-hero">
                        <div className="wick"></div>
                        <div className="body green"></div>
                        <div className="wick"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>The Auction Model: How Prices Are Discovered</h2>
                    </div>
                    <p>The stock market is fundamentally an <strong>auction</strong>. Every second, buyers and sellers negotiate to find a fair price. Understanding this auction process is the foundation of reading prices correctly.</p>

                    <div className="glass-card">
                        <h3>🎯 The Continuous Auction</h3>
                        <p>Unlike a traditional auction where one item is sold at a time, the stock market runs a <strong>continuous double auction</strong>:</p>
                        <ul>
                            <li><strong>Buyers compete</strong> by offering higher prices to attract sellers</li>
                            <li><strong>Sellers compete</strong> by lowering their asking prices to attract buyers</li>
                            <li><strong>Trades happen</strong> when a buyer's maximum price meets a seller's minimum price</li>
                        </ul>

                        <div className="info-box tip">
                            <strong>💡 Key Insight:</strong> Every price you see on the chart represents a moment when a buyer and seller agreed on value. The price moved because someone was willing to pay more (or accept less) than the previous trade.
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>📊 Supply & Demand in Action</h3>
                        <p><strong>Example: Reliance Industries at ₹2,500</strong></p>
                        <ul>
                            <li><strong>High Demand Scenario:</strong> Many buyers want to buy at ₹2,500, but few sellers. Buyers start bidding ₹2,501, ₹2,502, ₹2,505... Price rises until supply meets demand.</li>
                            <li><strong>High Supply Scenario:</strong> Many sellers want to sell at ₹2,500, but few buyers. Sellers start offering ₹2,499, ₹2,498, ₹2,495... Price falls until demand meets supply.</li>
                            <li><strong>Equilibrium:</strong> When buyers and sellers are balanced, price stays relatively stable with small fluctuations.</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Understanding LTP, Bid, and Ask</h2>
                    </div>
                    <p>Three critical prices exist at any moment. Understanding the difference is essential for successful trading:</p>

                    <div className="battle-report-anatomy">
                        <div className="report-item">
                            <strong>📈 Last Traded Price (LTP)</strong>
                            <span>The price of the most recent completed trade. This is the "headline" price you see everywhere.</span>
                            <div className="info-box" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                <strong>Example:</strong> LTP = ₹1,050 means the last trade happened at this price.
                            </div>
                        </div>
                        <div className="report-item">
                            <strong>💰 Bid Price (Buy Orders)</strong>
                            <span>The highest price a buyer is currently willing to pay. This is what you'll get if you place a SELL market order.</span>
                            <div className="info-box" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                <strong>Example:</strong> Bid = ₹1,049.50 means the best buyer is offering this price.
                            </div>
                        </div>
                        <div className="report-item">
                            <strong>💸 Ask Price (Sell Orders)</strong>
                            <span>The lowest price a seller is currently willing to accept. This is what you'll pay if you place a BUY market order.</span>
                            <div className="info-box" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                <strong>Example:</strong> Ask = ₹1,050.50 means the best seller wants this price.
                            </div>
                        </div>
                    </div>

                    <div className="glass-card darker">
                        <h3>🎯 The Bid-Ask Spread</h3>
                        <p>The difference between the Bid and Ask is called the <strong>spread</strong>. It represents the cost of immediate execution.</p>

                        <p><strong>Example Scenario:</strong></p>
                        <ul>
                            <li>LTP: ₹1,050 (last trade)</li>
                            <li>Bid: ₹1,049.50 (best buyer)</li>
                            <li>Ask: ₹1,050.50 (best seller)</li>
                            <li><strong>Spread: ₹1.00</strong></li>
                        </ul>

                        <div className="info-box warning">
                            <strong>⚠️ Trading Implication:</strong> If you buy at Ask (₹1,050.50) and immediately sell at Bid (₹1,049.50), you lose ₹1 per share instantly. This is why day traders need price movement to overcome the spread!
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>📉 Narrow vs Wide Spreads</h3>
                        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Stock Type</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Typical Spread</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Meaning</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Highly Liquid (Reliance, TCS)</td>
                                    <td style={{ padding: '0.5rem' }}>₹0.05 - ₹0.50</td>
                                    <td style={{ padding: '0.5rem' }}>Easy to trade, low cost</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Moderately Liquid</td>
                                    <td style={{ padding: '0.5rem' }}>₹0.50 - ₹2.00</td>
                                    <td style={{ padding: '0.5rem' }}>Decent liquidity</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>Low Liquidity (Small-cap)</td>
                                    <td style={{ padding: '0.5rem' }}>₹2.00+</td>
                                    <td style={{ padding: '0.5rem' }}>Harder to trade, higher cost</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>OHLC: The Battle Report of Each Period</h2>
                    </div>
                    <p>Charts compress thousands of trades into four key data points: <strong>Open, High, Low, Close (OHLC)</strong>. Think of each candle as a battle report.</p>

                    <div className="glass-card">
                        <h3>📊 Anatomy of OHLC</h3>
                        <div className="battle-report-anatomy">
                            <div className="report-item">
                                <strong>🔓 Open</strong>
                                <span>The first trade price when the period begins. Sets the starting point for the battle.</span>
                            </div>
                            <div className="report-item">
                                <strong>⬆️ High</strong>
                                <span>The highest price reached during the period. Shows maximum buyer strength.</span>
                            </div>
                            <div className="report-item">
                                <strong>⬇️ Low</strong>
                                <span>The lowest price reached during the period. Shows maximum seller pressure.</span>
                            </div>
                            <div className="report-item">
                                <strong>🔒 Close</strong>
                                <span>The final trade price when the period ends. Shows who won the battle.</span>
                            </div>
                        </div>

                        <p style={{ marginTop: '1.5rem' }}><strong>Interpreting the Battle:</strong></p>
                        <ul>
                            <li><strong>Close &gt; Open (Green/Bullish):</strong> Buyers won. Price ended higher than it started.</li>
                            <li><strong>Close &lt; Open (Red/Bearish):</strong> Sellers won. Price ended lower than it started.</li>
                            <li><strong>High - Low (Range):</strong> Shows the intensity of the battle. Large range = high volatility.</li>
                        </ul>
                    </div>

                    <div className="glass-card darker">
                        <h3>📈 Real Example: 5-Minute Candle</h3>
                        <p><strong>Scenario:</strong> Infosys, 10:00 AM - 10:05 AM</p>
                        <ul>
                            <li><strong>Open:</strong> ₹1,500 (first trade at 10:00 AM)</li>
                            <li><strong>High:</strong> ₹1,508 (peak reached at 10:03 AM)</li>
                            <li><strong>Low:</strong> ₹1,497 (bottom hit at 10:01 AM)</li>
                            <li><strong>Close:</strong> ₹1,505 (last trade at 10:05 AM)</li>
                        </ul>

                        <p><strong>Story:</strong> Price opened at ₹1,500, dipped to ₹1,497 (sellers tried to push down), rallied to ₹1,508 (buyers took control), and closed at ₹1,505. <span style={{ color: '#4ade80' }}>Bullish candle</span> - buyers won this 5-minute period.</p>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Choosing the Right Timeframe</h2>
                    </div>
                    <p>Different timeframes reveal different aspects of market behavior. Your trading style determines which timeframe matters most.</p>

                    <div className="timeframe-grid">
                        <div className="tf-card">
                            <h4>1-Minute (1m)</h4>
                            <p><strong>Best For:</strong> Scalpers, ultra-short-term traders</p>
                            <p><strong>Shows:</strong> Raw volatility, immediate price action, noise</p>
                            <p><strong>Risk:</strong> High noise-to-signal ratio, can be misleading</p>
                            <div className="tag">High Density</div>
                        </div>
                        <div className="tf-card">
                            <h4>5-Minute (5m)</h4>
                            <p><strong>Best For:</strong> Day traders, intraday momentum traders</p>
                            <p><strong>Shows:</strong> Short-term trends, entry/exit points</p>
                            <p><strong>Risk:</strong> Still noisy, requires quick decisions</p>
                            <div className="tag">Balanced</div>
                        </div>
                        <div className="tf-card">
                            <h4>15-Minute (15m)</h4>
                            <p><strong>Best For:</strong> Swing traders, position traders</p>
                            <p><strong>Shows:</strong> Clearer trends, reduced noise</p>
                            <p><strong>Risk:</strong> Slower signals, may miss quick moves</p>
                            <div className="tag">Balanced</div>
                        </div>
                        <div className="tf-card">
                            <h4>Daily (D)</h4>
                            <p><strong>Best For:</strong> Long-term investors, swing traders</p>
                            <p><strong>Shows:</strong> Major trends, institutional intent</p>
                            <p><strong>Risk:</strong> Very slow signals, requires patience</p>
                            <div className="tag">Strategic</div>
                        </div>
                    </div>

                    <div className="info-box tip">
                        <strong>💡 Pro Tip:</strong> Use multiple timeframes! Check daily for trend direction, 15m for entry timing, and 5m for precise execution. This is called "top-down analysis."
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Price Gaps & Discontinuities</h2>
                    </div>
                    <div className="glass-card darker">
                        <h3>⚡ When Prices Jump</h3>
                        <p>Prices don't always move smoothly. Sometimes they <strong>gap</strong> - jumping from one level to another without trading in between.</p>

                        <p><strong>Common Causes of Gaps:</strong></p>
                        <ul>
                            <li><strong>News Events:</strong> Earnings announcements, regulatory changes, major contracts</li>
                            <li><strong>Market Open:</strong> Overnight news creates gap between yesterday's close and today's open</li>
                            <li><strong>Low Liquidity:</strong> In thinly traded stocks, large orders can create gaps</li>
                            <li><strong>Circuit Breakers:</strong> Trading halts followed by resumption at different price</li>
                        </ul>

                        <div className="info-box warning">
                            <strong>⚠️ Trading Implication:</strong> If you have a limit order at ₹100 and the price gaps from ₹98 to ₹102, your order will fill at ₹102 (the market price), not ₹100. This is called "slippage" and is why stop losses don't always protect you perfectly.
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>📉 Example: Gap Down Scenario</h3>
                        <p><strong>Situation:</strong> You own shares of XYZ Company</p>
                        <ul>
                            <li><strong>Yesterday's Close:</strong> ₹500</li>
                            <li><strong>Overnight:</strong> Company announces poor earnings</li>
                            <li><strong>Today's Open:</strong> ₹450 (₹50 gap down)</li>
                            <li><strong>Your Stop Loss:</strong> ₹480 (didn't protect you!)</li>
                        </ul>
                        <p>The stock never traded at ₹480. It gapped from ₹500 to ₹450, so your stop loss triggered at ₹450, giving you a larger loss than expected.</p>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Reading Price Action: What Charts Tell You</h2>
                    </div>

                    <div className="glass-card">
                        <h3>🎯 Key Price Action Signals</h3>

                        <p><strong>1. Higher Highs & Higher Lows (Uptrend)</strong></p>
                        <p>Each peak is higher than the last, each dip is higher than the last. Buyers are in control.</p>

                        <p><strong>2. Lower Highs & Lower Lows (Downtrend)</strong></p>
                        <p>Each peak is lower than the last, each dip is lower than the last. Sellers are in control.</p>

                        <p><strong>3. Sideways/Ranging (Consolidation)</strong></p>
                        <p>Price bounces between support and resistance. Buyers and sellers are balanced, waiting for a catalyst.</p>
                    </div>

                    <div className="glass-card darker">
                        <h3>📊 Volume Confirms Price</h3>
                        <p>Price movement with high volume is more significant than price movement with low volume.</p>
                        <ul>
                            <li><strong>Price up + High volume:</strong> Strong buying interest, likely to continue</li>
                            <li><strong>Price up + Low volume:</strong> Weak move, may reverse</li>
                            <li><strong>Price down + High volume:</strong> Strong selling pressure, likely to continue</li>
                            <li><strong>Price down + Low volume:</strong> Weak move, may reverse</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Markets are auctions</strong> - Every price represents agreement between buyer and seller</li>
                            <li>✅ <strong>LTP is historical</strong> - It shows the last trade, not what you'll pay next</li>
                            <li>✅ <strong>Bid-Ask spread matters</strong> - Narrow spreads = liquid stocks, wide spreads = illiquid</li>
                            <li>✅ <strong>OHLC tells a story</strong> - Each candle shows the battle between buyers and sellers</li>
                            <li>✅ <strong>Choose your timeframe</strong> - Match it to your trading style (1m for scalping, daily for investing)</li>
                            <li>✅ <strong>Gaps happen</strong> - Prices can jump, making stop losses imperfect protection</li>
                            <li>✅ <strong>Volume confirms price</strong> - High volume moves are more reliable than low volume moves</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master the Candlesticks Next</h3>
                    <p>Now that you understand how prices form, learn to read candlestick patterns to predict future price movements.</p>
                    <Link to="/education/reading-candles" className="primary-btn">Learn Candlestick Patterns</Link>
                </div>
            </div>
        </div>
    );
};

export default ReadingPrices;
