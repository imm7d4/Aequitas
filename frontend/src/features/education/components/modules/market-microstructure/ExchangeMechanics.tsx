import React from 'react';

const ExchangeMechanics: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">01</span>
                    <h2>What is Market Microstructure?</h2>
                </div>
                <p>Study of how markets operate at the granular level: order placement, matching, and price discovery.</p>
                <div className="glass-card">
                    <h3>The CDA Model</h3>
                    <p>Modern exchanges use <strong>Continuous Double Auction</strong>. Buyers and sellers continuously submit orders; trades happen whenever prices match.</p>
                </div>
            </section>
        </>
    );
};

export default ExchangeMechanics;
