import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import MarketOrderGuide from './MarketOrderGuide';
import LimitOrderBasics from './LimitOrderBasics';
import LimitOrderScenarios from './LimitOrderScenarios';
import StopOrderBasics from './StopOrderBasics';
import TrailingStopGuide from './TrailingStopGuide';
import OrderCostCalculator from '../trade-analytics/OrderCostCalculator';
import OrderExecutionExtras from './OrderExecutionExtras';

const OrderTypes: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'market' | 'limit' | 'stop' | 'calculator'>('market');

    return (
        <div className="custom-module-page order-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill success">Core Execution</div>
                    <h1>Order Types & Logic</h1>
                    <p className="hero-lead">An order is an instruction to the matching engine. Choosing the wrong type is like using a hammer when you need a scalpel—you'll pay more and get less precision.</p>
                </div>
                <div className="hero-visual">
                    <div className="order-stack-visual">
                        <div className="layer market">M</div>
                        <div className="layer limit">L</div>
                        <div className="layer stop">S</div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <div className="density-tabs">
                    <button className={activeTab === 'market' ? 'active' : ''} onClick={() => setActiveTab('market')}>Market Orders</button>
                    <button className={activeTab === 'limit' ? 'active' : ''} onClick={() => setActiveTab('limit')}>Limit Orders</button>
                    <button className={activeTab === 'stop' ? 'active' : ''} onClick={() => setActiveTab('stop')}>Stop Orders</button>
                    <button className={activeTab === 'calculator' ? 'active' : ''} onClick={() => setActiveTab('calculator')}>Cost Calculator</button>
                </div>

                {activeTab === 'market' && <MarketOrderGuide />}
                
                {activeTab === 'limit' && (
                    <div className="tab-pane animate-in">
                        <LimitOrderBasics />
                        <LimitOrderScenarios />
                    </div>
                )}
                
                {activeTab === 'stop' && (
                    <div className="tab-pane animate-in">
                        <StopOrderBasics />
                        <TrailingStopGuide />
                    </div>
                )}
                
                {activeTab === 'calculator' && <OrderCostCalculator />}

                <OrderExecutionExtras />

                <div className="exit-cta">
                    <h3>Summary: Precision Matters</h3>
                    <p>Using the right order type is the first step in professional risk management. Practice these in the Aequitas simulator to see how they behave in different market conditions.</p>
                    <div className="cta-buttons">
                        <Link to="/education" className="primary-btn">← Back to Education Hub</Link>
                        <Link to="/portfolio" className="primary-btn">Practice in Portfolio →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTypes;
