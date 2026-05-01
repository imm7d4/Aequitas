import React from 'react';

const LeverageConcepts: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">01</span>
                    <h2>What is Leverage?</h2>
                </div>
                <p>Controlling a larger position than your actual cash (borrowing from broker). 5x Leverage = controlling ₹5L with ₹1L cash.</p>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">02</span>
                    <h2>Calculating Buying Power</h2>
                </div>
                <div className="glass-card darker">
                    <p style={{ textAlign: 'center' }}><strong>Buying Power = Cash × Leverage Multiplier</strong></p>
                    <div className="info-box warning">
                        Just because you CAN use 5x doesn't mean you SHOULD.
                    </div>
                </div>
            </section>
        </>
    );
};

export default LeverageConcepts;
