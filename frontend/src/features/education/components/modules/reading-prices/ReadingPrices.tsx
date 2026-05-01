import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import AuctionModelBasics from './AuctionModelBasics';
import BidAskSpreadAnalysis from './BidAskSpreadAnalysis';
import PriceActionDetails from './PriceActionDetails';
import PriceTakeaways from './PriceTakeaways';

const ReadingPrices: React.FC = () => {
    return (
        <div className="custom-module-page chart-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Market Psychology</div>
                    <h1>Reading Prices & Charts</h1>
                    <p className="hero-lead">Prices tell stories of supply, demand, and human psychology. Master the art of reading market prices, understanding bid-ask dynamics, and interpreting what the market is saying.</p>
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
                <AuctionModelBasics />
                <BidAskSpreadAnalysis />
                <PriceActionDetails />
                <PriceTakeaways />

                <div className="exit-cta">
                    <h3>Master the Candlesticks Next</h3>
                    <p>Now that you understand how prices form, learn to read candlestick patterns to predict future price movements.</p>
                    <Link to="/education/reading-candles" className="primary-btn">Learn Candlestick Patterns</Link>
                </div>
            </div>
        </div>
    );
};

export default ReadingPrices;
