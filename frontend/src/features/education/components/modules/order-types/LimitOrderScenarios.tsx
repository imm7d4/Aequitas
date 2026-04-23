import React from 'react';

const LimitOrderScenarios: React.FC = () => {
    return (
        <>
            <div className="example-box">
                <h3>Scenario 1: The Patient Trader (Successful Fill)</h3>
                <div className="scenario-grid">
                    <div className="scenario-col">
                        <h4>Setup</h4>
                        <p>Stock: Reliance | Current LTP: ₹2,450</p>
                    </div>
                    <div className="scenario-col">
                        <h4>Action</h4>
                        <p>Limit Buy @ ₹2,420</p>
                    </div>
                </div>

                <div className="timeline-walkthrough">
                    <div className="tw-step">
                        <strong>10:30 AM</strong>
                        <p>Order placed. Status: <span className="status-badge pending">PENDING</span></p>
                    </div>
                    <div className="tw-step">
                        <strong>11:45 AM</strong>
                        <p>Market dips! LTP touches ₹2,418. Your order fills at ₹2,418!</p>
                    </div>
                    <div className="tw-step">
                        <strong>Result</strong>
                        <p>Savings: ₹32 per share saved vs buying at ₹2,450.</p>
                    </div>
                </div>
            </div>

            <div className="example-box warning">
                <h3>Scenario 2: The Missed Opportunity (No Fill)</h3>
                <div className="scenario-timeline">
                    <div className="timeline-step">
                        <div className="step-label">Setup</div>
                        <div className="step-content">
                            <p>Stock: Infosys at ₹1,500. You place Limit Buy @ ₹1,490.</p>
                        </div>
                    </div>
                    <div className="timeline-step">
                        <div className="step-label">Market</div>
                        <div className="step-content">
                            <p>Stock dips to ₹1,492... then bounces back.</p>
                        </div>
                    </div>
                    <div className="timeline-step danger">
                        <div className="step-label">Outcome</div>
                        <div className="step-content">
                            <p>Stock closes at ₹1,520. Your order: <span className="status-badge cancelled">CANCELLED</span></p>
                        </div>
                    </div>
                </div>
                <div className="lesson-box">
                    <h4>Why didn't it fill?</h4>
                    <p>Your limit was ₹1,490. LTP reached ₹1,492. Being too aggressive with limit prices can mean missing the trade entirely.</p>
                </div>
            </div>

            <div className="example-box">
                <h3>Scenario 3: Partial Fill</h3>
                <p>Buy 1,000 shares @ ₹800. Only 600 available at that price.</p>
                <div className="partial-fill-visual">
                    <div className="fill-bar">
                        <div className="filled" style={{ width: '60%' }}>600 Filled</div>
                        <div className="pending" style={{ width: '40%' }}>400 Pending</div>
                    </div>
                </div>
                <p>600 execute immediately. 400 stay pending in the queue until validity expires or more sellers arrive.</p>
            </div>
        </>
    );
};

export default LimitOrderScenarios;
