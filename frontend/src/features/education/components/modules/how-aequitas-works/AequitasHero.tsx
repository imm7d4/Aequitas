import React from 'react';
import { Link } from 'react-router-dom';

export const AequitasHero: React.FC = () => (
    <header className="module-hero">
        <div className="hero-content">
            <Link to="/education" className="back-link">← Education Hub</Link>
            <div className="status-pill">Platform Fundamentals</div>
            <h1>How Modern Trading Platforms Work</h1>
            <p className="hero-lead">Understanding the journey of your order from click to execution. Learn how Aequitas processes trades, manages your capital, and ensures fair execution in real-time.</p>
        </div>
        <div className="hero-visual">
            <div className="order-flow-visual">
                <div className="flow-step"><div className="flow-icon click">📱</div><div className="flow-label">Click</div></div>
                <div className="flow-arrow">→</div>
                <div className="flow-step"><div className="flow-icon validate">✓</div><div className="flow-label">Validate</div></div>
                <div className="flow-arrow">→</div>
                <div className="flow-step"><div className="flow-icon execute">⚡</div><div className="flow-label">Execute</div></div>
            </div>
            <div className="heartbeat-pulse"></div>
        </div>
    </header>
);
