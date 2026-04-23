import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import CandleBasics from './CandleBasics';
import SingleCandlePatterns from './SingleCandlePatterns';
import MultiCandlePatterns from './MultiCandlePatterns';
import PatternReliability from './PatternReliability';
import CandleTradingStrategy from './CandleTradingStrategy';
import CandleMistakes from './CandleMistakes';

const ReadingCandles: React.FC = () => {
    return (
        <div className="custom-module-page chart-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Chart Fundamentals</div>
                    <h1>Mastering Candlestick Patterns</h1>
                    <p className="hero-lead">Candlesticks are the language of price action. Each candle tells a story of battle between buyers and sellers. Learn to read these stories and predict future price movements.</p>
                </div>
                <div className="hero-visual">
                    <div className="candle-anatomy-hero">
                        <div className="wick"></div>
                        <div className="body green"></div>
                        <div className="wick"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <CandleBasics />
                <SingleCandlePatterns />
                <MultiCandlePatterns />
                <PatternReliability />
                <CandleTradingStrategy />
                <CandleMistakes />

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">09</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>OHLC tells the story</strong> - Open, High, Low, Close show the complete battle</li>
                            <li>✅ <strong>Body size matters</strong> - Large bodies = conviction, small bodies = indecision</li>
                            <li>✅ <strong>Wicks show rejection</strong> - Long wicks indicate failed attempts to move price</li>
                            <li>✅ <strong>Patterns need context</strong> - Location, trend, and volume determine reliability</li>
                            <li>✅ <strong>Confirmation is crucial</strong> - Wait for the next candle to confirm the pattern</li>
                            <li>✅ <strong>Volume validates patterns</strong> - High volume = strong signal, low volume = weak</li>
                            <li>✅ <strong>Always use stop losses</strong> - Protect yourself when patterns fail</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master Order Types Next</h3>
                    <p>Now that you can read candlesticks, learn how to use different order types to execute your trading strategies effectively.</p>
                    <Link to="/education/order-types" className="primary-btn">Learn Order Types</Link>
                </div>
            </div>
        </div>
    );
};

export default ReadingCandles;
