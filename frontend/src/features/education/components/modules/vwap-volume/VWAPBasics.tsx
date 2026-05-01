import React from 'react';

const VWAPBasics: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">01</span>
                    <h2>What is VWAP?</h2>
                </div>
                <p><strong>Volume Weighted Average Price</strong>: The average price a stock traded throughout the day, weighted by volume. True average price paid.</p>
                <div className="glass-card">
                    <h3>Institutional Benchmark</h3>
                    <p>Fund managers are judged by buying below or selling above VWAP. It defines "fair value" for the day.</p>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <p style={{ textAlign: 'center' }}><strong>Σ (Price × Volume) / Σ Volume</strong></p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default VWAPBasics;
