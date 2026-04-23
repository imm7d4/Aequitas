import React from 'react';

const ExpectancyMetric: React.FC = () => {
    return (
        <section className="guide-section align-right">
            <div className="section-header">
                <span className="step-num">02</span>
                <h2>Expectancy: The Holy Grail Metric</h2>
            </div>
            <p>Expectancy tells you how much you can expect to make (or lose) per trade over the long run.</p>

            <div className="glass-card darker">
                <h3>The Expectancy Formula</h3>
                <div className="formula-box">
                    <p><strong>Expectancy = (Win Rate × Average Win) - (Loss Rate × Average Loss)</strong></p>
                </div>

                <div className="example-grid">
                    <div className="example-item success">
                        <h4>Profitable System</h4>
                        <ul>
                            <li>Win Rate: 40%</li>
                            <li>Average Win: ₹2,000</li>
                            <li>Loss Rate: 60%</li>
                            <li>Average Loss: ₹500</li>
                            <li><strong>Expectancy: +₹500/trade</strong></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExpectancyMetric;
