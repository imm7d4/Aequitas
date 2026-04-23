import React from 'react';

const LeverageAndOvertrading: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">02</span>
                    <h2>Overleveraging</h2>
                </div>
                <div className="glass-card danger">
                    <p>Leverage kills. 5x leverage means a 2% stock drop = 10% account loss. Use leverage selectively, not by default.</p>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">04</span>
                    <h2>Overtrading</h2>
                </div>
                <div className="glass-card danger">
                    <p>More trades ≠ More profit. Hidden costs (fees, spread, slippage) and poor trade quality destroy capital. Focus on 2-5 high-quality setups daily.</p>
                </div>
            </section>
        </>
    );
};

export default LeverageAndOvertrading;
