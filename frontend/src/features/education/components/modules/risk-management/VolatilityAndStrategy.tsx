import React from 'react';

const VolatilityAndStrategy: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">06</span>
                    <h2>Bollinger Bands</h2>
                </div>
                <div className="glass-card darker">
                    <p>Price relative to standard deviation bands. Squeeze = breakout potential. Walk = strong trend.</p>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">08</span>
                    <h2>Indicator Mistakes</h2>
                </div>
                <div className="glass-card danger">
                    <ul>
                        <li>Indicator Overload (Analysis Paralysis)</li>
                        <li>Ignoring Price Action (Lagging nature)</li>
                        <li>Fighting strong trends solely based on RSI</li>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default VolatilityAndStrategy;
