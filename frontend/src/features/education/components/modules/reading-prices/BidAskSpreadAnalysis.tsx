import React from 'react';

const BidAskSpreadAnalysis: React.FC = () => {
    return (
        <section className="guide-section align-right">
            <div className="section-header">
                <span className="step-num">02</span>
                <h2>LTP, Bid, and Ask</h2>
            </div>
            <div className="battle-report-anatomy">
                <div className="report-item">
                    <h4>LTP (Last Traded Price)</h4>
                    <p>The historical price of the last execution.</p>
                </div>
                <div className="report-item">
                    <h4>Bid & Ask</h4>
                    <p>Highest buyer price (Bid) vs lowest seller price (Ask).</p>
                </div>
            </div>
            <div className="glass-card darker">
                <h3>The Spread</h3>
                <p>The gap between Bid and Ask. High liquidity = Tight spread. Low liquidity = Wide spread.</p>
                <div className="info-box warning">
                    Wide spreads (Small-caps) increase immediate trading costs.
                </div>
            </div>
        </section>
    );
};

export default BidAskSpreadAnalysis;
