import React from 'react';

const ParticipantDetails: React.FC = () => {
    return (
        <section className="guide-section align-right">
            <div className="section-header">
                <span className="step-num">04</span>
                <h2>Market Participants</h2>
            </div>
            <div className="glass-card darker">
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div className="participant info">
                        <h4>1. Retail Traders</h4>
                        <p>Profit from moves. Collective volume.</p>
                    </div>
                    <div className="participant success">
                        <h4>2. Market Makers</h4>
                        <p>Spread profit. Provide liquidity.</p>
                    </div>
                    <div className="participant primary">
                        <h4>3. Institutional</h4>
                        <p>Large size. VWAP/Algo execution.</p>
                    </div>
                    <div className="participant warning">
                        <h4>4. HFT</h4>
                        <p>Arbitrage. Microsecond speed.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ParticipantDetails;
