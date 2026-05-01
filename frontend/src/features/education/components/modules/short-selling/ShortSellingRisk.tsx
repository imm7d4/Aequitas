import React from 'react';

const ShortSellingRisk: React.FC = () => {
    return (
        <div className="tab-pane animate-in">
            <section className="guide-section">
                <h2>Understanding Unlimited Loss Potential</h2>
                <p className="large-text">The most critical concept in short selling: <strong>your maximum loss is theoretically unlimited</strong>.</p>

                <div className="glass-card caution">
                    <h3>Long vs Short: Asymmetric Risk</h3>
                    <div className="comparison-grid">
                        <div className="comparison-col">
                            <h4>Long Position (Buying Stock)</h4>
                            <div className="risk-visual long">
                                <div className="risk-bar">
                                    <div className="max-loss">Max Loss: 100%</div>
                                    <div className="max-gain">Max Gain: Unlimited</div>
                                </div>
                            </div>
                            <p><strong>Worst Case:</strong> Stock goes to ₹0 → You lose your entire investment</p>
                            <p><strong>Best Case:</strong> Stock rises indefinitely → Unlimited profit potential</p>
                            <p className="risk-note">Risk-Reward: <span className="success-text">Favorable</span> (limited downside, unlimited upside)</p>
                        </div>

                        <div className="comparison-col danger">
                            <h4>Short Position (Selling Stock)</h4>
                            <div className="risk-visual short">
                                <div className="risk-bar">
                                    <div className="max-gain">Max Gain: 100%</div>
                                    <div className="max-loss">Max Loss: Unlimited</div>
                                </div>
                            </div>
                            <p><strong>Best Case:</strong> Stock goes to ₹0 → You profit 100% of position value</p>
                            <p><strong>Worst Case:</strong> Stock rises indefinitely → Unlimited loss potential</p>
                            <p className="risk-note">Risk-Reward: <span className="danger-text">Unfavorable</span> (limited upside, unlimited downside)</p>
                        </div>
                    </div>

                    <div className="info-box danger">
                        <strong>Example of Unlimited Loss:</strong><br />
                        Short 100 shares @ ₹500 (₹50,000 position, ₹10,000 margin)<br />
                        If stock rises to ₹1,000: Loss = ₹50,000 (500% of margin)<br />
                        If stock rises to ₹2,000: Loss = ₹1,50,000 (1,500% of margin)<br />
                        If stock rises to ₹5,000: Loss = ₹4,50,000 (4,500% of margin)<br />
                        <strong>There is no ceiling to your potential loss!</strong>
                    </div>
                </div>

                <div className="example-box danger">
                    <h3>The Short Squeeze: When Shorts Get Trapped</h3>
                    <p>A short squeeze occurs when a heavily shorted stock starts rising, forcing shorts to cover (buy back), which pushes the price even higher, creating a vicious cycle.</p>

                    <div className="scenario-timeline">
                        <div className="timeline-step">
                            <div className="step-label">Initial State</div>
                            <div className="step-content">
                                <p>Stock XYZ trading at ₹200</p>
                                <p>Many traders (including you) have shorted it, expecting it to fall</p>
                                <p>Your position: SHORT 500 shares @ ₹200 (Margin: ₹20,000)</p>
                            </div>
                        </div>

                        <div className="timeline-step warning">
                            <div className="step-label">Trigger Event</div>
                            <div className="step-content">
                                <p>Unexpected positive news announced!</p>
                                <p>Stock jumps to ₹250 in minutes</p>
                                <p>Your loss: (₹200 - ₹250) × 500 = -₹25,000</p>
                                <p className="warning-text">Loss already exceeds your margin!</p>
                            </div>
                        </div>

                        <div className="timeline-step danger">
                            <div className="step-label">The Squeeze Begins</div>
                            <div className="step-content">
                                <p>Panicked shorts start covering (buying to close positions)</p>
                                <p>This buying pressure pushes price to ₹300</p>
                                <p>Your loss: -₹50,000 (250% of margin)</p>
                                <p>More shorts get margin calls → More forced buying</p>
                            </div>
                        </div>

                        <div className="timeline-step danger">
                            <div className="step-label">Peak Squeeze</div>
                            <div className="step-content">
                                <p>Stock hits ₹400 (100% gain from your entry!)</p>
                                <p>Your loss: (₹200 - ₹400) × 500 = -₹1,00,000</p>
                                <p className="loss-highlight">You've lost ₹1,00,000 on a ₹20,000 margin position!</p>
                                <p>This is a 500% loss on your margin</p>
                            </div>
                        </div>
                    </div>

                    <div className="lesson-box">
                        <h4>How to Avoid Short Squeezes</h4>
                        <ul>
                            <li><strong>Check Short Interest:</strong> Avoid stocks with very high short interest (&gt;20% of float)</li>
                            <li><strong>Use Stop-Losses:</strong> Always set stop-loss orders (typically 5-8% above entry for shorts)</li>
                            <li><strong>Position Sizing:</strong> Never risk more than 2-3% of your capital on a single short</li>
                            <li><strong>Monitor News:</strong> Be aware of upcoming catalysts (earnings, product launches, regulatory decisions)</li>
                            <li><strong>Avoid Meme Stocks:</strong> Stocks with cult followings can squeeze violently regardless of fundamentals</li>
                        </ul>
                    </div>
                </div>

                <div className="glass-card darker">
                    <h3>The Aequitas "No Hedge" Constraint</h3>
                    <p>To ensure portfolio integrity, Aequitas prevents users from holding opposing views simultaneously. This is enforced in <code>OrderService.go</code>.</p>

                    <div className="real-vs-fake-grid">
                        <div className="check-item fake">
                            <h4>❌ Scenario: Active Long Position</h4>
                            <p>If you own 100 Reliance shares (LONG position), the 'Short' button will be disabled in the TradePanel.</p>
                            <p><strong>Why?</strong> You must sell your long position before opening a short view. This prevents confusing hedge positions and ensures clean accounting.</p>
                        </div>
                        <div className="check-item fake">
                            <h4>❌ Scenario: Active Short Position</h4>
                            <p>If you are short 100 shares, you cannot buy 200 shares to 'flip' to long.</p>
                            <p><strong>Why?</strong> You must cover the 100 short shares first, then open a fresh long position. This maintains clear position tracking.</p>
                        </div>
                    </div>

                    <div className="info-box tip">
                        <strong>Real-World Context:</strong> Professional traders do use hedging strategies (e.g., long-short pairs), but these require sophisticated risk management. For educational purposes, Aequitas enforces directional clarity.
                    </div>
                </div>

                <div className="example-box">
                    <h3>Risk Mitigation Strategies for Short Selling</h3>

                    <div className="strategy-grid">
                        <div className="strategy-card">
                            <div className="strategy-num">1</div>
                            <h4>Always Use Stop-Losses</h4>
                            <p><strong>Rule:</strong> Set stop-loss 5-8% above entry price</p>
                            <p><strong>Example:</strong> Short @ ₹500 → Stop-loss @ ₹540 (8% above)</p>
                            <p><strong>Why Tighter?</strong> Shorts have unlimited downside, so you need tighter stops than long positions (which typically use 10-15%)</p>
                            <div className="info-box tip">
                                Use STOP or TRAILING_STOP orders in Aequitas to automate this protection
                            </div>
                        </div>

                        <div className="strategy-card">
                            <div className="strategy-num">2</div>
                            <h4>Position Sizing</h4>
                            <p><strong>Rule:</strong> Never allocate more than 20% of capital to short positions</p>
                            <p><strong>Example:</strong> ₹1,00,000 account → Max ₹20,000 in short margin</p>
                            <p><strong>Why?</strong> Shorts are higher risk than longs. Limit exposure to prevent account wipeout</p>
                        </div>

                        <div className="strategy-card">
                            <div className="strategy-num">3</div>
                            <h4>Time Your Entries</h4>
                            <p><strong>Best Times to Short:</strong></p>
                            <ul>
                                <li>After strong uptrend showing exhaustion (RSI &gt; 70)</li>
                                <li>Breaking below key support levels</li>
                                <li>Negative earnings surprises</li>
                                <li>Sector-wide downtrends</li>
                            </ul>
                        </div>

                        <div className="strategy-card">
                            <div className="strategy-num">4</div>
                            <h4>Monitor Margin Closely</h4>
                            <p><strong>Action Plan:</strong></p>
                            <ul>
                                <li>Check margin ratio daily (in Portfolio page)</li>
                                <li>If ratio &lt; 1.5: Consider adding funds or reducing position</li>
                                <li>If ratio &lt; 1.0: Immediate action required (WARNING)</li>
                                <li>If ratio &lt; 0.5: Critical risk (CRITICAL)</li>
                            </ul>
                        </div>

                        <div className="strategy-card">
                            <div className="strategy-num">5</div>
                            <h4>Take Profits Systematically</h4>
                            <p><strong>Strategy:</strong> Use partial covers to lock in gains</p>
                            <ul>
                                <li>Cover 1/3 at 5% profit</li>
                                <li>Cover 1/3 at 10% profit</li>
                                <li>Let final 1/3 run with trailing stop</li>
                            </ul>
                        </div>

                        <div className="strategy-card">
                            <div className="strategy-num">6</div>
                            <h4>Avoid Overnight Risk</h4>
                            <p><strong>Rule:</strong> Consider closing shorts before major events</p>
                            <ul>
                                <li>Earnings announcements</li>
                                <li>RBI policy meetings</li>
                                <li>Budget announcements</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="glass-card">
                    <h3>Regulatory & Practical Constraints</h3>
                    <div className="constraint-list">
                        <div className="constraint-item">
                            <h4>📋 Stock Lending & Borrowing (SLB)</h4>
                            <p>In real markets, you can only short if your broker can borrow shares from their SLB pool.</p>
                        </div>
                        <div className="constraint-item">
                            <h4>💰 Borrowing Costs</h4>
                            <p>Real short positions incur daily borrowing fees (typically 0.01-0.05% per day).</p>
                        </div>
                        <div className="constraint-item">
                            <h4>🛑 Short Selling Bans</h4>
                            <p>SEBI can temporarily ban short selling during extreme market volatility.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShortSellingRisk;
