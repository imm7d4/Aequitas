import React from 'react';
import '../ModuleStyles.css';
import { OrderBookHero } from './OrderBookHero';
import { DefinitionSection, SnapshotSection } from './OrderBookSections';
import { SpreadSection, DepthSection } from './OrderBookStrategies';
import { PrioritySection, SlippageSection, ImbalanceSection } from './OrderBookMechanics';
import { OrderBookSummary } from './OrderBookSummary';

const OrderBookModule: React.FC = () => {
    return (
        <div className="custom-module-page order-theme">
            <OrderBookHero />

            <div className="content-container">
                <DefinitionSection />
                <SnapshotSection />
                <SpreadSection />
                <DepthSection />
                <PrioritySection />
                <SlippageSection />
                <ImbalanceSection />
                <OrderBookSummary />
            </div>
        </div>
    );
};

export default OrderBookModule;
