import HowAequitasWorks from './HowAequitasWorks';
import ShortSelling from './ShortSelling';
import ReadingPrices from './ReadingPrices';
import ReadingCandles from './ReadingCandles';
import BeginnerMistakes from './BeginnerMistakes';
import OrderTypes from './OrderTypes';
import TradingDiagnostics from './TradingDiagnostics';
import MarginLeverage from './MarginLeverage';
import OrderBook from './OrderBook';
import WhyOrdersFail from './WhyOrdersFail';
import PLExplained from './PLExplained';
import RiskManagement from './RiskManagement';
import Indicators from './Indicators';
import VWAPVolume from './VWAPVolume';
import LiquidityMetrics from './LiquidityMetrics';
import MarketMicrostructure from './MarketMicrostructure';
import TradeAnalytics from './TradeAnalytics';
import Glossary from './Glossary';

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
