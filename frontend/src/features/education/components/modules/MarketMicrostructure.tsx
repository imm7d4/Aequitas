import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const MarketMicrostructure: React.FC = () => {
    return (
        <div className="custom-module-page aequitas-dark">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill">Market Theory</div>
                    <h1>Market Microstructure</h1>
                    <p className="hero-lead">Under the hood of every trade isn't just data—it's mechanisms. Learn how modern exchanges work, how orders are matched, and how market participants interact to create price discovery.</p>
                </div>
                <div className="hero-visual">
                    <div className="gear-visual">
                        <div className="gear large"></div>
                        <div className="gear small"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>What is Market Microstructure?</h2>
                    </div>
                    <p><strong>Market Microstructure</strong> is the study of how markets operate at the most granular level: how orders are placed, matched, and executed, and how this process creates prices.</p>

                    <div className="glass-card">
                        <h3>The Three Core Questions</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#3b82f6' }}>1. How Are Prices Formed?</h4>
                                <p>Prices emerge from the interaction of buy and sell orders in the order book. The last matched price becomes the Last Traded Price (LTP).</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Buyer offers ₹500, seller accepts → LTP = ₹500</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#a855f7' }}>2. How Are Orders Matched?</h4>
                                <p>Exchanges use matching engines that follow strict rules: Price-Time Priority. Best price gets matched first, then earliest timestamp at that price.</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Two buy orders at ₹500, one placed at 9:15 AM, one at 9:16 AM → 9:15 AM order fills first</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>3. Who Are the Market Participants?</h4>
                                <p>Different traders have different goals: retail traders seek profits, market makers provide liquidity, institutions execute large orders, and HFT firms profit from speed.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>The Continuous Double Auction</h2>
                    </div>
                    <p>Modern stock exchanges use a <strong>Continuous Double Auction (CDA)</strong> model where buyers and sellers continuously submit orders, and trades happen whenever prices match.</p>

                    <div className="glass-card darker">
                        <h3>How It Works</h3>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Order Book Structure:</strong></p>
                            <table style={{ width: '100%', marginTop: '1rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ padding: '0.5rem' }}>Bid (Buy)</th>
                                        <th style={{ padding: '0.5rem' }}>Quantity</th>
                                        <th style={{ padding: '0.5rem' }}>Price</th>
                                        <th style={{ padding: '0.5rem' }}>Quantity</th>
                                        <th style={{ padding: '0.5rem' }}>Ask (Sell)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}></td>
                                        <td style={{ padding: '0.5rem' }}></td>
                                        <td style={{ padding: '0.5rem' }}>₹500.50</td>
                                        <td style={{ padding: '0.5rem' }}>500</td>
                                        <td style={{ padding: '0.5rem', color: '#ef4444' }}>Sell</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}></td>
                                        <td style={{ padding: '0.5rem' }}></td>
                                        <td style={{ padding: '0.5rem' }}>₹500.30</td>
                                        <td style={{ padding: '0.5rem' }}>300</td>
                                        <td style={{ padding: '0.5rem', color: '#ef4444' }}>Sell</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem' }}></td>
                                        <td style={{ padding: '0.5rem' }}></td>
                                        <td style={{ padding: '0.5rem' }}>₹500.10</td>
                                        <td style={{ padding: '0.5rem' }}>200</td>
                                        <td style={{ padding: '0.5rem', color: '#ef4444' }}>Sell</td>
                                    </tr>
                                    <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.5rem', color: '#22c55e' }}>Buy</td>
                                        <td style={{ padding: '0.5rem' }}>400</td>
                                        <td style={{ padding: '0.5rem' }}>₹500.00</td>
                                        <td style={{ padding: '0.5rem' }}></td>
                                        <td style={{ padding: '0.5rem' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem', color: '#22c55e' }}>Buy</td>
                                        <td style={{ padding: '0.5rem' }}>600</td>
                                        <td style={{ padding: '0.5rem' }}>₹499.80</td>
                                        <td style={{ padding: '0.5rem' }}></td>
                                        <td style={{ padding: '0.5rem' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem', color: '#22c55e' }}>Buy</td>
                                        <td style={{ padding: '0.5rem' }}>350</td>
                                        <td style={{ padding: '0.5rem' }}>₹499.50</td>
                                        <td style={{ padding: '0.5rem' }}></td>
                                        <td style={{ padding: '0.5rem' }}></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Matching Example:</strong></p>
                            <p>New market buy order for 250 shares arrives:</p>
                            <ul>
                                <li>Matches with 200 shares @ ₹500.10 (best ask)</li>
                                <li>Matches with 50 shares @ ₹500.30 (next best ask)</li>
                                <li>Order fully filled, LTP now = ₹500.30</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Price-Time Priority</h2>
                    </div>
                    <p>The fundamental rule of order matching: <strong>Best price wins, then earliest time wins.</strong></p>

                    <div className="glass-card">
                        <h3>How Priority Works</h3>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                            <h4>Example Scenario</h4>
                            <p><strong>Buy Orders in Queue:</strong></p>
                            <ul>
                                <li>Order A: 100 shares @ ₹500.00 (placed 9:15:00 AM)</li>
                                <li>Order B: 200 shares @ ₹500.50 (placed 9:15:05 AM)</li>
                                <li>Order C: 150 shares @ ₹500.00 (placed 9:15:10 AM)</li>
                                <li>Order D: 300 shares @ ₹500.50 (placed 9:15:03 AM)</li>
                            </ul>

                            <p style={{ marginTop: '1rem' }}><strong>Matching Priority:</strong></p>
                            <ol>
                                <li><strong>Order D</strong> (₹500.50, 9:15:03) - Best price, earliest at that price</li>
                                <li><strong>Order B</strong> (₹500.50, 9:15:05) - Best price, second earliest</li>
                                <li><strong>Order A</strong> (₹500.00, 9:15:00) - Second best price, earliest at that price</li>
                                <li><strong>Order C</strong> (₹500.00, 9:15:10) - Second best price, second earliest</li>
                            </ol>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Key Insight:</strong> In high-frequency trading, being 1 millisecond faster can mean the difference between getting filled or missing the trade entirely!</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Market Participants</h2>
                    </div>
                    <p>Different types of traders interact in the market, each with unique goals and strategies.</p>

                    <div className="glass-card darker">
                        <h3>The Four Main Types</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#3b82f6' }}>1. Retail Traders (You!)</h4>
                                <p><strong>Goal:</strong> Profit from price movements</p>
                                <p><strong>Timeframe:</strong> Minutes to months</p>
                                <p><strong>Strategy:</strong> Technical analysis, fundamental analysis, news trading</p>
                                <p><strong>Impact:</strong> Small individual orders, but collectively significant volume</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>2. Market Makers</h4>
                                <p><strong>Goal:</strong> Profit from bid-ask spread, provide liquidity</p>
                                <p><strong>Timeframe:</strong> Seconds to minutes</p>
                                <p><strong>Strategy:</strong> Continuously quote both buy and sell prices</p>
                                <p><strong>Impact:</strong> Tighten spreads, increase liquidity, reduce volatility</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Quote ₹500.00 bid / ₹500.10 ask, profit ₹0.10 per share on both sides</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#a855f7' }}>3. Institutional Investors</h4>
                                <p><strong>Goal:</strong> Execute large orders with minimal market impact</p>
                                <p><strong>Timeframe:</strong> Hours to days</p>
                                <p><strong>Strategy:</strong> Break large orders into smaller pieces, use VWAP algorithms</p>
                                <p><strong>Impact:</strong> Can move markets significantly if not careful</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Mutual fund buying 1 million shares over 3 days to avoid spiking price</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#fbbf24' }}>4. High-Frequency Traders (HFT)</h4>
                                <p><strong>Goal:</strong> Profit from tiny price discrepancies</p>
                                <p><strong>Timeframe:</strong> Microseconds to seconds</p>
                                <p><strong>Strategy:</strong> Arbitrage, market making, momentum ignition</p>
                                <p><strong>Impact:</strong> Provide liquidity but can amplify volatility</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Profit ₹0.01 per share, but trade 10 million shares per day</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Maker vs Taker Model</h2>
                    </div>
                    <p>Exchanges incentivize liquidity provision through different fee structures for makers and takers.</p>

                    <div className="glass-card">
                        <h3>Understanding the Model</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>Maker (Liquidity Provider)</h4>
                                <p><strong>Action:</strong> Places limit order that adds to order book</p>
                                <p><strong>Example:</strong> Place buy limit @ ₹500 when LTP is ₹505</p>
                                <p><strong>Benefit:</strong> Lower fees or even rebates</p>
                                <p><strong>Why:</strong> You're adding liquidity, making market more stable</p>
                                <p style={{ marginTop: '0.5rem', color: '#22c55e' }}><strong>Fee Example:</strong> 0.02% commission or even -0.01% (rebate!)</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ef4444' }}>Taker (Liquidity Consumer)</h4>
                                <p><strong>Action:</strong> Places market order that removes from order book</p>
                                <p><strong>Example:</strong> Market buy when LTP is ₹505</p>
                                <p><strong>Cost:</strong> Higher fees</p>
                                <p><strong>Why:</strong> You're consuming liquidity, reducing market depth</p>
                                <p style={{ marginTop: '0.5rem', color: '#ef4444' }}><strong>Fee Example:</strong> 0.03% commission</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Strategy Tip:</strong> For non-urgent trades, use limit orders to save on fees and potentially get better prices. Only use market orders when speed is critical.</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Information Asymmetry</h2>
                    </div>
                    <p>Not all traders have the same information. This creates an advantage for some and a disadvantage for others.</p>

                    <div className="glass-card darker">
                        <h3>Informed vs Noise Traders</h3>

                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#22c55e' }}>Informed Traders</h4>
                                <p><strong>Who:</strong> Analysts, insiders (legal), institutional researchers</p>
                                <p><strong>Advantage:</strong> Have private information or superior analysis</p>
                                <p><strong>Impact:</strong> Their orders move price permanently in their favor</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Analyst discovers company will beat earnings → Buys before announcement → Price rises permanently</p>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ef4444' }}>Noise Traders</h4>
                                <p><strong>Who:</strong> Emotional traders, liquidity traders, random traders</p>
                                <p><strong>Disadvantage:</strong> Trade without informational edge</p>
                                <p><strong>Impact:</strong> Their orders create volatility but no permanent price change</p>
                                <p style={{ marginTop: '0.5rem' }}><strong>Example:</strong> Panic selling during market dip → Price drops temporarily → Recovers when panic subsides</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                            <p><strong>⚠️ Adverse Selection:</strong> Market makers widen spreads when they detect informed trading to protect themselves. This is why spreads widen before major news announcements!</p>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Order Flow Toxicity</h2>
                    </div>
                    <p>Some order flow is "toxic" to market makers - it consistently predicts future price movements, making it dangerous to trade against.</p>

                    <div className="glass-card">
                        <h3>Toxic vs Non-Toxic Flow</h3>

                        <div style={{ marginTop: '1.5rem' }}>
                            <p><strong>Toxic Order Flow (Dangerous):</strong></p>
                            <ul>
                                <li>Large institutional orders</li>
                                <li>Orders from known smart money</li>
                                <li>Orders during earnings announcements</li>
                                <li>Sudden aggressive buying/selling</li>
                            </ul>
                            <p style={{ marginTop: '0.5rem', color: '#ef4444' }}><strong>Market Maker Response:</strong> Widen spreads, reduce size, or step away entirely</p>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <p><strong>Non-Toxic Order Flow (Safe):</strong></p>
                            <ul>
                                <li>Small retail orders</li>
                                <li>Passive limit orders</li>
                                <li>Orders during quiet periods</li>
                                <li>Random buying/selling</li>
                            </ul>
                            <p style={{ marginTop: '0.5rem', color: '#22c55e' }}><strong>Market Maker Response:</strong> Tight spreads, large size, active quoting</p>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>For Retail Traders:</strong> When you see spreads suddenly widen, it often means smart money is active. Be cautious about taking positions during these periods!</p>
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
                            <li>✅ <strong>Continuous Double Auction = modern exchange model</strong> - Buyers and sellers continuously interact</li>
                            <li>✅ <strong>Price-Time Priority rules matching</strong> - Best price first, then earliest time</li>
                            <li>✅ <strong>Four main participant types</strong> - Retail, market makers, institutions, HFT</li>
                            <li>✅ <strong>Makers add liquidity, takers remove it</strong> - Different fee structures incentivize liquidity</li>
                            <li>✅ <strong>Use limit orders to be a maker</strong> - Save on fees, potentially get better prices</li>
                            <li>✅ <strong>Informed traders have edge</strong> - Their orders predict future prices</li>
                            <li>✅ <strong>Noise traders create volatility</strong> - But no permanent price impact</li>
                            <li>✅ <strong>Toxic flow widens spreads</strong> - Smart money activity makes market makers cautious</li>
                            <li>✅ <strong>Spread widening = warning sign</strong> - Informed traders may be active</li>
                            <li>✅ <strong>HFT provides liquidity but amplifies moves</strong> - Can be friend or foe</li>
                            <li>✅ <strong>Understanding microstructure = better execution</strong> - Know how the game is played</li>
                            <li>✅ <strong>You're competing with professionals</strong> - Respect the complexity of modern markets</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>The Market is a Complex Ecosystem</h3>
                    <p>Understanding market microstructure helps you navigate the complexities of modern trading. You're not just trading against other retail traders - you're in a sophisticated ecosystem with market makers, institutions, and algorithms.</p>
                    <Link to="/education/trade-analytics" className="primary-btn">Master Trade Analytics</Link>
                </div>
            </div>
        </div>
    );
};

export default MarketMicrostructure;
