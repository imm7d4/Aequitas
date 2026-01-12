package services

import (
	"context"
	"math"
	"sort"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type DashboardService struct {
	portfolioRepo  *repositories.PortfolioRepository
	tradeRepo      *repositories.TradeRepository
	accountService *TradingAccountService
	marketService  *MarketService
	marketDataRepo *repositories.MarketDataRepository
}

func NewDashboardService(
	portfolioRepo *repositories.PortfolioRepository,
	tradeRepo *repositories.TradeRepository,
	accountService *TradingAccountService,
	marketService *MarketService,
	marketDataRepo *repositories.MarketDataRepository,
) *DashboardService {
	return &DashboardService{
		portfolioRepo:  portfolioRepo,
		tradeRepo:      tradeRepo,
		accountService: accountService,
		marketService:  marketService,
		marketDataRepo: marketDataRepo,
	}
}

// DashboardSummary represents the complete dashboard data
type DashboardSummary struct {
	PerformanceOverview   PerformanceOverview   `json:"performanceOverview"`
	TradingAnalysis       TradingAnalysis       `json:"tradingAnalysis"`
	BehavioralInsights    BehavioralInsights    `json:"behavioralInsights"`
	MarketIntelligence    MarketIntelligence    `json:"marketIntelligence"`
	PortfolioDistribution PortfolioDistribution `json:"portfolioDistribution"`
}

type PerformanceOverview struct {
	TotalEquity   float64 `json:"totalEquity"`
	CashBalance   float64 `json:"cashBalance"`
	HoldingsValue float64 `json:"holdingsValue"`
	RealizedPL    float64 `json:"realizedPL"`
	UnrealizedPL  float64 `json:"unrealizedPL"`
	ProfitFactor  float64 `json:"profitFactor"`
}

type TradingAnalysis struct {
	WinCount    int     `json:"winCount"`
	LossCount   int     `json:"lossCount"`
	WinRate     float64 `json:"winRate"`
	AvgWin      float64 `json:"avgWin"`
	AvgLoss     float64 `json:"avgLoss"`
	LargestWin  float64 `json:"largestWin"`
	LargestLoss float64 `json:"largestLoss"`
	TotalTrades int     `json:"totalTrades"`
}

type BehavioralInsights struct {
	WinRateByTimeOfDay map[string]float64 `json:"winRateByTimeOfDay"`
	WinRateByDayOfWeek map[string]float64 `json:"winRateByDayOfWeek"`
	AvgHoldingDuration HoldingDuration    `json:"avgHoldingDuration"`
}

type HoldingDuration struct {
	WinningTrades float64 `json:"winningTrades"` // in hours
	LosingTrades  float64 `json:"losingTrades"`  // in hours
}

type MarketIntelligence struct {
	TopGainers []SmartStock `json:"topGainers"`
	TopLosers  []SmartStock `json:"topLosers"`
}

type SmartStock struct {
	InstrumentID string  `json:"instrumentId"`
	Symbol       string  `json:"symbol"`
	Name         string  `json:"name"`
	LastPrice    float64 `json:"lastPrice"`
	ChangePct    float64 `json:"changePct"`
	VolumeSurge  float64 `json:"volumeSurge"`
	VWAPDistance string  `json:"vwapDistance"` // "Above" or "Below"
	BreakoutFlag string  `json:"breakoutFlag"` // "Breakout", "Breakdown", or ""
	NewsFlag     string  `json:"newsFlag"`     // Placeholder for future integration
}

type PortfolioDistribution struct {
	CashBalance      float64            `json:"cashBalance"`
	HoldingsValue    float64            `json:"holdingsValue"`
	ActivePositions  int                `json:"activePositions"`
	HoldingsBySymbol []HoldingBreakdown `json:"holdingsBySymbol"`
}

type HoldingBreakdown struct {
	Symbol       string  `json:"symbol"`
	Quantity     int     `json:"quantity"`
	CurrentValue float64 `json:"currentValue"`
	UnrealizedPL float64 `json:"unrealizedPL"`
}

// GetDashboardSummary aggregates all dashboard data
func (s *DashboardService) GetDashboardSummary(
	ctx context.Context,
	userID string,
) (*DashboardSummary, error) {
	// Get account
	account, err := s.accountService.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	// Get holdings
	holdings, err := s.portfolioRepo.GetHoldings(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Get trades
	trades, err := s.tradeRepo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}

	// Calculate performance overview
	perfOverview := s.calculatePerformanceOverview(account, holdings)

	// Calculate trading analysis
	tradingAnalysis := s.calculateTradingAnalysis(trades)

	// Calculate behavioral insights
	behavioralInsights := s.calculateBehavioralInsights(trades)

	// Get market intelligence
	marketIntel, err := s.getMarketIntelligence(ctx)
	if err != nil {
		// Log error but don't fail the entire request
		marketIntel = &MarketIntelligence{
			TopGainers: []SmartStock{},
			TopLosers:  []SmartStock{},
		}
	}

	// Calculate portfolio distribution
	portfolioDist := s.calculatePortfolioDistribution(account, holdings)

	return &DashboardSummary{
		PerformanceOverview:   perfOverview,
		TradingAnalysis:       tradingAnalysis,
		BehavioralInsights:    behavioralInsights,
		MarketIntelligence:    *marketIntel,
		PortfolioDistribution: portfolioDist,
	}, nil
}

func (s *DashboardService) calculatePerformanceOverview(
	account *models.TradingAccount,
	holdings []models.Holding,
) PerformanceOverview {
	cashBalance := account.Balance
	realizedPL := account.RealizedPL

	// Calculate holdings value and unrealized P&L
	var holdingsValue float64
	var unrealizedPL float64

	// Get current prices for all holdings
	var instrumentIDs []string
	for _, h := range holdings {
		if h.Quantity > 0 {
			instrumentIDs = append(instrumentIDs, h.InstrumentID.Hex())
		}
	}

	if len(instrumentIDs) > 0 {
		prices, _ := s.marketService.GetBatchPrices(instrumentIDs)
		priceMap := make(map[string]float64)
		for _, p := range prices {
			priceMap[p.InstrumentID.Hex()] = p.LastPrice
		}

		for _, h := range holdings {
			if h.Quantity > 0 {
				currentPrice, ok := priceMap[h.InstrumentID.Hex()]
				if !ok {
					currentPrice = h.AvgCost // Fallback
				}
				currentValue := float64(h.Quantity) * currentPrice
				holdingsValue += currentValue
				unrealizedPL += currentValue - h.TotalCost
			}
		}
	}

	totalEquity := cashBalance + holdingsValue

	// Calculate profit factor (Gross Profit / Gross Loss)
	profitFactor := 0.0
	if realizedPL != 0 {
		// This is a simplified calculation
		// Ideally we'd sum all winning trades vs losing trades
		profitFactor = math.Abs(realizedPL)
	}

	return PerformanceOverview{
		TotalEquity:   totalEquity,
		CashBalance:   cashBalance,
		HoldingsValue: holdingsValue,
		RealizedPL:    realizedPL,
		UnrealizedPL:  unrealizedPL,
		ProfitFactor:  profitFactor,
	}
}

func (s *DashboardService) calculateTradingAnalysis(
	trades []*models.Trade,
) TradingAnalysis {
	if len(trades) == 0 {
		return TradingAnalysis{}
	}

	var winCount, lossCount int
	var totalWin, totalLoss float64
	var largestWin, largestLoss float64

	// Track P&L by symbol using a map to accumulate buys and sells
	symbolCost := make(map[string]float64)
	symbolQty := make(map[string]int)

	// Process trades in chronological order
	for _, trade := range trades {
		symbol := trade.Symbol

		if trade.Side == "BUY" {
			// Accumulate cost
			symbolCost[symbol] += trade.Value
			symbolQty[symbol] += trade.Quantity
		} else if trade.Side == "SELL" {
			// Calculate average cost per share
			avgCost := 0.0
			if symbolQty[symbol] > 0 {
				avgCost = symbolCost[symbol] / float64(symbolQty[symbol])
			}

			// Calculate P&L for this sell
			costOfSold := avgCost * float64(trade.Quantity)
			pl := trade.NetValue - costOfSold

			// Track individual trade P&L
			if pl > 0 {
				winCount++
				totalWin += pl
				if pl > largestWin {
					largestWin = pl
				}
			} else if pl < 0 {
				lossCount++
				totalLoss += math.Abs(pl)
				if math.Abs(pl) > largestLoss {
					largestLoss = math.Abs(pl)
				}
			}

			// Update remaining cost and quantity
			symbolQty[symbol] -= trade.Quantity
			if symbolQty[symbol] > 0 {
				symbolCost[symbol] -= costOfSold
			} else {
				symbolCost[symbol] = 0
			}
		}
	}

	totalTrades := winCount + lossCount
	winRate := 0.0
	if totalTrades > 0 {
		winRate = float64(winCount) / float64(totalTrades) * 100
	}

	avgWin := 0.0
	if winCount > 0 {
		avgWin = totalWin / float64(winCount)
	}

	avgLoss := 0.0
	if lossCount > 0 {
		avgLoss = totalLoss / float64(lossCount)
	}

	return TradingAnalysis{
		WinCount:    winCount,
		LossCount:   lossCount,
		WinRate:     winRate,
		AvgWin:      avgWin,
		AvgLoss:     avgLoss,
		LargestWin:  largestWin,
		LargestLoss: largestLoss,
		TotalTrades: totalTrades,
	}
}

func (s *DashboardService) calculateBehavioralInsights(
	trades []*models.Trade,
) BehavioralInsights {
	winRateByTime := make(map[string]float64)
	winRateByDay := make(map[string]float64)

	// Time slots
	timeSlots := map[string][2]int{
		"Opening": {9, 11},  // 9:15 AM - 11:00 AM
		"Midday":  {11, 14}, // 11:00 AM - 2:00 PM
		"Closing": {14, 16}, // 2:00 PM - 3:30 PM
	}

	// Count wins/losses by time and day
	timeWins := make(map[string]int)
	timeLosses := make(map[string]int)
	dayWins := make(map[string]int)
	dayLosses := make(map[string]int)

	var winDurations, lossDurations []float64

	// Track cost basis for proper P&L calculation
	symbolCost := make(map[string]float64)
	symbolQty := make(map[string]int)

	for _, trade := range trades {
		symbol := trade.Symbol

		if trade.Side == "BUY" {
			// Accumulate cost
			symbolCost[symbol] += trade.Value
			symbolQty[symbol] += trade.Quantity
		} else if trade.Side == "SELL" {
			hour := trade.ExecutedAt.Hour()
			dayName := trade.ExecutedAt.Weekday().String()

			// Determine time slot
			var slot string
			for slotName, hours := range timeSlots {
				if hour >= hours[0] && hour < hours[1] {
					slot = slotName
					break
				}
			}

			// Calculate P&L properly
			avgCost := 0.0
			if symbolQty[symbol] > 0 {
				avgCost = symbolCost[symbol] / float64(symbolQty[symbol])
			}
			costOfSold := avgCost * float64(trade.Quantity)
			pl := trade.NetValue - costOfSold
			isWin := pl > 0

			// Update time-based stats
			if slot != "" {
				if isWin {
					timeWins[slot]++
				} else {
					timeLosses[slot]++
				}
			}

			// Update day-based stats
			if isWin {
				dayWins[dayName]++
			} else {
				dayLosses[dayName]++
			}

			// Calculate holding duration (simplified - would need buy time)
			// For now, use a placeholder
			duration := 24.0 // hours
			if isWin {
				winDurations = append(winDurations, duration)
			} else {
				lossDurations = append(lossDurations, duration)
			}

			// Update remaining cost and quantity
			symbolQty[symbol] -= trade.Quantity
			if symbolQty[symbol] > 0 {
				symbolCost[symbol] -= costOfSold
			} else {
				symbolCost[symbol] = 0
			}
		}
	}

	// Calculate win rates
	for slot := range timeSlots {
		total := timeWins[slot] + timeLosses[slot]
		if total > 0 {
			winRateByTime[slot] = float64(timeWins[slot]) / float64(total) * 100
		}
	}

	days := []string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"}
	for _, day := range days {
		total := dayWins[day] + dayLosses[day]
		if total > 0 {
			winRateByDay[day] = float64(dayWins[day]) / float64(total) * 100
		}
	}

	// Calculate average durations
	avgWinDuration := average(winDurations)
	avgLossDuration := average(lossDurations)

	return BehavioralInsights{
		WinRateByTimeOfDay: winRateByTime,
		WinRateByDayOfWeek: winRateByDay,
		AvgHoldingDuration: HoldingDuration{
			WinningTrades: avgWinDuration,
			LosingTrades:  avgLossDuration,
		},
	}
}

func (s *DashboardService) getMarketIntelligence(
	ctx context.Context,
) (*MarketIntelligence, error) {
	// Get all market data
	allData, err := s.marketDataRepo.GetAll(ctx)
	if err != nil {
		// Return empty data instead of error to prevent dashboard crash
		return &MarketIntelligence{
			TopGainers: []SmartStock{},
			TopLosers:  []SmartStock{},
		}, nil
	}

	// Handle empty data
	if len(allData) == 0 {
		return &MarketIntelligence{
			TopGainers: []SmartStock{},
			TopLosers:  []SmartStock{},
		}, nil
	}

	// Sort by change percentage
	sort.Slice(allData, func(i, j int) bool {
		return allData[i].ChangePct > allData[j].ChangePct
	})

	// Get top 5 gainers
	topGainers := []SmartStock{}
	for i := 0; i < 5 && i < len(allData); i++ {
		if allData[i].ChangePct > 0 {
			topGainers = append(topGainers, s.toSmartStock(allData[i]))
		}
	}

	// Get top 5 losers (reverse sort)
	topLosers := []SmartStock{}
	for i := len(allData) - 1; i >= 0 && len(topLosers) < 5; i-- {
		if allData[i].ChangePct < 0 {
			topLosers = append(topLosers, s.toSmartStock(allData[i]))
		}
	}

	return &MarketIntelligence{
		TopGainers: topGainers,
		TopLosers:  topLosers,
	}, nil
}

func (s *DashboardService) toSmartStock(data *models.MarketData) SmartStock {
	// Calculate volume surge (placeholder - would need historical avg)
	volumeSurge := 0.0 // TODO: Implement volume comparison

	// Calculate VWAP distance (placeholder)
	vwapDistance := "Above"
	if data.LastPrice < data.PrevClose {
		vwapDistance = "Below"
	}

	// Determine breakout/breakdown (simplified)
	breakoutFlag := ""
	if data.ChangePct > 5 {
		breakoutFlag = "Breakout"
	} else if data.ChangePct < -5 {
		breakoutFlag = "Breakdown"
	}

	return SmartStock{
		InstrumentID: data.InstrumentID.Hex(),
		Symbol:       data.Symbol,
		Name:         data.Symbol, // TODO: Get actual name from instrument
		LastPrice:    data.LastPrice,
		ChangePct:    data.ChangePct,
		VolumeSurge:  volumeSurge,
		VWAPDistance: vwapDistance,
		BreakoutFlag: breakoutFlag,
		NewsFlag:     "", // Placeholder for future news integration
	}
}

func (s *DashboardService) calculatePortfolioDistribution(
	account *models.TradingAccount,
	holdings []models.Holding,
) PortfolioDistribution {
	cashBalance := account.Balance
	var holdingsValue float64
	activePositions := 0
	var holdingBreakdowns []HoldingBreakdown

	// Get current prices
	var instrumentIDs []string
	for _, h := range holdings {
		if h.Quantity > 0 {
			instrumentIDs = append(instrumentIDs, h.InstrumentID.Hex())
		}
	}

	if len(instrumentIDs) > 0 {
		prices, _ := s.marketService.GetBatchPrices(instrumentIDs)
		priceMap := make(map[string]float64)
		for _, p := range prices {
			priceMap[p.InstrumentID.Hex()] = p.LastPrice
		}

		for _, h := range holdings {
			if h.Quantity > 0 {
				activePositions++
				currentPrice, ok := priceMap[h.InstrumentID.Hex()]
				if !ok {
					currentPrice = h.AvgCost
				}
				currentValue := float64(h.Quantity) * currentPrice
				holdingsValue += currentValue

				holdingBreakdowns = append(holdingBreakdowns, HoldingBreakdown{
					Symbol:       h.Symbol,
					Quantity:     h.Quantity,
					CurrentValue: currentValue,
					UnrealizedPL: currentValue - h.TotalCost,
				})
			}
		}
	}

	return PortfolioDistribution{
		CashBalance:      cashBalance,
		HoldingsValue:    holdingsValue,
		ActivePositions:  activePositions,
		HoldingsBySymbol: holdingBreakdowns,
	}
}

// Helper function
func average(values []float64) float64 {
	if len(values) == 0 {
		return 0
	}
	sum := 0.0
	for _, v := range values {
		sum += v
	}
	return sum / float64(len(values))
}
