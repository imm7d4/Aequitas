import React from 'react';

const AuctionModelBasics: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">01</span>
                    <h2>The Auction Model</h2>
                </div>
                <p>The market is a <strong>continuous double auction</strong>. Buyers and sellers negotiation creates fair value.</p>
                <div className="glass-card">
                    <h3>Supply & Demand in Action</h3>
                    <p>Price rises when buyers outbid each other for limited supply. Price falls when sellers underbid for limited demand.</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">05</span>
                    <h2>Price Gaps</h2>
                </div>
                <div className="glass-card darker">
                    <p>Prices can "gap" overnight or during news, jumping from ₹500 to ₹520 without trading in between. Gaps can making stop losses less effective.</p>
                </div>
            </section>
        </>
    );
};

export default AuctionModelBasics;
