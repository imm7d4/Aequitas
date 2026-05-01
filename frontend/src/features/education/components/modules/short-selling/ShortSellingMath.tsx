import React from 'react';

const ShortSellingMath: React.FC = () => {
    return (
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
    );
};

export default ShortSellingMath;
