import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const OrderTypes: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'market' | 'limit' | 'stop' | 'calculator'>('market');

    // Calculator state
    const [calcQuantity, setCalcQuantity] = useState(100);
    const [calcPrice, setCalcPrice] = useState(500);
    const [calcOrderType, setCalcOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');

    const calculateOrderCost = () => {
        const baseValue = calcQuantity * calcPrice;
        const buffer = calcOrderType === 'MARKET' ? baseValue * 0.01 : 0;
        const commission = Math.min(baseValue * 0.0003, 20); // 0.03% or ₹20 cap
        const total = baseValue + buffer + commission;

        return {
            baseValue,
            buffer,
            commission,
            total
        };
    };

    const costs = calculateOrderCost();

    return (
        <div className="custom-module-page order-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill success">Core Execution</div>
                    <h1>Order Types & Logic</h1>
                    <p className="hero-lead">An order is an instruction to the matching engine. Choosing the wrong type is like using a hammer when you need a scalpel—you'll pay more and get less precision.</p>
                </div>
                <div className="hero-visual">
                    <div className="order-stack-visual">
                        <div className="layer market">M</div>
                        <div className="layer limit">L</div>
                        <div className="layer stop">S</div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <div className="density-tabs">
                    <button className={activeTab === 'market' ? 'active' : ''} onClick={() => setActiveTab('market')}>Market Orders</button>
                    <button className={activeTab === 'limit' ? 'active' : ''} onClick={() => setActiveTab('limit')}>Limit Orders</button>
                    <button className={activeTab === 'stop' ? 'active' : ''} onClick={() => setActiveTab('stop')}>Stop Orders</button>
                    <button className={activeTab === 'calculator' ? 'active' : ''} onClick={() => setActiveTab('calculator')}>Cost Calculator</button>
                </div>

                {activeTab === 'market' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>The Aggressive Entry (Liquidity Taker)</h2>
                            <p className="large-text">A Market order says: <strong>"I don't care about the price, I want execution RIGHT NOW."</strong></p>

                            <div className="property-grid">
                                <div className="prop-card">
                                    <h4>Priority</h4>
                                    <p>Highest. You skip the queue in the order book. Your trade is matched instantly with the best available price.</p>
                                </div>
                                <div className="prop-card warning">
                                    <h4>Pricing</h4>
                                    <p>Variable. You get the best available price (LTP). Aequitas applies a <strong>1% Margin Buffer</strong> to ensure you have enough funds if the price moves during execution.</p>
                                </div>
                                <div className="prop-card">
                                    <h4>Impact</h4>
                                    <p>You are a "Liquidity Taker". Large market orders can move the price against you as you 'eat through' the order book.</p>
                                </div>
                            </div>
                        </section>

                        <div className="example-box">
                            <h3>Real-World Scenario: The Slippage Trap</h3>
                            <div className="scenario-timeline">
                                <div className="timeline-step">
                                    <div className="step-label">T = 0.0s</div>
                                    <div className="step-content">
                                        <p><strong>You see:</strong> TCS trading at ₹3,500</p>
                                        <p>You decide to buy 1,000 shares using a Market Order</p>
                                    </div>
                                </div>
                                <div className="timeline-step">
                                    <div className="step-label">T = 0.1s</div>
                                    <div className="step-content">
                                        <p><strong>Expected Cost:</strong> 1,000 × ₹3,500 = ₹35,00,000</p>
                                        <p><strong>System Buffer (1%):</strong> ₹35,00,000 × 1.01 = ₹35,35,000</p>
                                        <div className="info-box tip">
                                            This buffer ensures you have enough funds even if price moves slightly
                                        </div>
                                    </div>
                                </div>
                                <div className="timeline-step warning">
                                    <div className="step-label">T = 0.3s</div>
                                    <div className="step-content">
                                        <p><strong>Market moves!</strong> Large institutional buy order hits</p>
                                        <p>New LTP: ₹3,512</p>
                                    </div>
                                </div>
                                <div className="timeline-step danger">
                                    <div className="step-label">T = 0.5s</div>
                                    <div className="step-content">
                                        <p><strong>Your order fills at:</strong> ₹3,512</p>
                                        <p><strong>Actual Cost:</strong> 1,000 × ₹3,512 = ₹35,12,000</p>
                                        <p className="loss-highlight"><strong>Slippage Cost:</strong> ₹12,000 extra paid! (0.34% slippage)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="lesson-box">
                                <h4>📚 Key Lessons</h4>
                                <ul>
                                    <li><strong>In volatile markets:</strong> Market orders can cost significantly more than expected</li>
                                    <li><strong>For large quantities:</strong> You may "walk up the order book" getting progressively worse prices</li>
                                    <li><strong>Best use case:</strong> When speed matters more than price (e.g., stop-loss execution, breaking news)</li>
                                    <li><strong>Avoid when:</strong> Trading illiquid stocks or during market open/close when spreads widen</li>
                                </ul>
                            </div>
                        </div>

                        <div className="glass-card caution">
                            <h3>⚠️ The Flash Crash Risk</h3>
                            <p>During extreme volatility (like the 2010 Flash Crash), market orders can execute at prices far from the last traded price. In fast-moving markets:</p>
                            <ul>
                                <li>Bid-ask spreads widen dramatically</li>
                                <li>Order book depth evaporates</li>
                                <li>Your market order might fill 5-10% away from LTP</li>
                            </ul>
                            <p><strong>Protection:</strong> Aequitas's 1% buffer provides some protection, but in extreme cases, consider using limit orders with a price ceiling.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'limit' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>The Patient Execution (Liquidity Maker)</h2>
                            <p className="large-text">A Limit order says: <strong>"I will only buy/sell if the price reaches X or better."</strong></p>

                            <div className="formula-block">
                                <h3>Price Improvement Rule</h3>
                                <p className="math">If Limit Price ≥ Market Price (for BUY)</p>
                                <p className="math">Then Fill Price = Market Price (better execution)</p>
                                <p>If you set a Limit Buy @ ₹100, but the market price (LTP) is ₹98, Aequitas will fill you at ₹98. This is the <strong>Best Execution Guarantee</strong> - you always get the best available price or better.</p>
                            </div>

                            <div className="example-box">
                                <h3>Scenario 1: The Patient Trader (Successful Fill)</h3>
                                <div className="scenario-grid">
                                    <div className="scenario-col">
                                        <h4>Setup</h4>
                                        <p>Stock: Reliance</p>
                                        <p>Current LTP: ₹2,450</p>
                                        <p>Your Analysis: Stock is overbought, likely to dip to ₹2,420</p>
                                    </div>
                                    <div className="scenario-col">
                                        <h4>Action</h4>
                                        <p>Place Limit Buy Order:</p>
                                        <p>Quantity: 50 shares</p>
                                        <p>Limit Price: ₹2,420</p>
                                        <p>Validity: DAY</p>
                                    </div>
                                </div>

                                <div className="timeline-walkthrough">
                                    <div className="tw-step">
                                        <div className="step-indicator"></div>
                                        <strong>10:30 AM</strong>
                                        <p>Order placed. Status: <span className="status-badge pending">PENDING</span></p>
                                        <p>Your order sits in the order queue, waiting for price to touch ₹2,420</p>
                                    </div>
                                    <div className="tw-step">
                                        <div className="step-indicator"></div>
                                        <strong>11:45 AM</strong>
                                        <p>Market dips! LTP touches ₹2,418</p>
                                        <p>Your order triggers and fills at ₹2,418 (better than your limit!)</p>
                                    </div>
                                    <div className="tw-step">
                                        <div className="step-indicator confirm"></div>
                                        <strong>Result</strong>
                                        <p>Status: <span className="status-badge filled">FILLED</span></p>
                                        <p>Savings: ₹32 per share × 50 = ₹1,600 saved vs buying at ₹2,450</p>
                                        <p>Plus: Got price improvement (₹2,418 instead of ₹2,420)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="example-box warning">
                                <h3>Scenario 2: The Missed Opportunity (No Fill)</h3>
                                <div className="scenario-timeline">
                                    <div className="timeline-step">
                                        <div className="step-label">Setup</div>
                                        <div className="step-content">
                                            <p>Stock: Infosys at ₹1,500</p>
                                            <p>You place Limit Buy @ ₹1,490 for 100 shares</p>
                                        </div>
                                    </div>
                                    <div className="timeline-step">
                                        <div className="step-label">Market Movement</div>
                                        <div className="step-content">
                                            <p>Stock dips to ₹1,492... then bounces back</p>
                                            <p>Your ₹1,490 limit was <strong>₹2 away</strong> from execution</p>
                                        </div>
                                    </div>
                                    <div className="timeline-step danger">
                                        <div className="step-label">Outcome</div>
                                        <div className="step-content">
                                            <p>End of day: Stock closes at ₹1,520</p>
                                            <p>Your order: <span className="status-badge cancelled">CANCELLED</span> (DAY validity expired)</p>
                                            <p className="loss-highlight">Opportunity cost: ₹30 per share × 100 = ₹3,000 potential profit missed</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="lesson-box">
                                    <h4>Why didn't it fill at ₹1,492?</h4>
                                    <p>Your limit was ₹1,490. The matching engine will <strong>only</strong> fill if:</p>
                                    <ul>
                                        <li>LTP reaches ₹1,490 or lower (for BUY orders)</li>
                                        <li>There's sufficient liquidity at that price</li>
                                        <li>Your order is at the front of the queue (time priority)</li>
                                    </ul>
                                    <p><strong>Lesson:</strong> Being too aggressive with limit prices can mean missing the trade entirely. Balance between getting a good price and getting filled.</p>
                                </div>
                            </div>

                            <div className="architecture-diagram-custom">
                                <h3>The Queue System</h3>
                                <div className="queue-visual">
                                    <div className="service-node">
                                        <h4>Order Placement</h4>
                                        <p>Your limit order enters the order queue</p>
                                        <p>Status: <span className="status-badge pending">PENDING</span></p>
                                    </div>
                                    <div className="connector">→</div>
                                    <div className="service-node">
                                        <h4>Price-Time Priority</h4>
                                        <p><strong>Price:</strong> Better prices get priority</p>
                                        <p><strong>Time:</strong> Earlier orders at same price go first</p>
                                    </div>
                                    <div className="connector">→</div>
                                    <div className="service-node hotspot">
                                        <h4>Matching Engine (3-sec cycle)</h4>
                                        <p>Polls every 3 seconds</p>
                                        <p>Checks if LTP meets your limit</p>
                                        <p>Executes if conditions met</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card darker">
                                <h3>Validity: IOC vs DAY vs GTC</h3>
                                <div className="validity-comparison">
                                    <div className="validity-card">
                                        <h4>IOC (Immediate or Cancel)</h4>
                                        <p><strong>Lifespan:</strong> Single 3-second matching cycle</p>
                                        <p><strong>Behavior:</strong> If not matched immediately, auto-cancels</p>
                                        <p><strong>Use case:</strong> "Fill at this price right now, or forget it"</p>
                                        <div className="info-box tip">
                                            Best for: Quick scalping, testing liquidity at a price point
                                        </div>
                                    </div>
                                    <div className="validity-card">
                                        <h4>DAY</h4>
                                        <p><strong>Lifespan:</strong> Until market close (3:30 PM)</p>
                                        <p><strong>Behavior:</strong> Stays active all day, cancels at EOD</p>
                                        <p><strong>Use case:</strong> "I want this price today"</p>
                                        <div className="info-box tip">
                                            Best for: Intraday traders, swing entries
                                        </div>
                                    </div>
                                    <div className="validity-card">
                                        <h4>GTC (Good Till Cancelled)</h4>
                                        <p><strong>Lifespan:</strong> Until you manually cancel</p>
                                        <p><strong>Behavior:</strong> Persists across days</p>
                                        <p><strong>Use case:</strong> "I'll wait weeks for this price"</p>
                                        <div className="info-box warning">
                                            ⚠️ Not available for Market orders (they execute instantly)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="example-box">
                                <h3>Scenario 3: Partial Fill</h3>
                                <p>You place a Limit Buy for 1,000 shares @ ₹800</p>
                                <p>At that price level, only 600 shares are available</p>

                                <div className="partial-fill-visual">
                                    <div className="fill-bar">
                                        <div className="filled" style={{ width: '60%' }}>600 Filled</div>
                                        <div className="pending" style={{ width: '40%' }}>400 Pending</div>
                                    </div>
                                </div>

                                <p><strong>What happens next?</strong></p>
                                <ul>
                                    <li>600 shares execute immediately at ₹800</li>
                                    <li>Remaining 400 shares stay in queue as <span className="status-badge pending">PENDING</span></li>
                                    <li>Will fill when more sellers arrive at ₹800 or lower</li>
                                    <li>If validity expires (DAY/IOC), remaining 400 auto-cancel</li>
                                </ul>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'stop' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>The Conditional Trigger (Sentinel Mode)</h2>
                            <p className="large-text">Stop orders are "dormant sentinels" that activate only when a specific price trigger is hit. They protect your positions and automate your strategy.</p>

                            <div className="glass-card darker">
                                <h3>How Stop Orders Work in Aequitas</h3>
                                <p>Stop orders sit in <strong>PENDING</strong> state, monitored continuously by the platform (checked every 3 seconds).</p>
                                <p>When triggered, they automatically convert to a Market or Limit order that executes immediately.</p>

                                <div className="info-box tip">
                                    <strong>Critical Feature: Intent Preservation</strong><br />
                                    When a stop triggers, the platform preserves your original intent (e.g., closing a short position). This ensures stop-losses work correctly and don't create unintentional new positions.
                                </div>
                            </div>

                            <h2>Type 1: STOP (Stop-Loss / Stop-Market)</h2>
                            <div className="example-box">
                                <h3>Classic Use Case: Protecting a Long Position</h3>
                                <div className="scenario-timeline">
                                    <div className="timeline-step">
                                        <div className="step-label">Day 1</div>
                                        <div className="step-content">
                                            <p>You buy 200 shares of HDFC Bank @ ₹1,600</p>
                                            <p>Investment: ₹3,20,000</p>
                                        </div>
                                    </div>
                                    <div className="timeline-step">
                                        <div className="step-label">Immediately After</div>
                                        <div className="step-content">
                                            <p>You place a <strong>STOP order</strong>:</p>
                                            <p>Type: STOP (Market)</p>
                                            <p>Side: SELL</p>
                                            <p>Stop Price: ₹1,520 (5% below entry)</p>
                                            <p>Quantity: 200</p>
                                            <div className="info-box tip">
                                                This order sits dormant, monitoring the price every 3 seconds
                                            </div>
                                        </div>
                                    </div>
                                    <div className="timeline-step warning">
                                        <div className="step-label">Day 3</div>
                                        <div className="step-content">
                                            <p>Bad news! RBI raises rates unexpectedly</p>
                                            <p>HDFC Bank drops to ₹1,518</p>
                                            <p><strong>Trigger Condition Met:</strong> LTP (₹1,518) ≤ Stop Price (₹1,520)</p>
                                        </div>
                                    </div>
                                    <div className="timeline-step confirm">
                                        <div className="step-label">Execution</div>
                                        <div className="step-content">
                                            <p>Stop order status: <span className="status-badge triggered">TRIGGERED</span></p>
                                            <p>Child Market Order created: SELL 200 @ Market</p>
                                            <p>Fills at: ₹1,515 (current LTP)</p>
                                            <p><strong>Result:</strong> Loss limited to ₹17,000 instead of potential ₹50,000+ if stock continued falling</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h2>Type 2: STOP_LIMIT (Stop-Limit)</h2>
                            <div className="example-box">
                                <h3>The Precision Tool: Control Both Trigger and Execution</h3>
                                <p>A STOP_LIMIT order has TWO prices:</p>
                                <ul>
                                    <li><strong>Stop Price:</strong> When to activate</li>
                                    <li><strong>Limit Price:</strong> Maximum/minimum price to accept</li>
                                </ul>

                                <div className="scenario-grid">
                                    <div className="scenario-col">
                                        <h4>STOP (Market) Order</h4>
                                        <p>Stop Price: ₹1,520</p>
                                        <p>When triggered → Sells at ANY price</p>
                                        <p className="danger-text">Risk: Might fill at ₹1,480 in fast market</p>
                                    </div>
                                    <div className="scenario-col">
                                        <h4>STOP_LIMIT Order</h4>
                                        <p>Stop Price: ₹1,520</p>
                                        <p>Limit Price: ₹1,510</p>
                                        <p className="success-text">Protection: Won't sell below ₹1,510</p>
                                        <p className="warning-text">Trade-off: Might not fill if price gaps down</p>
                                    </div>
                                </div>

                                <div className="timeline-walkthrough">
                                    <div className="tw-step">
                                        <div className="step-indicator"></div>
                                        <strong>Setup</strong>
                                        <p>You own 100 TCS @ ₹3,500</p>
                                        <p>Place STOP_LIMIT: Stop ₹3,400 / Limit ₹3,380</p>
                                    </div>
                                    <div className="tw-step">
                                        <div className="step-indicator trigger"></div>
                                        <strong>Trigger</strong>
                                        <p>Price drops to ₹3,395</p>
                                        <p>Stop activates, creates Limit Sell @ ₹3,380</p>
                                    </div>
                                    <div className="tw-step">
                                        <div className="step-indicator confirm"></div>
                                        <strong>Execution</strong>
                                        <p>If LTP ≥ ₹3,380: Order fills</p>
                                        <p>If LTP &lt; ₹3,380: Order stays pending (might not fill)</p>
                                    </div>
                                </div>

                                <div className="lesson-box">
                                    <h4>When to use STOP_LIMIT vs STOP?</h4>
                                    <ul>
                                        <li><strong>Use STOP (Market):</strong> When execution certainty matters more than price (e.g., cutting losses quickly)</li>
                                        <li><strong>Use STOP_LIMIT:</strong> When you want price protection and can tolerate non-execution (e.g., taking profits)</li>
                                    </ul>
                                </div>
                            </div>

                            <h2>Type 3: TRAILING_STOP (Trailing Stop)</h2>
                            <div className="example-box">
                                <h3>The Dynamic Protector: Locks in Profits Automatically</h3>
                                <p>A trailing stop <strong>moves with the price</strong> in your favor, but never moves against you. It's like a ratchet that only tightens.</p>

                                <div className="formula-block">
                                    <h3>Trailing Stop Logic</h3>
                                    <p className="math">For SELL (protecting long position):</p>
                                    <p className="math">Stop Price = Highest Price Seen - Trail Amount</p>
                                    <p className="math">Updates only when new high is reached</p>
                                </div>

                                <div className="scenario-timeline">
                                    <div className="timeline-step">
                                        <div className="step-label">Entry</div>
                                        <div className="step-content">
                                            <p>Buy 50 Reliance @ ₹2,400</p>
                                            <p>Place TRAILING_STOP:</p>
                                            <p>Trail Amount: ₹50</p>
                                            <p>Initial Stop: ₹2,400 - ₹50 = ₹2,350</p>
                                        </div>
                                    </div>
                                    <div className="timeline-step">
                                        <div className="step-label">Price Rises to ₹2,480</div>
                                        <div className="step-content">
                                            <p><strong>New High!</strong> Stop auto-adjusts:</p>
                                            <p>Stop Price = ₹2,480 - ₹50 = ₹2,430</p>
                                            <p className="success-text">You've now locked in ₹30/share profit minimum!</p>
                                        </div>
                                    </div>
                                    <div className="timeline-step">
                                        <div className="step-label">Price Rises to ₹2,550</div>
                                        <div className="step-content">
                                            <p><strong>Another High!</strong> Stop adjusts again:</p>
                                            <p>Stop Price = ₹2,550 - ₹50 = ₹2,500</p>
                                            <p className="success-text">Locked profit: ₹100/share = ₹5,000 total</p>
                                        </div>
                                    </div>
                                    <div className="timeline-step">
                                        <div className="step-label">Price Dips to ₹2,520</div>
                                        <div className="step-content">
                                            <p>Stop Price remains at ₹2,500 (doesn't move down!)</p>
                                            <p>Still safe, position open</p>
                                        </div>
                                    </div>
                                    <div className="timeline-step warning">
                                        <div className="step-label">Price Drops to ₹2,495</div>
                                        <div className="step-content">
                                            <p><strong>Trigger!</strong> LTP (₹2,495) &lt; Stop (₹2,500)</p>
                                            <p>Trailing stop activates, sells at market</p>
                                            <p>Exit Price: ~₹2,495</p>
                                            <p className="success-text"><strong>Final Profit:</strong> ₹95/share × 50 = ₹4,750</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="trailing-visual">
                                    <h4>Visual: How Trailing Stop Follows Price</h4>
                                    <div className="price-chart-simple">
                                        <div className="price-line"></div>
                                        <div className="trail-line"></div>
                                        <div className="trail-labels">
                                            <span>Price Movement</span>
                                            <span>Trailing Stop (₹50 below)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="lesson-box">
                                    <h4>Trailing Stop Best Practices</h4>
                                    <ul>
                                        <li><strong>Trail Amount:</strong> Too tight (₹10) = premature exit. Too loose (₹200) = gives back too much profit</li>
                                        <li><strong>Sweet Spot:</strong> 2-4% for swing trades, 1-2% for day trades</li>
                                        <li><strong>Volatility Matters:</strong> Use wider trails for volatile stocks (e.g., small-caps)</li>
                                        <li><strong>Trending Markets:</strong> Trailing stops shine in strong trends, can whipsaw in choppy markets</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="glass-card caution">
                                <h3>⚠️ The Gap Risk Problem</h3>
                                <p>All stop orders have a critical weakness: <strong>overnight gaps</strong>.</p>

                                <div className="scenario-grid">
                                    <div className="scenario-col danger">
                                        <h4>The Nightmare Scenario</h4>
                                        <p>You own 100 shares @ ₹1,000</p>
                                        <p>Stop-loss set at ₹950</p>
                                        <p><strong>Overnight:</strong> Company announces fraud</p>
                                        <p>Stock opens at ₹600 (40% gap down)</p>
                                        <p>Your stop triggers at ₹600, not ₹950</p>
                                        <p className="loss-highlight">Loss: ₹40,000 instead of expected ₹5,000</p>
                                    </div>
                                    <div className="scenario-col">
                                        <h4>Why This Happens</h4>
                                        <p>Stop orders trigger when price <em>reaches</em> the stop level</p>
                                        <p>If price "gaps" past your stop, it triggers at the new price</p>
                                        <p>No protection against overnight news, earnings surprises, or circuit breakers</p>
                                    </div>
                                </div>

                                <div className="info-box warning">
                                    <strong>Mitigation Strategies:</strong>
                                    <ul>
                                        <li>Avoid holding risky positions overnight (especially before earnings)</li>
                                        <li>Use smaller position sizes to limit gap risk exposure</li>
                                        <li>Consider options for defined-risk strategies (not available in Aequitas yet)</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="stop-types-grid">
                                <div className="stop-card sell">
                                    <h4>Sell Stop (Stop Loss)</h4>
                                    <p><strong>Trigger:</strong> LTP ≤ Stop Price</p>
                                    <p><strong>Use:</strong> Protect long positions from downside</p>
                                    <p><strong>Example:</strong> Own stock @ ₹500, set stop @ ₹475</p>
                                </div>
                                <div className="stop-card buy">
                                    <h4>Buy Stop (Breakout)</h4>
                                    <p><strong>Trigger:</strong> LTP ≥ Stop Price</p>
                                    <p><strong>Use:</strong> Enter on breakout, cover short positions</p>
                                    <p><strong>Example:</strong> Stock at ₹500, set buy stop @ ₹520 to catch breakout</p>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'calculator' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>📊 Interactive Order Cost Calculator</h2>
                            <p>Calculate the exact cost of your order including buffers and fees</p>

                            <div className="calculator-container">
                                <div className="calc-inputs">
                                    <div className="input-group">
                                        <label>Order Type</label>
                                        <select value={calcOrderType} onChange={(e) => setCalcOrderType(e.target.value as 'MARKET' | 'LIMIT')}>
                                            <option value="MARKET">Market Order</option>
                                            <option value="LIMIT">Limit Order</option>
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label>Quantity (shares)</label>
                                        <input
                                            type="number"
                                            value={calcQuantity}
                                            onChange={(e) => setCalcQuantity(Number(e.target.value))}
                                            min="1"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Price per Share (₹)</label>
                                        <input
                                            type="number"
                                            value={calcPrice}
                                            onChange={(e) => setCalcPrice(Number(e.target.value))}
                                            min="0"
                                            step="0.05"
                                        />
                                    </div>
                                </div>

                                <div className="calc-results">
                                    <h3>Cost Breakdown</h3>
                                    <div className="result-row">
                                        <span>Base Value</span>
                                        <span className="value">₹{costs.baseValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                    </div>

                                    {calcOrderType === 'MARKET' && (
                                        <div className="result-row highlight">
                                            <span>Market Buffer (1%)</span>
                                            <span className="value">₹{costs.buffer.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                        </div>
                                    )}

                                    <div className="result-row">
                                        <span>Commission (0.03% or ₹20 cap)</span>
                                        <span className="value">₹{costs.commission.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                    </div>

                                    <div className="result-row total">
                                        <span><strong>Total Required</strong></span>
                                        <span className="value"><strong>₹{costs.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong></span>
                                    </div>

                                    {calcOrderType === 'MARKET' && (
                                        <div className="info-box tip">
                                            The 1% buffer ensures you have enough funds even if the price moves slightly during execution. Unused buffer is returned after execution.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                <section className="guide-section full-width">
                    <h3>Execution Matrix (Quick Comparison)</h3>
                    <div className="comparison-table-dense">
                        <table>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Market</th>
                                    <th>Limit</th>
                                    <th>Stop</th>
                                    <th>Stop-Limit</th>
                                    <th>Trailing Stop</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Execution Speed</td>
                                    <td className="green">Immediate</td>
                                    <td className="red">Delayed/Never</td>
                                    <td className="green">Fast (when triggered)</td>
                                    <td>Medium</td>
                                    <td className="green">Fast (when triggered)</td>
                                </tr>
                                <tr>
                                    <td>Price Certainty</td>
                                    <td className="red">None (±1% buffer)</td>
                                    <td className="green">Guaranteed (or better)</td>
                                    <td className="red">None</td>
                                    <td className="green">Limit protected</td>
                                    <td className="red">None</td>
                                </tr>
                                <tr>
                                    <td>Fill Certainty</td>
                                    <td className="green">100%</td>
                                    <td className="red">Partial/None</td>
                                    <td className="green">High</td>
                                    <td className="red">Medium</td>
                                    <td className="green">High</td>
                                </tr>
                                <tr>
                                    <td>Gap Risk</td>
                                    <td>N/A</td>
                                    <td>N/A</td>
                                    <td className="red">High</td>
                                    <td className="red">High</td>
                                    <td className="red">High</td>
                                </tr>
                                <tr>
                                    <td>Best For</td>
                                    <td>Urgent exits, high liquidity</td>
                                    <td>Patient entries, price discipline</td>
                                    <td>Stop-losses, breakouts</td>
                                    <td>Profit-taking with protection</td>
                                    <td>Trending markets, locking profits</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="decision-tree-section">
                    <h3>🌳 Decision Tree: Which Order Type Should I Use?</h3>
                    <div className="tree-container">
                        <div className="tree-node root">
                            <p><strong>Do you need to execute RIGHT NOW?</strong></p>
                            <div className="tree-branches">
                                <div className="branch">
                                    <div className="branch-label">YES</div>
                                    <div className="tree-node">
                                        <p className="decision">Use <strong>MARKET</strong> order</p>
                                        <p className="rationale">Speed &gt; Price</p>
                                    </div>
                                </div>
                                <div className="branch">
                                    <div className="branch-label">NO</div>
                                    <div className="tree-node">
                                        <p><strong>Do you want to protect an existing position?</strong></p>
                                        <div className="tree-branches">
                                            <div className="branch">
                                                <div className="branch-label">YES</div>
                                                <div className="tree-node">
                                                    <p><strong>Is the market trending?</strong></p>
                                                    <div className="tree-branches">
                                                        <div className="branch">
                                                            <div className="branch-label">YES</div>
                                                            <div className="tree-node">
                                                                <p className="decision">Use <strong>TRAILING STOP</strong></p>
                                                                <p className="rationale">Lock in profits as price moves</p>
                                                            </div>
                                                        </div>
                                                        <div className="branch">
                                                            <div className="branch-label">NO</div>
                                                            <div className="tree-node">
                                                                <p className="decision">Use <strong>STOP</strong> or <strong>STOP-LIMIT</strong></p>
                                                                <p className="rationale">Fixed stop-loss protection</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="branch">
                                                <div className="branch-label">NO</div>
                                                <div className="tree-node">
                                                    <p className="decision">Use <strong>LIMIT</strong> order</p>
                                                    <p className="rationale">Patient entry at your price</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="common-mistakes-section">
                    <h3>❌ Common Order Type Mistakes (And How to Avoid Them)</h3>

                    <div className="mistake-card">
                        <div className="mistake-header">
                            <span className="mistake-num">1</span>
                            <h4>Using Market Orders in Illiquid Stocks</h4>
                        </div>
                        <div className="mistake-content">
                            <p><strong>The Error:</strong> Placing a market buy order for 500 shares of a small-cap stock with thin trading volume</p>
                            <p><strong>What Happens:</strong> You "walk up the order book," buying at progressively worse prices. First 100 @ ₹50, next 200 @ ₹52, last 200 @ ₹55</p>
                            <p><strong>Cost:</strong> Average price ₹52.60 instead of expected ₹50 = 5.2% slippage!</p>
                            <p className="fix"><strong>✓ Fix:</strong> Use limit orders for illiquid stocks. Set limit at ₹51 and wait for fills.</p>
                        </div>
                    </div>

                    <div className="mistake-card">
                        <div className="mistake-header">
                            <span className="mistake-num">2</span>
                            <h4>Setting Stop-Loss Too Tight</h4>
                        </div>
                        <div className="mistake-content">
                            <p><strong>The Error:</strong> Buy stock @ ₹1,000, set stop @ ₹995 (0.5% away)</p>
                            <p><strong>What Happens:</strong> Normal intraday volatility triggers your stop. Stock dips to ₹993, your stop executes, then stock rallies to ₹1,050</p>
                            <p><strong>Cost:</strong> ₹7 loss per share + missed ₹50 rally = ₹57/share opportunity cost</p>
                            <p className="fix"><strong>✓ Fix:</strong> Use ATR (Average True Range) to set stops. Typical: 1.5-2x ATR below entry for swing trades.</p>
                        </div>
                    </div>

                    <div className="mistake-card">
                        <div className="mistake-header">
                            <span className="mistake-num">3</span>
                            <h4>Forgetting About IOC Validity</h4>
                        </div>
                        <div className="mistake-content">
                            <p><strong>The Error:</strong> Placing a limit order with IOC validity, expecting it to stay active</p>
                            <p><strong>What Happens:</strong> Order doesn't fill in the 3-second matching cycle, auto-cancels immediately</p>
                            <p><strong>Result:</strong> You think your order is working, but it's already cancelled</p>
                            <p className="fix"><strong>✓ Fix:</strong> Use DAY validity for limit orders you want to keep active. IOC only for "fill now or forget it" scenarios.</p>
                        </div>
                    </div>

                    <div className="mistake-card">
                        <div className="mistake-header">
                            <span className="mistake-num">4</span>
                            <h4>Not Accounting for Gap Risk on Stops</h4>
                        </div>
                        <div className="mistake-content">
                            <p><strong>The Error:</strong> Holding a position overnight with a stop-loss, assuming it guarantees your max loss</p>
                            <p><strong>What Happens:</strong> Stock gaps down 15% on bad news, your stop triggers at the gap price, not your stop price</p>
                            <p><strong>Cost:</strong> Expected max loss 5%, actual loss 15%</p>
                            <p className="fix"><strong>✓ Fix:</strong> Never hold risky positions overnight before earnings/events. Size positions to tolerate gap risk.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTypes;
