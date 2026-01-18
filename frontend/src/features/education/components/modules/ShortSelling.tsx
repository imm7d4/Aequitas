import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const ShortSelling: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'basics' | 'math' | 'risk' | 'calculator'>('basics');

    // Margin Calculator State
    const [calcQuantity, setCalcQuantity] = useState(100);
    const [calcEntryPrice, setCalcEntryPrice] = useState(500);
    const [calcCurrentPrice, setCalcCurrentPrice] = useState(480);
    const [calcAccountBalance, setCalcAccountBalance] = useState(100000);

    const marginCalc = useMemo(() => {
        const positionValue = calcQuantity * calcEntryPrice;
        const requiredMargin = positionValue * 0.20; // 20% margin requirement
        const currentLiability = calcQuantity * calcCurrentPrice;
        const proceeds = positionValue;
        const unrealizedPL = (calcEntryPrice - calcCurrentPrice) * calcQuantity;
        const availableCash = calcAccountBalance - requiredMargin;
        const totalEquity = calcAccountBalance + unrealizedPL;
        const marginRatio = totalEquity / requiredMargin;

        let marginStatus = 'OK';
        if (marginRatio < 0.5) marginStatus = 'CRITICAL';
        else if (marginRatio < 1.0) marginStatus = 'WARNING';

        return {
            positionValue,
            requiredMargin,
            currentLiability,
            proceeds,
            unrealizedPL,
            availableCash,
            totalEquity,
            marginRatio,
            marginStatus
        };
    }, [calcQuantity, calcEntryPrice, calcCurrentPrice, calcAccountBalance]);

    return (
        <div className="custom-module-page short-selling-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill warning">Advanced Mechanics</div>
                    <h1>Short Selling Deep-Dive</h1>
                    <p className="hero-lead">Profit from the fall. Master the mechanics of synthetic inventory, borrowed exposure, and the critical math of equity inversion. Short selling is high-risk, high-reward—learn to manage both.</p>
                </div>
                <div className="hero-visual">
                    <div className="arrow-down-visual"></div>
                </div>
            </header>

            <div className="content-container">
                <div className="density-tabs">
                    <button className={activeTab === 'basics' ? 'active' : ''} onClick={() => setActiveTab('basics')}>The Mechanism</button>
                    <button className={activeTab === 'math' ? 'active' : ''} onClick={() => setActiveTab('math')}>Financial Math</button>
                    <button className={activeTab === 'risk' ? 'active' : ''} onClick={() => setActiveTab('risk')}>Risk & Protection</button>
                    <button className={activeTab === 'calculator' ? 'active' : ''} onClick={() => setActiveTab('calculator')}>Margin Calculator</button>
                </div>

                {activeTab === 'basics' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>The Borrowing Metaphor</h2>
                            <p className="large-text">In Aequitas, when you short, you are selling shares you <strong>do not yet own</strong>. You are creating a 'Negative Inventory' in the system—a liability that must eventually be covered.</p>

                            <div className="glass-card">
                                <h3>The Complete Short Selling Sequence</h3>
                                <div className="timeline-walkthrough">
                                    <div className="tw-step">
                                        <div className="step-indicator trigger"></div>
                                        <strong>Step 1: Sell Short (Opening Position)</strong>
                                        <p>You sell 100 shares of Reliance at ₹2,500 per share</p>
                                        <div className="calc-breakdown">
                                            <div className="calc-row">
                                                <span>Proceeds (temporarily held):</span>
                                                <span className="value">100 × ₹2,500 = ₹2,50,000</span>
                                            </div>
                                            <div className="calc-row highlight">
                                                <span>Margin Blocked (20%):</span>
                                                <span className="value">₹2,50,000 × 0.20 = ₹50,000</span>
                                            </div>
                                            <div className="calc-row">
                                                <span>Your Position:</span>
                                                <span className="value">SHORT 100 Reliance @ ₹2,500</span>
                                            </div>
                                        </div>
                                        <div className="info-box tip">
                                            The ₹50,000 margin is locked from your account balance. You cannot use it for other trades until you close this position.
                                        </div>
                                    </div>

                                    <div className="tw-step">
                                        <div className="step-indicator"></div>
                                        <strong>Step 2: The Price Drops (Profit Scenario)</strong>
                                        <p>Stock falls to ₹2,300. Your liability (the 100 shares you owe) is now cheaper to buy back.</p>
                                        <div className="calc-breakdown">
                                            <div className="calc-row success">
                                                <span>Current Liability:</span>
                                                <span className="value">100 × ₹2,300 = ₹2,30,000</span>
                                            </div>
                                            <div className="calc-row success">
                                                <span>Unrealized P&L:</span>
                                                <span className="value">(₹2,500 - ₹2,300) × 100 = +₹20,000</span>
                                            </div>
                                            <div className="calc-row">
                                                <span>Margin Status:</span>
                                                <span className="value status-ok">OK (Equity {'>'} Margin)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tw-step">
                                        <div className="step-indicator confirm"></div>
                                        <strong>Step 3: Buy to Cover (Closing Position)</strong>
                                        <p>You buy back 100 shares at ₹2,300 to close your short position</p>
                                        <div className="calc-breakdown">
                                            <div className="calc-row">
                                                <span>Cost to Cover:</span>
                                                <span className="value">100 × ₹2,300 = ₹2,30,000</span>
                                            </div>
                                            <div className="calc-row">
                                                <span>Original Proceeds:</span>
                                                <span className="value">₹2,50,000</span>
                                            </div>
                                            <div className="calc-row success">
                                                <span>Realized Profit:</span>
                                                <span className="value">₹2,50,000 - ₹2,30,000 = ₹20,000</span>
                                            </div>
                                            <div className="calc-row">
                                                <span>Margin Released:</span>
                                                <span className="value">₹50,000 (back to available balance)</span>
                                            </div>
                                        </div>
                                        <div className="lesson-box">
                                            <h4>✓ Successful Short Trade</h4>
                                            <p>You profited ₹20,000 (8% return) by correctly predicting the price would fall. Your margin of ₹50,000 is now released and available for new trades.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="example-box warning">
                                <h3>Alternative Scenario: The Price Rises (Loss Scenario)</h3>
                                <p>Let's see what happens if your prediction was wrong...</p>

                                <div className="scenario-timeline">
                                    <div className="timeline-step">
                                        <div className="step-label">Day 1</div>
                                        <div className="step-content">
                                            <p>You short 100 Reliance @ ₹2,500</p>
                                            <p>Margin Blocked: ₹50,000</p>
                                            <p>Account Balance: ₹1,00,000</p>
                                        </div>
                                    </div>

                                    <div className="timeline-step warning">
                                        <div className="step-label">Day 3</div>
                                        <div className="step-content">
                                            <p>Unexpected positive news! Stock jumps to ₹2,700</p>
                                            <div className="calc-breakdown">
                                                <div className="calc-row danger">
                                                    <span>Unrealized Loss:</span>
                                                    <span className="value">(₹2,500 - ₹2,700) × 100 = -₹20,000</span>
                                                </div>
                                                <div className="calc-row">
                                                    <span>Total Equity:</span>
                                                    <span className="value">₹1,00,000 - ₹20,000 = ₹80,000</span>
                                                </div>
                                                <div className="calc-row warning">
                                                    <span>Margin Ratio:</span>
                                                    <span className="value">₹80,000 / ₹50,000 = 1.6 (Still OK)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="timeline-step danger">
                                        <div className="step-label">Day 5</div>
                                        <div className="step-content">
                                            <p>Stock continues rallying to ₹2,900</p>
                                            <div className="calc-breakdown">
                                                <div className="calc-row danger">
                                                    <span>Unrealized Loss:</span>
                                                    <span className="value">(₹2,500 - ₹2,900) × 100 = -₹40,000</span>
                                                </div>
                                                <div className="calc-row danger">
                                                    <span>Total Equity:</span>
                                                    <span className="value">₹1,00,000 - ₹40,000 = ₹60,000</span>
                                                </div>
                                                <div className="calc-row danger">
                                                    <span>Margin Ratio:</span>
                                                    <span className="value">₹60,000 / ₹50,000 = 1.2 (Still OK, but deteriorating)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="timeline-step danger">
                                        <div className="step-label">Decision Point</div>
                                        <div className="step-content">
                                            <p><strong>Option 1:</strong> Cover now at ₹2,900 → Lock in ₹40,000 loss (16% loss on margin)</p>
                                            <p><strong>Option 2:</strong> Hold and hope for reversal → Risk further losses and potential margin call</p>
                                            <div className="info-box danger">
                                                ⚠️ If stock continues to ₹3,125, your equity drops to ₹37,500 (ratio = 0.75), triggering a WARNING margin call. At ₹3,375, equity = ₹12,500 (ratio = 0.25), triggering CRITICAL margin call!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card darker">
                                <h3>Understanding "Synthetic Inventory"</h3>
                                <p>In traditional markets, short selling requires borrowing actual shares from a lender (via Stock Lending & Borrowing or SLB). Aequitas simulates this by creating a "negative position" in your portfolio.</p>

                                <div className="balance-sheet-visual">
                                    <h4>Your Balance Sheet When Short</h4>
                                    <div className="bs-row header">
                                        <span>Assets</span>
                                        <span>Liabilities</span>
                                    </div>
                                    <div className="bs-row">
                                        <span>Cash: ₹50,000 (available)</span>
                                        <span>Short Position: 100 shares @ current price</span>
                                    </div>
                                    <div className="bs-row">
                                        <span>Blocked Margin: ₹50,000</span>
                                        <span>Obligation to return 100 shares</span>
                                    </div>
                                    <div className="bs-row highlight">
                                        <span>Proceeds: ₹2,50,000 (held)</span>
                                        <span>Liability Value: Quantity × Current Price</span>
                                    </div>
                                </div>

                                <div className="info-box logic">
                                    <strong>Key Insight:</strong> Unlike long positions where your shares are an asset, short positions are a <strong>liability</strong>. As the stock price rises, your liability increases. This is why short selling has theoretically unlimited loss potential.
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'math' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>The Equity Inversion Rule</h2>
                            <p className="large-text">P&L for a short position is calculated as: <code>(EntryPrice - CurrentPrice) × Quantity</code>. Notice the inversion—lower price equals higher profit.</p>

                            <div className="formula-block">
                                <h3>Short Position P&L Formula</h3>
                                <p className="math">Unrealized P&L = (Entry Price - Current Price) × Quantity</p>
                                <p className="math">If Current Price &lt; Entry Price → Profit (Positive P&L)</p>
                                <p className="math">If Current Price &gt; Entry Price → Loss (Negative P&L)</p>
                            </div>

                            <div className="example-box">
                                <h3>Worked Example 1: Profitable Short Trade</h3>
                                <div className="example-scenario">
                                    <div className="scenario-header">
                                        <h4>Setup</h4>
                                        <p>Stock: HDFC Bank</p>
                                        <p>Your Analysis: Overbought, expecting correction</p>
                                    </div>

                                    <div className="scenario-steps">
                                        <div className="step">
                                            <div className="step-num">1</div>
                                            <div className="step-details">
                                                <h5>Entry (Day 1)</h5>
                                                <p>Short 200 shares @ ₹1,600</p>
                                                <div className="calc-breakdown">
                                                    <div className="calc-row">
                                                        <span>Position Value:</span>
                                                        <span className="value">200 × ₹1,600 = ₹3,20,000</span>
                                                    </div>
                                                    <div className="calc-row highlight">
                                                        <span>Margin Required (20%):</span>
                                                        <span className="value">₹3,20,000 × 0.20 = ₹64,000</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="step">
                                            <div className="step-num">2</div>
                                            <div className="step-details">
                                                <h5>Price Movement (Day 5)</h5>
                                                <p>Stock drops to ₹1,520</p>
                                                <div className="calc-breakdown">
                                                    <div className="calc-row success">
                                                        <span>Unrealized P&L:</span>
                                                        <span className="value">(₹1,600 - ₹1,520) × 200 = +₹16,000</span>
                                                    </div>
                                                    <div className="calc-row">
                                                        <span>Return on Margin:</span>
                                                        <span className="value">₹16,000 / ₹64,000 = 25%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="step">
                                            <div className="step-num">3</div>
                                            <div className="step-details">
                                                <h5>Exit (Day 7)</h5>
                                                <p>Cover position at ₹1,480</p>
                                                <div className="calc-breakdown">
                                                    <div className="calc-row">
                                                        <span>Cover Cost:</span>
                                                        <span className="value">200 × ₹1,480 = ₹2,96,000</span>
                                                    </div>
                                                    <div className="calc-row">
                                                        <span>Original Proceeds:</span>
                                                        <span className="value">₹3,20,000</span>
                                                    </div>
                                                    <div className="calc-row success">
                                                        <span>Realized Profit:</span>
                                                        <span className="value">₹3,20,000 - ₹2,96,000 = ₹24,000</span>
                                                    </div>
                                                    <div className="calc-row success">
                                                        <span>ROI on Margin:</span>
                                                        <span className="value">₹24,000 / ₹64,000 = 37.5%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lesson-box">
                                        <h4>Analysis</h4>
                                        <p>Stock fell 7.5% (₹1,600 → ₹1,480), but your profit was 37.5% on the margin deployed. This is the power of leverage in short selling—small price movements create amplified returns (both positive and negative).</p>
                                    </div>
                                </div>
                            </div>

                            <div className="example-box danger">
                                <h3>Worked Example 2: Loss Scenario with Margin Call</h3>
                                <div className="example-scenario">
                                    <div className="scenario-header">
                                        <h4>Setup</h4>
                                        <p>Stock: TCS</p>
                                        <p>Account Balance: ₹1,50,000</p>
                                    </div>

                                    <div className="scenario-steps">
                                        <div className="step">
                                            <div className="step-num">1</div>
                                            <div className="step-details">
                                                <h5>Entry</h5>
                                                <p>Short 100 TCS @ ₹3,500</p>
                                                <div className="calc-breakdown">
                                                    <div className="calc-row">
                                                        <span>Position Value:</span>
                                                        <span className="value">₹3,50,000</span>
                                                    </div>
                                                    <div className="calc-row highlight">
                                                        <span>Margin Blocked:</span>
                                                        <span className="value">₹70,000</span>
                                                    </div>
                                                    <div className="calc-row">
                                                        <span>Available Cash:</span>
                                                        <span className="value">₹1,50,000 - ₹70,000 = ₹80,000</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="step">
                                            <div className="step-num">2</div>
                                            <div className="step-details">
                                                <h5>Price Rises to ₹3,800</h5>
                                                <div className="calc-breakdown">
                                                    <div className="calc-row danger">
                                                        <span>Unrealized Loss:</span>
                                                        <span className="value">(₹3,500 - ₹3,800) × 100 = -₹30,000</span>
                                                    </div>
                                                    <div className="calc-row">
                                                        <span>Total Equity:</span>
                                                        <span className="value">₹1,50,000 - ₹30,000 = ₹1,20,000</span>
                                                    </div>
                                                    <div className="calc-row warning">
                                                        <span>Margin Ratio:</span>
                                                        <span className="value">₹1,20,000 / ₹70,000 = 1.71 (OK)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="step">
                                            <div className="step-num">3</div>
                                            <div className="step-details">
                                                <h5>Price Continues to ₹4,000</h5>
                                                <div className="calc-breakdown">
                                                    <div className="calc-row danger">
                                                        <span>Unrealized Loss:</span>
                                                        <span className="value">(₹3,500 - ₹4,000) × 100 = -₹50,000</span>
                                                    </div>
                                                    <div className="calc-row danger">
                                                        <span>Total Equity:</span>
                                                        <span className="value">₹1,50,000 - ₹50,000 = ₹1,00,000</span>
                                                    </div>
                                                    <div className="calc-row danger">
                                                        <span>Margin Ratio:</span>
                                                        <span className="value">₹1,00,000 / ₹70,000 = 1.43 (OK, but deteriorating)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="step">
                                            <div className="step-num">4</div>
                                            <div className="step-details">
                                                <h5>Price Hits ₹4,200 - WARNING MARGIN CALL</h5>
                                                <div className="calc-breakdown">
                                                    <div className="calc-row danger">
                                                        <span>Unrealized Loss:</span>
                                                        <span className="value">(₹3,500 - ₹4,200) × 100 = -₹70,000</span>
                                                    </div>
                                                    <div className="calc-row danger">
                                                        <span>Total Equity:</span>
                                                        <span className="value">₹1,50,000 - ₹70,000 = ₹80,000</span>
                                                    </div>
                                                    <div className="calc-row danger">
                                                        <span>Margin Ratio:</span>
                                                        <span className="value">₹80,000 / ₹70,000 = 1.14</span>
                                                    </div>
                                                </div>
                                                <div className="info-box warning">
                                                    ⚠️ <strong>WARNING Margin Call!</strong> Your equity has dropped below the initial margin requirement. Aequitas sends you an alert to add funds or close the position.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="step">
                                            <div className="step-num">5</div>
                                            <div className="step-details">
                                                <h5>Price Hits ₹4,500 - CRITICAL MARGIN CALL</h5>
                                                <div className="calc-breakdown">
                                                    <div className="calc-row danger">
                                                        <span>Unrealized Loss:</span>
                                                        <span className="value">(₹3,500 - ₹4,500) × 100 = -₹1,00,000</span>
                                                    </div>
                                                    <div className="calc-row danger">
                                                        <span>Total Equity:</span>
                                                        <span className="value">₹1,50,000 - ₹1,00,000 = ₹50,000</span>
                                                    </div>
                                                    <div className="calc-row danger">
                                                        <span>Margin Ratio:</span>
                                                        <span className="value">₹50,000 / ₹70,000 = 0.71</span>
                                                    </div>
                                                </div>
                                                <div className="info-box danger">
                                                    🚨 <strong>CRITICAL Margin Call!</strong> Equity &lt; 50% of margin requirement. Immediate action required or position may be auto-liquidated (in real brokerages).
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lesson-box">
                                        <h4>Critical Lessons</h4>
                                        <ul>
                                            <li>Stock rose 28.6% (₹3,500 → ₹4,500)</li>
                                            <li>Your loss: ₹1,00,000 (142.9% of your ₹70,000 margin!)</li>
                                            <li>This demonstrates the asymmetric risk: small price increases create large losses</li>
                                            <li>Always use stop-losses on short positions (e.g., 5-8% above entry)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="example-box">
                                <h3>Worked Example 3: Partial Cover Strategy</h3>
                                <p>You don't have to close your entire position at once. Let's see how partial covering works:</p>

                                <div className="scenario-timeline">
                                    <div className="timeline-step">
                                        <div className="step-label">Initial Position</div>
                                        <div className="step-content">
                                            <p>Short 300 Infosys @ ₹1,500</p>
                                            <p>Margin Blocked: ₹90,000 (20% of ₹4,50,000)</p>
                                        </div>
                                    </div>

                                    <div className="timeline-step">
                                        <div className="step-label">Partial Cover 1</div>
                                        <div className="step-content">
                                            <p>Stock drops to ₹1,400. Cover 100 shares to lock in profit.</p>
                                            <div className="calc-breakdown">
                                                <div className="calc-row success">
                                                    <span>Profit on 100 shares:</span>
                                                    <span className="value">(₹1,500 - ₹1,400) × 100 = ₹10,000</span>
                                                </div>
                                                <div className="calc-row">
                                                    <span>Margin Released:</span>
                                                    <span className="value">₹90,000 × (100/300) = ₹30,000</span>
                                                </div>
                                                <div className="calc-row">
                                                    <span>Remaining Position:</span>
                                                    <span className="value">SHORT 200 @ ₹1,500</span>
                                                </div>
                                                <div className="calc-row">
                                                    <span>Remaining Margin:</span>
                                                    <span className="value">₹60,000</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="timeline-step">
                                        <div className="step-label">Partial Cover 2</div>
                                        <div className="step-content">
                                            <p>Stock drops further to ₹1,350. Cover another 100 shares.</p>
                                            <div className="calc-breakdown">
                                                <div className="calc-row success">
                                                    <span>Profit on 100 shares:</span>
                                                    <span className="value">(₹1,500 - ₹1,350) × 100 = ₹15,000</span>
                                                </div>
                                                <div className="calc-row">
                                                    <span>Cumulative Realized Profit:</span>
                                                    <span className="value">₹10,000 + ₹15,000 = ₹25,000</span>
                                                </div>
                                                <div className="calc-row">
                                                    <span>Remaining Position:</span>
                                                    <span className="value">SHORT 100 @ ₹1,500</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="timeline-step">
                                        <div className="step-label">Final Cover</div>
                                        <div className="step-content">
                                            <p>Stock bounces to ₹1,420. Cover final 100 shares.</p>
                                            <div className="calc-breakdown">
                                                <div className="calc-row success">
                                                    <span>Profit on last 100:</span>
                                                    <span className="value">(₹1,500 - ₹1,420) × 100 = ₹8,000</span>
                                                </div>
                                                <div className="calc-row success">
                                                    <span>Total Realized Profit:</span>
                                                    <span className="value">₹25,000 + ₹8,000 = ₹33,000</span>
                                                </div>
                                                <div className="calc-row">
                                                    <span>All Margin Released:</span>
                                                    <span className="value">₹90,000</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lesson-box">
                                    <h4>Strategy Benefits</h4>
                                    <ul>
                                        <li><strong>Risk Management:</strong> Locking in profits reduces exposure as trade moves in your favor</li>
                                        <li><strong>Flexibility:</strong> Can ride remaining position for bigger gains while protecting capital</li>
                                        <li><strong>Margin Release:</strong> Each partial cover releases proportional margin for other opportunities</li>
                                        <li><strong>Average Exit:</strong> ₹1,390 average cover price vs ₹1,500 entry = 7.3% profit on position value, 36.7% ROI on margin</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="balance-sheet-visual">
                                <h3>Equity Calculation at Different Price Points</h3>
                                <p>Example: Short 100 shares @ ₹500, Account Balance: ₹1,00,000</p>
                                <table className="price-equity-table">
                                    <thead>
                                        <tr>
                                            <th>Current Price</th>
                                            <th>Unrealized P&L</th>
                                            <th>Total Equity</th>
                                            <th>Margin Ratio</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="success-row">
                                            <td>₹400</td>
                                            <td>+₹10,000</td>
                                            <td>₹1,10,000</td>
                                            <td>11.0</td>
                                            <td><span className="status-badge filled">OK</span></td>
                                        </tr>
                                        <tr className="success-row">
                                            <td>₹450</td>
                                            <td>+₹5,000</td>
                                            <td>₹1,05,000</td>
                                            <td>10.5</td>
                                            <td><span className="status-badge filled">OK</span></td>
                                        </tr>
                                        <tr>
                                            <td>₹500</td>
                                            <td>₹0</td>
                                            <td>₹1,00,000</td>
                                            <td>10.0</td>
                                            <td><span className="status-badge filled">OK</span></td>
                                        </tr>
                                        <tr className="warning-row">
                                            <td>₹550</td>
                                            <td>-₹5,000</td>
                                            <td>₹95,000</td>
                                            <td>9.5</td>
                                            <td><span className="status-badge filled">OK</span></td>
                                        </tr>
                                        <tr className="warning-row">
                                            <td>₹600</td>
                                            <td>-₹10,000</td>
                                            <td>₹90,000</td>
                                            <td>9.0</td>
                                            <td><span className="status-badge pending">WARNING</span></td>
                                        </tr>
                                        <tr className="danger-row">
                                            <td>₹700</td>
                                            <td>-₹20,000</td>
                                            <td>₹80,000</td>
                                            <td>8.0</td>
                                            <td><span className="status-badge pending">WARNING</span></td>
                                        </tr>
                                        <tr className="danger-row">
                                            <td>₹950</td>
                                            <td>-₹45,000</td>
                                            <td>₹55,000</td>
                                            <td>5.5</td>
                                            <td><span className="status-badge cancelled">CRITICAL</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="info-box logic">
                                    <strong>Note:</strong> Margin requirement is ₹10,000 (20% of ₹50,000 position). WARNING triggers when equity &lt; margin (ratio &lt; 1.0). CRITICAL triggers when equity &lt; 50% of margin (ratio &lt; 0.5).
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'risk' && (
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
                                        <p><strong>Avoid:</strong> Shorting strong uptrends or stocks near 52-week lows</p>
                                    </div>

                                    <div className="strategy-card">
                                        <div className="strategy-num">4</div>
                                        <h4>Monitor Margin Closely</h4>
                                        <p><strong>Action Plan:</strong></p>
                                        <ul>
                                            <li>Check margin ratio daily (in Aequitas Portfolio page)</li>
                                            <li>If ratio &lt; 1.5: Consider adding funds or reducing position</li>
                                            <li>If ratio &lt; 1.0: Immediate action required (WARNING)</li>
                                            <li>If ratio &lt; 0.5: Critical risk (CRITICAL)</li>
                                        </ul>
                                    </div>

                                    <div className="strategy-card">
                                        <div className="strategy-num">5</div>
                                        <h4>Take Profits Systematically</h4>
                                        <p><strong>Strategy:</strong> Use partial covers to lock in gains</p>
                                        <p><strong>Example:</strong></p>
                                        <ul>
                                            <li>Cover 1/3 at 5% profit</li>
                                            <li>Cover 1/3 at 10% profit</li>
                                            <li>Let final 1/3 run with trailing stop</li>
                                        </ul>
                                        <p><strong>Why?</strong> Shorts can reverse quickly. Locking in profits reduces risk of giving back gains</p>
                                    </div>

                                    <div className="strategy-card">
                                        <div className="strategy-num">6</div>
                                        <h4>Avoid Overnight Risk</h4>
                                        <p><strong>Rule:</strong> Consider closing shorts before major events</p>
                                        <p><strong>High-Risk Events:</strong></p>
                                        <ul>
                                            <li>Earnings announcements</li>
                                            <li>RBI policy meetings</li>
                                            <li>Budget announcements</li>
                                            <li>Company-specific news (M&A, product launches)</li>
                                        </ul>
                                        <p><strong>Why?</strong> Gap risk can cause losses far beyond your stop-loss</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card">
                                <h3>Regulatory & Practical Constraints</h3>
                                <p>While Aequitas allows unlimited synthetic shorting for educational purposes, real-world short selling has additional constraints:</p>

                                <div className="constraint-list">
                                    <div className="constraint-item">
                                        <h4>📋 Stock Lending & Borrowing (SLB)</h4>
                                        <p>In real markets, you can only short if your broker can borrow shares from their SLB pool. If no shares are available to borrow, you cannot short.</p>
                                        <p className="roadmap-pill">Upcoming in Aequitas: SLB Inventory Simulation</p>
                                    </div>

                                    <div className="constraint-item">
                                        <h4>💰 Borrowing Costs</h4>
                                        <p>Real short positions incur daily borrowing fees (typically 0.01-0.05% per day). For hard-to-borrow stocks, this can be much higher (1-5% per day!).</p>
                                        <p><strong>Impact:</strong> Holding shorts long-term can be expensive even if price doesn't move</p>
                                    </div>

                                    <div className="constraint-item">
                                        <h4>🛑 Short Selling Bans</h4>
                                        <p>SEBI can temporarily ban short selling during extreme market volatility to prevent panic selling.</p>
                                        <p><strong>Example:</strong> During COVID-19 crash (March 2020), short selling was temporarily restricted</p>
                                    </div>

                                    <div className="constraint-item">
                                        <h4>📊 Dividend Obligations</h4>
                                        <p>If you're short a stock when it pays a dividend, you must pay that dividend to the share lender.</p>
                                        <p><strong>Example:</strong> Short 100 shares, company declares ₹10 dividend → You owe ₹1,000</p>
                                    </div>

                                    <div className="constraint-item">
                                        <h4>⚡ Circuit Breakers</h4>
                                        <p>Stocks can hit upper circuit (20% daily limit), preventing you from covering your short position.</p>
                                        <p><strong>Risk:</strong> Trapped in a losing position, unable to exit, while losses mount</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'calculator' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>📊 Interactive Short Selling Margin Calculator</h2>
                            <p>Calculate margin requirements, P&L, and margin ratios for short positions in real-time</p>

                            <div className="calculator-container">
                                <div className="calc-inputs">
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
                                        <label>Entry Price (₹)</label>
                                        <input
                                            type="number"
                                            value={calcEntryPrice}
                                            onChange={(e) => setCalcEntryPrice(Number(e.target.value))}
                                            min="0"
                                            step="0.05"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Current Price (₹)</label>
                                        <input
                                            type="number"
                                            value={calcCurrentPrice}
                                            onChange={(e) => setCalcCurrentPrice(Number(e.target.value))}
                                            min="0"
                                            step="0.05"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Account Balance (₹)</label>
                                        <input
                                            type="number"
                                            value={calcAccountBalance}
                                            onChange={(e) => setCalcAccountBalance(Number(e.target.value))}
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="calc-results">
                                    <h3>Position Details</h3>
                                    <div className="result-row">
                                        <span>Position Value</span>
                                        <span className="value">₹{marginCalc.positionValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="result-row highlight">
                                        <span>Required Margin (20%)</span>
                                        <span className="value">₹{marginCalc.requiredMargin.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="result-row">
                                        <span>Current Liability</span>
                                        <span className="value">₹{marginCalc.currentLiability.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                    </div>

                                    <h3 style={{ marginTop: '2rem' }}>P&L Analysis</h3>
                                    <div className={`result-row ${marginCalc.unrealizedPL >= 0 ? 'success' : 'danger'}`}>
                                        <span>Unrealized P&L</span>
                                        <span className="value">
                                            {marginCalc.unrealizedPL >= 0 ? '+' : ''}₹{marginCalc.unrealizedPL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="result-row">
                                        <span>ROI on Margin</span>
                                        <span className="value">
                                            {((marginCalc.unrealizedPL / marginCalc.requiredMargin) * 100).toFixed(2)}%
                                        </span>
                                    </div>

                                    <h3 style={{ marginTop: '2rem' }}>Margin Status</h3>
                                    <div className="result-row">
                                        <span>Available Cash</span>
                                        <span className="value">₹{marginCalc.availableCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="result-row">
                                        <span>Total Equity</span>
                                        <span className="value">₹{marginCalc.totalEquity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className={`result-row total ${marginCalc.marginStatus === 'CRITICAL' ? 'danger' : marginCalc.marginStatus === 'WARNING' ? 'warning' : ''}`}>
                                        <span><strong>Margin Ratio</strong></span>
                                        <span className="value"><strong>{marginCalc.marginRatio.toFixed(2)}</strong></span>
                                    </div>
                                    <div className="result-row">
                                        <span><strong>Status</strong></span>
                                        <span className="value">
                                            <span className={`status-badge ${marginCalc.marginStatus === 'OK' ? 'filled' : marginCalc.marginStatus === 'WARNING' ? 'pending' : 'cancelled'}`}>
                                                {marginCalc.marginStatus}
                                            </span>
                                        </span>
                                    </div>

                                    {marginCalc.marginStatus === 'WARNING' && (
                                        <div className="info-box warning">
                                            ⚠️ <strong>WARNING:</strong> Your equity has dropped below the initial margin requirement. Consider adding funds or closing the position to avoid critical margin call.
                                        </div>
                                    )}

                                    {marginCalc.marginStatus === 'CRITICAL' && (
                                        <div className="info-box danger">
                                            🚨 <strong>CRITICAL MARGIN CALL:</strong> Your equity is less than 50% of the margin requirement! Immediate action required. In real brokerages, your position may be auto-liquidated.
                                        </div>
                                    )}

                                    {marginCalc.marginStatus === 'OK' && marginCalc.unrealizedPL > 0 && (
                                        <div className="info-box tip">
                                            ✓ Position is profitable and margin is healthy. Consider using a trailing stop to protect your gains while letting profits run.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="calculator-scenarios">
                                <h3>Quick Scenarios to Try</h3>
                                <div className="scenario-buttons">
                                    <button
                                        className="scenario-btn success"
                                        onClick={() => {
                                            setCalcQuantity(100);
                                            setCalcEntryPrice(500);
                                            setCalcCurrentPrice(450);
                                            setCalcAccountBalance(100000);
                                        }}
                                    >
                                        📈 Profitable Short
                                    </button>
                                    <button
                                        className="scenario-btn warning"
                                        onClick={() => {
                                            setCalcQuantity(100);
                                            setCalcEntryPrice(500);
                                            setCalcCurrentPrice(550);
                                            setCalcAccountBalance(100000);
                                        }}
                                    >
                                        📉 Small Loss
                                    </button>
                                    <button
                                        className="scenario-btn danger"
                                        onClick={() => {
                                            setCalcQuantity(100);
                                            setCalcEntryPrice(500);
                                            setCalcCurrentPrice(650);
                                            setCalcAccountBalance(100000);
                                        }}
                                    >
                                        🚨 Margin Call
                                    </button>
                                    <button
                                        className="scenario-btn danger"
                                        onClick={() => {
                                            setCalcQuantity(100);
                                            setCalcEntryPrice(500);
                                            setCalcCurrentPrice(900);
                                            setCalcAccountBalance(100000);
                                        }}
                                    >
                                        💥 Short Squeeze
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                <div className="exit-cta">
                    <h3>Summary: High Risk, High Reward</h3>
                    <p>Short selling is a powerful tool for profiting from declining markets, but it requires discipline, risk management, and constant vigilance. Always use stop-losses, size positions conservatively, and never short more than you can afford to lose.</p>
                    <div className="cta-buttons">
                        <Link to="/education" className="primary-btn">← Back to Education Hub</Link>
                        <Link to="/portfolio" className="primary-btn">Practice in Portfolio →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShortSelling;
