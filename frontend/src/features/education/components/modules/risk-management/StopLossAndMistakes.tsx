import React from 'react';

const StopLossAndMistakes: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">07</span>
                    <h2>Stop Loss Discipline</h2>
                </div>
                <div className="glass-card">
                    <h4>Placement Strategies</h4>
                    <ul>
                        <li>Percentage-based</li>
                        <li>Support-based</li>
                        <li>ATR-based (Volatility)</li>
                    </ul>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">09</span>
                    <h2>Common Risk Mistakes</h2>
                </div>
                <div className="glass-card danger">
                    <ul>
                        <li>Moving stop losses further away</li>
                        <li>Averaging down without a plan</li>
                        <li>Revenge trading after losses</li>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default StopLossAndMistakes;
