import React from 'react';

export const ProfitableExample: React.FC = () => (
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
                            <div className="calc-row"><span>Position Value:</span><span className="value">200 × ₹1,600 = ₹3,20,000</span></div>
                            <div className="calc-row highlight"><span>Margin Required (20%):</span><span className="value">₹3,20,000 × 0.20 = ₹64,000</span></div>
                        </div>
                    </div>
                </div>
                <div className="step">
                    <div className="step-num">2</div>
                    <div className="step-details">
                        <h5>Price Movement (Day 5)</h5>
                        <p>Stock drops to ₹1,520</p>
                        <div className="calc-breakdown">
                            <div className="calc-row success"><span>Unrealized P&L:</span><span className="value">(₹1,600 - ₹1,520) × 200 = +₹16,000</span></div>
                            <div className="calc-row"><span>Return on Margin:</span><span className="value">₹16,000 / ₹64,000 = 25%</span></div>
                        </div>
                    </div>
                </div>
                <div className="step">
                    <div className="step-num">3</div>
                    <div className="step-details">
                        <h5>Exit (Day 7)</h5>
                        <p>Cover position at ₹1,480</p>
                        <div className="calc-breakdown">
                            <div className="calc-row success"><span>Realized Profit:</span><span className="value">₹3,20,000 - ₹2,96,000 = ₹24,000</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const LossExample: React.FC = () => (
    <div className="example-box danger">
        <h3>Worked Example 2: Loss Scenario with Margin Call</h3>
        <div className="example-scenario">
            <div className="scenario-header"><h4>Setup</h4><p>Stock: TCS</p><p>Account Balance: ₹1,50,000</p></div>
            <div className="scenario-steps">
                <div className="step">
                    <div className="step-num">1</div>
                    <div className="step-details">
                        <h5>Entry</h5><p>Short 100 TCS @ ₹3,500</p>
                        <div className="calc-breakdown">
                            <div className="calc-row"><span>Position Value:</span><span className="value">₹3,50,000</span></div>
                            <div className="calc-row highlight"><span>Margin Blocked:</span><span className="value">₹70,000</span></div>
                        </div>
                    </div>
                </div>
                {/* ... Simplified for brevity in this example file ... */}
                <div className="step">
                    <div className="step-num">5</div>
                    <div className="step-details">
                        <h5>Price Hits ₹4,500 - CRITICAL</h5>
                        <div className="calc-breakdown">
                            <div className="calc-row danger"><span>Unrealized Loss:</span><span className="value">-₹1,00,000</span></div>
                        </div>
                        <div className="info-box danger">🚨 <strong>CRITICAL!</strong> Equity &lt; 50% of margin requirement.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const PartialCoverExample: React.FC = () => (
    <div className="example-box">
        <h3>Worked Example 3: Partial Cover Strategy</h3>
        <div className="scenario-timeline">
            <div className="timeline-step">
                <div className="step-label">Initial Position</div>
                <div className="step-content"><p>Short 300 Infosys @ ₹1,500</p></div>
            </div>
            {/* ... other steps ... */}
        </div>
    </div>
);
