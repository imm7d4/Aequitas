package services

import (
	"context"
	"log"
	"math"
	"math/rand"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type MarketRegime string

const (
	RegimeTrendingUp    MarketRegime = "TRENDING_UP"
	RegimeTrendingDown  MarketRegime = "TRENDING_DOWN"
	RegimeSideways      MarketRegime = "SIDEWAYS"
	RegimeHighVolatility MarketRegime = "HIGH_VOLATILITY"
)

type alertRequest struct {
	instrumentID string
	lastPrice    float64
}

type PricingService struct {
	instrumentRepo    *repositories.InstrumentRepository
	marketDataRepo    *repositories.MarketDataRepository
	candleRepo        *repositories.CandleRepository
	candleBuilder     *CandleBuilder
	priceAlertService *PriceAlertService
	stopChan          chan struct{}
	rng               *rand.Rand
	regimes           map[string]MarketRegime
	regimeExpiries    map[string]time.Time
	lastMoves         map[string]float64
	priceHistory      map[string][]float64
	ema               map[string]float64
	alertChan         chan alertRequest
}

func NewPricingService(
	instrumentRepo *repositories.InstrumentRepository,
	marketDataRepo *repositories.MarketDataRepository,
	candleRepo *repositories.CandleRepository,
	candleBuilder *CandleBuilder,
	priceAlertService *PriceAlertService,
) *PricingService {
	// Create a new random source with current time seed for varied randomness
	source := rand.NewSource(time.Now().UnixNano())
	return &PricingService{
		instrumentRepo:    instrumentRepo,
		marketDataRepo:    marketDataRepo,
		candleRepo:        candleRepo,
		candleBuilder:     candleBuilder,
		priceAlertService: priceAlertService,
		stopChan:          make(chan struct{}),
		rng:               rand.New(source),
		regimes:           make(map[string]MarketRegime),
		regimeExpiries:    make(map[string]time.Time),
		lastMoves:         make(map[string]float64),
		priceHistory:      make(map[string][]float64),
		ema:               make(map[string]float64),
		alertChan:         make(chan alertRequest, 1000), // Buffer for alerts
	}
}

func (s *PricingService) Start() {
	ticker := time.NewTicker(3 * time.Second)

	// Start Alert Workers to prevent goroutine leak
	for i := 0; i < 5; i++ {
		go s.alertWorker()
	}

	go func() {
		for {
			select {
			case <-ticker.C:
				s.simulatePrices()
			case <-s.stopChan:
				ticker.Stop()
				return
			}
		}
	}()
	log.Println("Pricing engine started (polling 3s with Insane Realism & Worker Pool)")
}

func (s *PricingService) alertWorker() {
	for {
		select {
		case req := <-s.alertChan:
			if s.priceAlertService != nil {
				s.priceAlertService.CheckAlerts(context.Background(), req.instrumentID, req.lastPrice)
			}
		case <-s.stopChan:
			return
		}
	}
}

func (s *PricingService) getNextRegime(current MarketRegime) MarketRegime {
	r := s.rng.Float64()

	switch current {
	case RegimeTrendingUp:
		switch {
		case r < 0.75:
			return RegimeTrendingUp // Persistence
		case r < 0.90:
			return RegimeSideways
		default:
			return RegimeHighVolatility
		}
	case RegimeTrendingDown:
		switch {
		case r < 0.70:
			return RegimeTrendingDown // Persistence
		case r < 0.85:
			return RegimeSideways
		case r < 0.95:
			return RegimeHighVolatility
		default:
			return RegimeTrendingUp // Sudden reversal
		}
	case RegimeSideways:
		switch {
		case r < 0.50:
			return RegimeSideways // Long boring periods
		case r < 0.75:
			return RegimeTrendingUp
		case r < 1.00:
			return RegimeTrendingDown // 25% each way (Balanced Sideways)
		default:
			return RegimeHighVolatility
		}
	case RegimeHighVolatility:
		switch {
		case r < 0.40:
			return RegimeHighVolatility // Chaos continues
		case r < 0.60:
			return RegimeTrendingDown // Panic sell-off
		case r < 0.80:
			return RegimeTrendingUp // Short squeeze / recovery
		default:
			return RegimeSideways // Exhaustion
		}
	default:
		return s.getRandomRegime()
	}
}

func (s *PricingService) getRandomRegime() MarketRegime {
	r := s.rng.Float64()
	switch {
	case r < 0.40:
		return RegimeSideways
	case r < 0.70:
		return RegimeTrendingUp
	case r < 0.95: // Balanced initial state (30% Up, 25% Down)
		return RegimeTrendingDown
	default:
		return RegimeHighVolatility
	}
}

func (s *PricingService) Stop() {
	close(s.stopChan)
}

func (s *PricingService) simulatePrices() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	instruments, err := s.instrumentRepo.FindAll(map[string]interface{}{"status": "ACTIVE"})
	if err != nil {
		log.Printf("Pricing engine error: failed to fetch instruments: %v", err)
		return
	}

	for _, inst := range instruments {
		data, err := s.marketDataRepo.FindByInstrumentID(ctx, inst.ID.Hex())
		if err != nil {
			log.Printf("Pricing engine error: failed to fetch market data for %s: %v", inst.Symbol, err)
			continue
		}

		if data == nil {
			// Initialize market data using last candle price to maintain continuity
			var basePrice float64

			// Try to get the last candle price for 1m interval
			lastCandle, err := s.candleRepo.GetLatestCandle(inst.ID.Hex(), "1m")
			if err == nil && lastCandle != nil {
				// Use last candle's close price
				basePrice = lastCandle.Close
			} else {
				// No candle history, use sensible default for NSE stocks
				basePrice = 1000.0
			}

			// Initialize with base price (no variance) to maintain continuity
			data = &models.MarketData{
				InstrumentID: inst.ID,
				Symbol:       inst.Symbol,
				LastPrice:    basePrice,
				PrevClose:    basePrice, // Use same price for continuity
				Open:         basePrice,
				High:         basePrice,
				Low:          basePrice,
				Volume:       int64(50000 + s.rng.Intn(950000)), // 50k to 1M volume
			}
		}

		// 1. Manage Market Regimes
		instrumentID := inst.ID.Hex()
		regime, exists := s.regimes[instrumentID]
		expiry := s.regimeExpiries[instrumentID]

		if !exists || time.Now().After(expiry) {
			oldRegime := regime
			regime = s.getNextRegime(oldRegime)
			s.regimes[instrumentID] = regime
			// Expire in 3-10 minutes for more stable cycles
			s.regimeExpiries[instrumentID] = time.Now().Add(time.Duration(3+s.rng.Intn(7)) * time.Minute)
			log.Printf("MARKOV TRANSITION: %s changed from %s to %s", inst.Symbol, oldRegime, regime)
		}

		// 2. Advanced Metrics (EMA)
		prices := s.priceHistory[instrumentID]
		prices = append(prices, data.LastPrice)
		if len(prices) > 20 {
			prices = prices[1:] // Keep last 20
		}
		s.priceHistory[instrumentID] = prices

		// Calculate/Update EMA
		currentEMA := s.ema[instrumentID]
		if currentEMA == 0 {
			currentEMA = data.LastPrice
		} else {
			alpha := 0.15 // Smoothing factor
			currentEMA = (data.LastPrice * alpha) + (currentEMA * (1 - alpha))
		}
		s.ema[instrumentID] = currentEMA

		// 3. Base Configuration
		tick := inst.TickSize
		if tick <= 0 {
			tick = 0.05
		}

		volatilityMultiplier := 1.0
		trendBias := 0.0
		eventProb := 0.012

		switch regime {
		case RegimeHighVolatility:
			volatilityMultiplier = 4.5
			trendBias = 0.0
			eventProb = 0.035
		case RegimeSideways:
			volatilityMultiplier = 0.4
			trendBias = 0.0
		case RegimeTrendingUp:
			trendBias = 0.56 // Phase 4: Balanced
			volatilityMultiplier = 1.1
			
			// Uptrend Exhaustion logic (Phase 4: 2.5% threshold)
			deviation := (data.LastPrice - currentEMA) / currentEMA
			if deviation > 0.025 {
				trendBias *= 0.5 
			}
		case RegimeTrendingDown:
			trendBias = -0.56 // Phase 4: Balanced
			volatilityMultiplier = 1.1
			
			// Oversold Bounce logic (Phase 4: -2.5% threshold)
			deviation := (data.LastPrice - currentEMA) / currentEMA
			if deviation < -0.025 { // FIXED: Was -0.25 (25%)
				trendBias *= 0.5 // Reduce downward pressure
			}
		}

		// Volatility Clustering
		if math.Abs(s.lastMoves[instrumentID]) > (4 * tick) {
			volatilityMultiplier *= 1.8
		}

		// 4. Calculate Movement Components
		
		// A. Organic Noise (Normal Distribution)
		// Phase 4: Removed the bearish noise skew
		noise := (s.rng.NormFloat64() * volatilityMultiplier)
		
		// B. Momentum with Decay (Magnitude-based)
		lastMom := s.lastMoves[instrumentID]
		if math.Abs(lastMom) < (0.01 * tick) {
			lastMom = 0
		}
		momentum := (lastMom / tick * 0.25) * 0.85

		// C. Mean Reversion to EMA
		deviation := (data.LastPrice - currentEMA) / currentEMA
		// Phase 4: Strengthened mean reversion for extreme deviations
		reversionFactor := 0.5
		if math.Abs(deviation) > 0.03 {
			reversionFactor = 0.75
		}
		reversionForce := -deviation * reversionFactor * tick 

		// D. Final Tick Movement calculation
		totalTicks := noise + trendBias + momentum
		movement := (totalTicks * tick) + reversionForce

		// E. Black Swan Events (Exponential Distribution)
		eventShock := 0.0
		if s.rng.Float64() < eventProb {
			shockType := "BREAKOUT"
			magnitude := s.rng.ExpFloat64() * 12.0
			
			if s.rng.Float64() < 0.50 { // Balanced 50/50
				shockType = "CRASH"
				magnitude = -magnitude
			}
			
			eventShock = magnitude * tick
			movement += eventShock
			log.Printf("BLACK SWAN: %s %s! shock: %.2f (%.2f ticks)", inst.Symbol, shockType, eventShock, magnitude)
			
			// Momentum Logic for follow-through
			if shockType == "CRASH" {
				s.lastMoves[instrumentID] -= 3 * tick // Panic momentum
			} else {
				s.lastMoves[instrumentID] += 3 * tick // FOMO momentum
			}

			// Potential Regime Flip
			if math.Abs(magnitude) > 15.0 {
				newRegime := RegimeHighVolatility
				if magnitude < 0 {
					newRegime = RegimeTrendingDown
				} else {
					newRegime = RegimeTrendingUp
				}
				s.regimes[instrumentID] = newRegime
				s.regimeExpiries[instrumentID] = time.Now().Add(5 * time.Minute)
				log.Printf("MARKET SHOCK: %s triggered shift to %s", inst.Symbol, newRegime)
			}
		}

		// Phase 4: Removed the 1.2x asymmetric downside boost
		// F. Circuit Breakers (Hard limit ±10% from PrevClose)
		newPrice := data.LastPrice + movement
		maxAllowed := data.PrevClose * 1.10
		minAllowed := data.PrevClose * 0.90

		if newPrice > maxAllowed {
			newPrice = maxAllowed
			movement = newPrice - data.LastPrice
		} else if newPrice < minAllowed {
			newPrice = minAllowed
			movement = newPrice - data.LastPrice
		}

		if newPrice < tick {
			newPrice = tick
			movement = newPrice - data.LastPrice
		}

		// 4. Update Market Data
		data.LastPrice = newPrice
		s.lastMoves[instrumentID] = movement

		// Update metrics
		data.Change = data.LastPrice - data.PrevClose
		if data.PrevClose > 0 {
			data.ChangePct = (data.Change / data.PrevClose) * 100
		}

		if data.LastPrice > data.High {
			data.High = data.LastPrice
		}
		if data.LastPrice < data.Low || data.Low == 0 {
			data.Low = data.LastPrice
		}

		// 5. Realistic Volume Simulation
		// Volume is higher during large price movements
		baseVolume := int64(s.rng.Intn(5000))
		activityMultiplier := 1.0 + (math.Abs(movement) / tick * 0.5)
		volumeIncrease := int64(float64(baseVolume) * activityMultiplier)
		data.Volume += volumeIncrease

		// Broadcast tick to candle builder
		if s.candleBuilder != nil {
			s.candleBuilder.OnPriceTick(inst.ID, data.LastPrice, volumeIncrease)
		}

		// Check Price Alerts via Worker Pool (Fixes goroutine leak)
		s.alertChan <- alertRequest{
			instrumentID: inst.ID.Hex(),
			lastPrice:    data.LastPrice,
		}

		// Phase 3: Diagnostic Logging for bias tracking
		if s.rng.Float64() < 0.05 { // Log occasionally (5% of ticks)
			log.Printf("BIAS CHECK: %s EMA=%.2f Price=%.2f Diff=%.2f%% regime=%s",
				inst.Symbol, currentEMA, data.LastPrice, ((data.LastPrice-currentEMA)/currentEMA)*100, regime)
		}

		if err := s.marketDataRepo.Upsert(ctx, data); err != nil {
			log.Printf("Pricing engine error: failed to update %s: %v", inst.Symbol, err)
		}
	}
}
