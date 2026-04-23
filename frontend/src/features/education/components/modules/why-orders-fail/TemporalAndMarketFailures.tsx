import React from 'react';

const TemporalAndMarketFailures: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">05</span>
                    <h2>Reason 5: Validity Expired</h2>
                </div>
                <div className="glass-card danger">
                    <h3>❌ IOC & DAY Orders</h3>
                    <p>IOC auto-cancels if not filled immediately (3s). DAY expires at market close (3:30 PM).</p>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">06</span>
                    <h2>Reason 6: Market Closed</h2>
                </div>
                <div className="glass-card danger">
                    <p>Market Hours: 9:15 AM - 3:30 PM. Overnight orders face gap risk.</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">07</span>
                    <h2>Reason 7: Circuit Breakers</h2>
                </div>
                <div className="glass-card danger">
                    <p>Exchanges halt trading temporarily if stocks move too fast (10-20% daily limits).</p>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">08</span>
                    <h2>Reason 8: Stop Orders Not Triggered</h2>
                </div>
                <div className="glass-card danger">
                    <p>Stop orders only wake up when trigger price is hit. Otherwise they stay PENDING.</p>
                </div>
            </section>
        </>
    );
};

export default TemporalAndMarketFailures;
