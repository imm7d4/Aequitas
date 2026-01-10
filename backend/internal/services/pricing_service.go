package services

import (
	"context"
	"log"
	"math/rand"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type PricingService struct {
	instrumentRepo    *repositories.InstrumentRepository
	marketDataRepo    *repositories.MarketDataRepository
	candleRepo        *repositories.CandleRepository
	candleBuilder     *CandleBuilder
	priceAlertService *PriceAlertService
	stopChan          chan struct{}
	rng               *rand.Rand
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
	}
}

func (s *PricingService) Start() {
	ticker := time.NewTicker(3 * time.Second)
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
	log.Println("Pricing engine started (polling 3s)")
}

func (s *PricingService) Stop() {
	close(s.stopChan)
}

func (s *PricingService) simulatePrices() {
	instruments, err := s.instrumentRepo.FindAll(map[string]interface{}{"status": "ACTIVE"})
	if err != nil {
		log.Printf("Pricing engine error: failed to fetch instruments: %v", err)
		return
	}

	for _, inst := range instruments {
		data, err := s.marketDataRepo.FindByInstrumentID(inst.ID.Hex())
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

		// Move price with more realistic variance
		tick := inst.TickSize
		if tick <= 0 {
			tick = 0.05 // default to 5 paisa
		}

		// More realistic movement: -2 to +2 ticks with weighted probability
		// 80% chance of small movement (-1 to +1), 20% chance of larger movement
		var moveTicks float64
		if s.rng.Float64() < 0.8 {
			// Small movement (most common)
			moveTicks = float64(s.rng.Intn(3) - 1) // -1, 0, or 1
		} else {
			// Larger movement (less common)
			moveTicks = float64(s.rng.Intn(5) - 2) // -2 to +2
		}

		movement := moveTicks * tick

		data.LastPrice += movement
		if data.LastPrice < tick {
			data.LastPrice = tick // Don't go below 1 tick
		}

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

		// Simulate volume changes (small increments)
		volumeIncrease := int64(s.rng.Intn(10000))
		data.Volume += volumeIncrease

		// Broadcast tick to candle builder
		if s.candleBuilder != nil {
			s.candleBuilder.OnPriceTick(inst.ID, data.LastPrice, volumeIncrease)
		}

		// Check Price Alerts
		if s.priceAlertService != nil {
			go s.priceAlertService.CheckAlerts(context.Background(), inst.ID.Hex(), data.LastPrice)
		}

		if err := s.marketDataRepo.Upsert(data); err != nil {
			log.Printf("Pricing engine error: failed to update %s: %v", inst.Symbol, err)
		}
	}
}
