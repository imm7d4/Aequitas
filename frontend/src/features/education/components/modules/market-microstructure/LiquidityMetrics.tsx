import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import LiquidityBasics from './LiquidityBasics';
import MarketImpactAnalysis from './MarketImpactAnalysis';
import OrderBookAnalysis from '../order-book/OrderBookAnalysis';
import LiquidityTakeaways from './LiquidityTakeaways';

const LiquidityMetrics: React.FC = () => {
    return (
        <div className="custom-module-page analytics-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill warning">Market Depth</div>
                    <h1>Liquidity & Market Impact</h1>
                    <p className="hero-lead">Liquidity is the oxygen of the market. When it runs out, prices collapse. Learn to measure market depth, understand impact cost, and avoid liquidity traps.</p>
                </div>
                <div className="hero-visual">
                    <div className="liquidity-visual">
                        <div className="pool-ripple"></div>
                        <div className="depth-gauge"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <LiquidityBasics />
                <MarketImpactAnalysis />
                <OrderBookAnalysis />
                <LiquidityTakeaways />

                <div className="exit-cta">
                    <h3>Liquidity Defines Your Edge</h3>
                    <p>Always check market depth before taking high-leverage positions. Liquidity determines how fast you can get out.</p>
                    <Link to="/education/market-microstructure" className="primary-btn">Learn Market Microstructure</Link>
                </div>
            </div>
        </div>
    );
};

export default LiquidityMetrics;
