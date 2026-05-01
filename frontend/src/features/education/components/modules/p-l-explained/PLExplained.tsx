import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import PLTypes from './PLTypes';
import PLCalculations from './PLCalculations';
import FeeAndSlippageImpact from './FeeAndSlippageImpact';
import ShortSellingAndAveraging from './ShortSellingAndAveraging';
import PLSummaryAndTakeaways from './PLSummaryAndTakeaways';

const PLExplained: React.FC = () => {
    return (
        <div className="custom-module-page margin-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Financial Literacy</div>
                    <h1>Understanding Profit & Loss (P&L)</h1>
                    <p className="hero-lead">Master the math behind trading. Learn realized vs unrealized P&L, fee calculations, and how to accurately track your trading performance.</p>
                </div>
                <div className="hero-visual">
                    <div className="pl-visual">
                        <div className="floating-bubble">Unrealized</div>
                        <div className="locked-box">Realized</div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <PLTypes />
                <PLCalculations />
                <FeeAndSlippageImpact />
                <ShortSellingAndAveraging />

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Intraday vs Delivery P&L</h2>
                    </div>
                    <div className="glass-card">
                        <p>Settlement timing differs: Intraday (T+0) vs Delivery (T+2). Calculation remains identical.</p>
                    </div>
                </section>

                <PLSummaryAndTakeaways />

                <div className="exit-cta">
                    <h3>Master Margin & Leverage Next</h3>
                    <p>Now that you understand P&L, learn how leverage amplifies both profits and losses.</p>
                    <Link to="/education/margin-leverage" className="primary-btn">Learn Margin & Leverage</Link>
                </div>
            </div>
        </div>
    );
};

export default PLExplained;
