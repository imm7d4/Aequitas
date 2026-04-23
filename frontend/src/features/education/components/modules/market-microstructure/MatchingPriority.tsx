import React from 'react';

const MatchingPriority: React.FC = () => {
    return (
        <section className="guide-section">
            <div className="section-header">
                <span className="step-num">03</span>
                <h2>Price-Time Priority</h2>
            </div>
            <p>The fundamental rule: <strong>Best price wins, then earliest time wins.</strong></p>
            <div className="glass-card">
                <h4>Priority Example</h4>
                <ul>
                    <li>1. Best Price (Highest Bid/Lowest Ask)</li>
                    <li>2. Earliest Timestamp (FIFO - First In First Out)</li>
                </ul>
                <div className="info-box tip">
                    Speed matters. 1ms can be the difference between a fill and a miss in HFT environments.
                </div>
            </div>
        </section>
    );
};

export default MatchingPriority;
