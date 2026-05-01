import React from 'react';

const PriceActionDetails: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">03</span>
                    <h2>OHLC: The Battle Report</h2>
                </div>
                <div className="battle-report-anatomy">
                    <p>Open, High, Low, Close. Close &gt; Open = Buyers won (Green). Close &lt; Open = Sellers won (Red).</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">06</span>
                    <h2>Price Action Signals</h2>
                </div>
                <div className="glass-card">
                    <p>Higher Highs & Higher Lows = Uptrend. Lower Highs & Lower Lows = Downtrend.</p>
                </div>
                <div className="glass-card darker">
                    <h4>Volume Confirmation</h4>
                    <p>Price move + High volume = Significant move. Price move + Low volume = Possible false signal.</p>
                </div>
            </section>
        </>
    );
};

export default PriceActionDetails;
