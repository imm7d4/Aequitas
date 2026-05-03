import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import { AequitasHero } from './AequitasHero';
import { OrderJourneySection, HeartbeatSection } from './AequitasOrderJourney';
import { SettlementSection, FeesSection } from './AequitasSettlementFees';

const HowAequitasWorks: React.FC = () => {
    return (
        <div className="custom-module-page aequitas-dark">
            <AequitasHero />

            <div className="content-container">
                <OrderJourneySection />
                <HeartbeatSection />
                <SettlementSection />
                <FeesSection />

                <section className="guide-section">
                    <div className="section-header"><span className="step-num">06</span><h2>Data Reliability</h2></div>
                    <div className="glass-card"><h3>📊 Live Prices</h3><p>Live market conditions.</p></div>
                    <div className="glass-card"><h3>🔒 Integrity</h3><p>Trades are permanent.</p></div>
                </section>

                <div className="exit-cta">
                    <h3>Ready to Start Trading?</h3>
                    <p>Master order types and risk management next.</p>
                    <Link to="/education" className="primary-btn">Explore More Modules</Link>
                </div>
            </div>
        </div>
    );
};

export default HowAequitasWorks;
