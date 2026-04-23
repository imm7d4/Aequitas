import React from 'react';

const VolumeProfileDetails: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">04</span>
                    <h2>Volume Profile</h2>
                </div>
                <div className="glass-card">
                    <p>Shows volume AT PRICE levels. Key concept: <strong>POC (Point of Control)</strong> - price where most trading happened. Acts as a magnet.</p>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">06</span>
                    <h2>Volume Techniques</h2>
                </div>
                <div className="glass-card darker">
                    <p>Bullish: Volume up on green candles. Bearish: Volume up on red candles. <strong>Volume Climax</strong>: Massive spike with small price move = Absorption.</p>
                </div>
            </section>
        </>
    );
};

export default VolumeProfileDetails;
