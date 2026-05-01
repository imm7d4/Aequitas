import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import ShortSellingBasics from './ShortSellingBasics';
import ShortSellingMath from './ShortSellingMath';
import ShortSellingRisk from './ShortSellingRisk';
import ShortSellingCalculator from './ShortSellingCalculator';

const ShortSelling: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'basics' | 'math' | 'risk' | 'calculator'>('basics');

    return (
        <div className="custom-module-page short-selling-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill warning">Advanced Mechanics</div>
                    <h1>Short Selling Deep-Dive</h1>
                    <p className="hero-lead">Profit from the fall. Master the mechanics of synthetic inventory, borrowed exposure, and the critical math of equity inversion. Short selling is high-risk, high-reward—learn to manage both.</p>
                </div>
                <div className="hero-visual">
                    <div className="arrow-down-visual"></div>
                </div>
            </header>

            <div className="content-container">
                <div className="density-tabs">
                    <button className={activeTab === 'basics' ? 'active' : ''} onClick={() => setActiveTab('basics')}>The Mechanism</button>
                    <button className={activeTab === 'math' ? 'active' : ''} onClick={() => setActiveTab('math')}>Financial Math</button>
                    <button className={activeTab === 'risk' ? 'active' : ''} onClick={() => setActiveTab('risk')}>Risk & Protection</button>
                    <button className={activeTab === 'calculator' ? 'active' : ''} onClick={() => setActiveTab('calculator')}>Margin Calculator</button>
                </div>

                {activeTab === 'basics' && <ShortSellingBasics />}
                {activeTab === 'math' && <ShortSellingMath />}
                {activeTab === 'risk' && <ShortSellingRisk />}
                {activeTab === 'calculator' && <ShortSellingCalculator />}

                <div className="exit-cta">
                    <h3>Summary: High Risk, High Reward</h3>
                    <p>Short selling is a powerful tool for profiting from declining markets, but it requires discipline, risk management, and constant vigilance. Always use stop-losses, size positions conservatively, and never short more than you can afford to lose.</p>
                    <div className="cta-buttons">
                        <Link to="/education" className="primary-btn">← Back to Education Hub</Link>
                        <Link to="/portfolio" className="primary-btn">Practice in Portfolio →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShortSelling;
