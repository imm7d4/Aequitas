import React from 'react';

const PriceTakeaways: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">04</span>
                    <h2>Timeframe Selection</h2>
                </div>
                <div className="timeframe-grid">
                    <p>1m/5m: Intraday scalping. 15m/Daily: Swing/Position. Use "Top-Down Analysis" for best results.</p>
                </div>
            </section>

            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">07</span>
                    <h2>Key Takeaways</h2>
                </div>
                <div className="glass-card darker">
                    <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                        <li>✅ <strong>Market is an auction</strong></li>
                        <li>✅ <strong>Bid-Ask spread is cost</strong></li>
                        <li>✅ <strong>OHLC shows the winner</strong></li>
                        <li>✅ <strong>Volume confirms intent</strong></li>
                        <li>✅ <strong>Multiple timeframes for context</strong></li>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default PriceTakeaways;
