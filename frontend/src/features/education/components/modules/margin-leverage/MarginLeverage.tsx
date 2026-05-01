import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import LeverageConcepts from './LeverageConcepts';
import MarginRules from './MarginRules';
import LeverageMathExamples from './LeverageMathExamples';
import LeverageGuidelinesSummary from './LeverageGuidelinesSummary';

const MarginLeverage: React.FC = () => {
    return (
        <div className="custom-module-page margin-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill warning">Capital Efficiency</div>
                    <h1>Understanding Margin & Leverage</h1>
                    <p className="hero-lead">Leverage is a double-edged sword. It amplifies both profits and losses. Learn how 5x leverage works and how to use it safely.</p>
                </div>
                <div className="hero-visual">
                    <div className="leverage-visual">
                        <div className="fulcrum"></div>
                        <div className="lever-arm">
                            <span className="weight capital">1x Cash</span>
                            <span className="weight exposure">5x Power</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <LeverageConcepts />
                <MarginRules />
                <LeverageMathExamples />
                <LeverageGuidelinesSummary />

                <div className="exit-cta">
                    <h3>Learn Short Selling Next</h3>
                    <p>Now that you understand leverage, learn how to profit from falling prices through short selling.</p>
                    <Link to="/education/short-selling" className="primary-btn">Learn Short Selling</Link>
                </div>
            </div>
        </div>
    );
};

export default MarginLeverage;
