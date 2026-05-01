import React from 'react';

const ShortSellingBasics: React.FC = () => {
    return (
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
    );
};

export default ShortSellingBasics;
