import React from 'react';

const ShortSellingAndAveraging: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">06</span>
                    <h2>Averaging Positions</h2>
                </div>
                <div className="glass-card">
                    <p>Average Entry Price = Total Cost ÷ Total Shares.</p>
                    <p>Essential when buying more shares at different prices (averaging down/up).</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">07</span>
                    <h2>Short Selling P&L</h2>
                </div>
                <div className="glass-card danger">
                    <h3>The Formula (Reverse)</h3>
                    <p style={{ textAlign: 'center' }}><strong>(Entry Price - Exit Price) × Quantity</strong></p>
                    <p>You profit when price falls, lose when price rises.</p>
                </div>
            </section>
        </>
    );
};

export default ShortSellingAndAveraging;
