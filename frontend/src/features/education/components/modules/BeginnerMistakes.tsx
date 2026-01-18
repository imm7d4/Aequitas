import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const BeginnerMistakes: React.FC = () => {
    return (
        <div className="custom-module-page survival-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill danger">Survival Guide</div>
                    <h1>Common Beginner Mistakes & How to Avoid Them</h1>
                    <p className="hero-lead">Learn from others' expensive mistakes. These errors have cost traders millions. Understanding them will save you time, money, and emotional stress.</p>
                </div>
                <div className="hero-visual">
                    <div className="warning-shield-visual">
                        <div className="shield-core">!</div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>Trading Without a Stop Loss</h2>
                    </div>
                    <p>The #1 mistake that wipes out beginner accounts. Trading without a stop loss is like driving without brakes—you might be fine for a while, but eventually, disaster strikes.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Mistake</h3>
                        <p><strong>Scenario:</strong> You buy 100 shares of XYZ at ₹500, expecting it to go to ₹520. You don't set a stop loss because "you'll watch it closely."</p>
                        <p><strong>Reality:</strong> Unexpected news hits. Stock gaps down to ₹450. You're down ₹5,000 (10% loss) instantly.</p>
                        <p><strong>Psychology:</strong> You hold, hoping it will recover. It drops to ₹420. Now you're down ₹8,000 (16%). You panic sell at the bottom.</p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <p><strong>Always set a stop loss BEFORE entering the trade.</strong></p>
                        <p><strong>Example:</strong></p>
                        <ul>
                            <li>Buy: 100 shares at ₹500 = ₹50,000 investment</li>
                            <li>Stop Loss: ₹490 (2% risk)</li>
                            <li>Maximum Loss: ₹1,000 (controlled and acceptable)</li>
                            <li>Target: ₹520 (4% gain = ₹2,000 profit)</li>
                            <li><strong>Risk-Reward Ratio: 1:2 (risking ₹1,000 to make ₹2,000)</strong></li>
                        </ul>
                        <div className="info-box tip">
                            <strong>💡 Golden Rule:</strong> Never risk more than 1-2% of your total capital on a single trade.
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Overleveraging (Using Too Much Margin)</h2>
                    </div>
                    <p>Leverage amplifies both gains AND losses. Beginners often use maximum leverage on every trade, not realizing how quickly it can destroy their account.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Mistake</h3>
                        <p><strong>Scenario:</strong> You have ₹1,00,000 capital. You use 5x leverage to buy ₹5,00,000 worth of stock.</p>
                        <p><strong>The Math:</strong></p>
                        <ul>
                            <li>Stock drops 2%</li>
                            <li>Your loss: 2% × ₹5,00,000 = ₹10,000</li>
                            <li><strong>That's 10% of your total capital gone in one trade!</strong></li>
                        </ul>
                        <p><strong>Five such trades:</strong> 5 × 10% = 50% account loss. Your ₹1,00,000 is now ₹50,000.</p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <p><strong>Use leverage selectively, not on every trade.</strong></p>
                        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Leverage</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>2% Stock Move</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Account Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>1x (No leverage)</td>
                                    <td style={{ padding: '0.5rem' }}>₹2,000 loss</td>
                                    <td style={{ padding: '0.5rem' }}>2% loss</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>2x leverage</td>
                                    <td style={{ padding: '0.5rem' }}>₹4,000 loss</td>
                                    <td style={{ padding: '0.5rem' }}>4% loss</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>5x leverage</td>
                                    <td style={{ padding: '0.5rem' }}>₹10,000 loss</td>
                                    <td style={{ padding: '0.5rem' }}>10% loss ⚠️</td>
                                </tr>
                            </tbody>
                        </table>
                        <p style={{ marginTop: '1rem' }}><strong>Smart Approach:</strong> Use 1-2x leverage for most trades. Reserve 5x for high-conviction setups only.</p>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Revenge Trading (Emotional Trading)</h2>
                    </div>
                    <p>The most dangerous psychological mistake. After a loss, traders try to "win it back" by taking bigger, riskier trades.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Mistake</h3>
                        <p><strong>The Death Spiral:</strong></p>
                        <ul>
                            <li><strong>Trade 1:</strong> Lose ₹2,000 on a bad trade</li>
                            <li><strong>Emotion:</strong> Anger, frustration, need to recover</li>
                            <li><strong>Trade 2:</strong> Double position size to ₹4,000 risk (revenge trade)</li>
                            <li><strong>Result:</strong> Lose another ₹4,000 (total loss: ₹6,000)</li>
                            <li><strong>Trade 3:</strong> Desperation trade with ₹8,000 risk</li>
                            <li><strong>Result:</strong> Account blown up</li>
                        </ul>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <p><strong>The 3-Strike Rule:</strong></p>
                        <ul>
                            <li>After 2 consecutive losses, STOP trading for the day</li>
                            <li>Take a walk, clear your head, review your trades</li>
                            <li>Come back tomorrow with a fresh mindset</li>
                        </ul>
                        <div className="info-box tip">
                            <strong>💡 Professional Approach:</strong> Top traders accept that losses are part of the game. They focus on process, not individual trade outcomes.
                        </div>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Overtrading (Too Many Trades)</h2>
                    </div>
                    <p>More trades ≠ More profit. In fact, overtrading is one of the fastest ways to lose money through fees and poor decision-making.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Mistake</h3>
                        <p><strong>Scenario:</strong> You make 20 trades per day, each with ₹10,000 position size.</p>
                        <p><strong>The Hidden Cost:</strong></p>
                        <ul>
                            <li>20 trades × ₹10,000 = ₹2,00,000 total traded</li>
                            <li>Fee: 0.03% × ₹2,00,000 = ₹60 per day</li>
                            <li>Per month (20 trading days): ₹60 × 20 = ₹1,200 in fees</li>
                            <li><strong>Plus:</strong> Bid-ask spread costs, slippage, and poor trade quality</li>
                        </ul>
                        <p>You need to make ₹1,200+ just to break even on fees, before any profit!</p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <p><strong>Quality over Quantity:</strong></p>
                        <ul>
                            <li>Focus on 2-5 high-quality setups per day</li>
                            <li>Wait for your edge (patterns, levels, confirmations)</li>
                            <li>Each trade should have a clear reason and plan</li>
                        </ul>
                        <p><strong>Better Approach:</strong> 3 trades/day × ₹20,000 = ₹60,000 traded = ₹18 fees (70% reduction)</p>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Ignoring Slippage (Market Orders)</h2>
                    </div>
                    <p>The price you see is not always the price you get. Slippage is the difference between expected price and actual execution price.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Mistake</h3>
                        <p><strong>Scenario:</strong> Stock shows ₹500 on screen. You place a market order to buy 1,000 shares.</p>
                        <p><strong>What happens:</strong></p>
                        <ul>
                            <li>By the time your order reaches the exchange, price moved to ₹501</li>
                            <li>Not enough sellers at ₹501, some filled at ₹502</li>
                            <li><strong>Average fill price: ₹501.50</strong></li>
                            <li>Expected cost: ₹5,00,000</li>
                            <li>Actual cost: ₹5,01,500</li>
                            <li><strong>Slippage: ₹1,500 loss instantly!</strong></li>
                        </ul>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <p><strong>Use Limit Orders for better control:</strong></p>
                        <ul>
                            <li><strong>Limit Order at ₹500:</strong> You only buy if price is ₹500 or better</li>
                            <li><strong>Risk:</strong> Order might not fill if price moves away</li>
                            <li><strong>Benefit:</strong> No slippage, you control the price</li>
                        </ul>
                        <p><strong>When to use Market Orders:</strong> Only for highly liquid stocks (Reliance, TCS) where slippage is minimal (₹0.05-0.50).</p>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Chasing Pumps (FOMO Trading)</h2>
                    </div>
                    <p>Fear Of Missing Out (FOMO) causes traders to buy stocks that have already moved significantly, often at the worst possible time.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Mistake</h3>
                        <p><strong>Scenario:</strong> Stock was ₹100 yesterday. Today it's ₹120 (+20%) and still rising. You buy at ₹120 because "it's going to ₹150!"</p>
                        <p><strong>Reality:</strong> Early buyers take profit. Stock drops to ₹110. You're down ₹10 per share (8.3% loss).</p>
                        <p><strong>Psychology:</strong> You bought high due to excitement, not analysis.</p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <p><strong>Wait for pullbacks:</strong></p>
                        <ul>
                            <li>Stock pumps to ₹120, you wait</li>
                            <li>It pulls back to ₹115 (profit-taking)</li>
                            <li>You buy at ₹115 with better risk-reward</li>
                            <li>If it goes to ₹130, you make ₹15/share instead of ₹10/share</li>
                        </ul>
                        <div className="info-box tip">
                            <strong>💡 Remember:</strong> There's always another opportunity. Missing one trade is better than losing money on a bad entry.
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Holding Losers, Selling Winners</h2>
                    </div>
                    <p>The most common psychological trap: Cutting profits early while letting losses run, hoping they'll recover.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Mistake</h3>
                        <p><strong>Winning Trade:</strong> Buy at ₹100, stock goes to ₹103. You sell immediately for ₹300 profit (3% gain). "Lock in profits!"</p>
                        <p><strong>Losing Trade:</strong> Buy at ₹100, stock drops to ₹95. You hold, hoping it recovers. It drops to ₹90. You still hold. Finally sell at ₹85 for ₹1,500 loss (15% loss).</p>
                        <p><strong>Result:</strong> Small wins, big losses. Net result: Negative.</p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <p><strong>Let winners run, cut losers quickly:</strong></p>
                        <ul>
                            <li><strong>Winning Trade:</strong> Buy at ₹100, goes to ₹103. Hold with trailing stop at ₹102. Stock goes to ₹110. Sell at ₹108 (8% gain).</li>
                            <li><strong>Losing Trade:</strong> Buy at ₹100, stop loss at ₹98. Stock hits ₹98. Exit immediately for ₹200 loss (2% loss).</li>
                            <li><strong>Result:</strong> Big wins, small losses. Net result: Positive.</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Trading Without a Plan</h2>
                    </div>
                    <p>Entering trades without knowing your entry, exit, stop loss, and profit target is gambling, not trading.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Mistake</h3>
                        <p><strong>Scenario:</strong> You see a stock moving up. You buy it. No plan for when to sell or where to cut losses.</p>
                        <p><strong>Result:</strong> Stock goes up 2%, you hold hoping for more. It reverses, goes down 5%. You panic sell at the bottom.</p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <p><strong>Every trade needs a plan BEFORE you enter:</strong></p>
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p><strong>Example Trade Plan:</strong></p>
                            <ul>
                                <li><strong>Stock:</strong> Infosys</li>
                                <li><strong>Entry:</strong> ₹1,500 (at support level)</li>
                                <li><strong>Stop Loss:</strong> ₹1,480 (below support)</li>
                                <li><strong>Target:</strong> ₹1,560 (at resistance)</li>
                                <li><strong>Position Size:</strong> 100 shares (₹1,50,000)</li>
                                <li><strong>Risk:</strong> ₹20 × 100 = ₹2,000 (1.3% of ₹1,50,000 capital)</li>
                                <li><strong>Reward:</strong> ₹60 × 100 = ₹6,000</li>
                                <li><strong>Risk-Reward:</strong> 1:3</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">09</span>
                        <h2>Ignoring Position Sizing</h2>
                    </div>
                    <p>Risking too much on a single trade, regardless of your conviction, is a recipe for disaster.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Mistake</h3>
                        <p><strong>Scenario:</strong> You have ₹1,00,000. You're "very confident" in a trade, so you invest ₹50,000 (50% of capital).</p>
                        <p><strong>If you're wrong:</strong> 10% loss on trade = ₹5,000 loss = 5% of total capital gone in one trade.</p>
                        <p><strong>Two such mistakes:</strong> 10% of capital gone.</p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <p><strong>The 1-2% Rule:</strong> Never risk more than 1-2% of your total capital on a single trade.</p>
                        <p><strong>Example with ₹1,00,000 capital:</strong></p>
                        <ul>
                            <li>Maximum risk per trade: ₹2,000 (2%)</li>
                            <li>Stock entry: ₹500, Stop loss: ₹490 (₹10 risk per share)</li>
                            <li>Position size: ₹2,000 ÷ ₹10 = 200 shares</li>
                            <li>Total investment: 200 × ₹500 = ₹1,00,000 (can use margin if needed)</li>
                        </ul>
                        <p><strong>Result:</strong> Even if you're wrong, you only lose ₹2,000 (2%). You can survive 50 consecutive losses!</p>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">10</span>
                        <h2>Not Keeping a Trading Journal</h2>
                    </div>
                    <p>If you don't track your trades, you can't learn from your mistakes or replicate your successes.</p>

                    <div className="glass-card danger">
                        <h3>❌ The Mistake</h3>
                        <p>Trading for months without recording anything. You have no idea which strategies work, which stocks you're good at, or what mistakes you keep repeating.</p>
                    </div>

                    <div className="glass-card">
                        <h3>✅ The Solution</h3>
                        <p><strong>Keep a simple trading journal:</strong></p>
                        <p>For each trade, record:</p>
                        <ul>
                            <li><strong>Date & Time</strong></li>
                            <li><strong>Stock & Direction</strong> (Buy/Sell)</li>
                            <li><strong>Entry Price & Exit Price</strong></li>
                            <li><strong>Position Size</strong></li>
                            <li><strong>Reason for Entry</strong> (Setup, pattern, signal)</li>
                            <li><strong>Result</strong> (Profit/Loss in ₹ and %)</li>
                            <li><strong>Lessons Learned</strong> (What went right/wrong)</li>
                        </ul>
                        <p><strong>Review weekly:</strong> Identify patterns in your wins and losses. Double down on what works, eliminate what doesn't.</p>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">11</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Always use stop losses</strong> - Protect your capital, limit losses to 1-2% per trade</li>
                            <li>✅ <strong>Don't overlever age</strong> - Use 1-2x leverage normally, 5x only for high-conviction setups</li>
                            <li>✅ <strong>Avoid revenge trading</strong> - Stop after 2 losses, come back tomorrow fresh</li>
                            <li>✅ <strong>Quality over quantity</strong> - 2-5 good trades beat 20 mediocre ones</li>
                            <li>✅ <strong>Use limit orders</strong> - Control your price, avoid slippage</li>
                            <li>✅ <strong>Don't chase pumps</strong> - Wait for pullbacks, better entries</li>
                            <li>✅ <strong>Let winners run, cut losers</strong> - Opposite of natural instinct, but essential</li>
                            <li>✅ <strong>Plan every trade</strong> - Entry, exit, stop loss, position size BEFORE entering</li>
                            <li>✅ <strong>Position sizing matters</strong> - Risk only 1-2% per trade, survive to trade another day</li>
                            <li>✅ <strong>Keep a journal</strong> - Learn from mistakes, replicate successes</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master Order Types Next</h3>
                    <p>Now that you know what NOT to do, learn how to use different order types effectively to execute your trading strategies.</p>
                    <Link to="/education/order-types" className="primary-btn">Learn Order Types</Link>
                </div>
            </div>
        </div>
    );
};

export default BeginnerMistakes;
