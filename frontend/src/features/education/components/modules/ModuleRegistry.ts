import HowAequitasWorks from './how-aequitas-works/HowAequitasWorks';
import ShortSelling from './short-selling/ShortSelling';
import ReadingPrices from './reading-prices/ReadingPrices';
import ReadingCandles from './reading-candles/ReadingCandles';
import BeginnerMistakes from './order-types/BeginnerMistakes';
import OrderTypes from './order-types/OrderTypes';
import TradingDiagnostics from './trading-diagnostics/TradingDiagnostics';
import MarginLeverage from './margin-leverage/MarginLeverage';
import OrderBook from './order-book/OrderBook';
import WhyOrdersFail from './why-orders-fail/WhyOrdersFail';
import PLExplained from './p-l-explained/PLExplained';
import RiskManagement from './risk-management/RiskManagement';
import Indicators from './indicators/Indicators';
import VWAPVolume from './vwap-volume/VWAPVolume';
import LiquidityMetrics from './market-microstructure/LiquidityMetrics';
import MarketMicrostructure from './market-microstructure/MarketMicrostructure';
import TradeAnalytics from './trade-analytics/TradeAnalytics';
import Glossary from './glossary/Glossary';

// Register custom modules here
export const CUSTOM_MODULE_COMPONENTS: Record<string, React.FC> = {
    'how-aequitas-works': HowAequitasWorks,
    'short-selling': ShortSelling,
    'reading-prices': ReadingPrices,
    'reading-candles': ReadingCandles,
    'beginner-mistakes': BeginnerMistakes,
    'order-types': OrderTypes,
    'trading-diagnostics': TradingDiagnostics,
    'margin-leverage': MarginLeverage,
    'order-book': OrderBook,
    'why-orders-fail': WhyOrdersFail,
    'pl-explained': PLExplained,
    'risk-management': RiskManagement,
    'indicators': Indicators,
    'vwap-volume': VWAPVolume,
    'liquidity-metrics': LiquidityMetrics,
    'market-microstructure': MarketMicrostructure,
    'trade-analytics': TradeAnalytics,
    'glossary': Glossary,
};

/**
 * Returns a custom component for the given moduleId if it exists.
 */
export function getCustomModule(moduleId: string | null): React.FC | null {
    if (!moduleId) return null;
    return CUSTOM_MODULE_COMPONENTS[moduleId] || null;
}
