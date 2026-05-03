import React from 'react';
import { Link } from 'react-router-dom';

export const OrderBookHero: React.FC = () => (
    <header className="module-hero">
        <div className="hero-content">
            <Link to="/education" className="back-link">← Education Hub</Link>
            <div className="status-pill success">Market Depth</div>
            <h1>Reading the Order Book & Market Depth</h1>
            <p className="hero-lead">The chart shows history; the Order Book shows the future. Learn to read the intentions of thousands of traders and predict short-term price movements.</p>
        </div>
        <div className="hero-visual">
            <div className="order-book-visual">
                <div className="ask-wall"></div>
                <div className="spread-label">Spread</div>
                <div className="bid-wall"></div>
            </div>
        </div>
    </header>
);
