package services

import (
	"log"
	"math/rand"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type PricingService struct {
	instrumentRepo *repositories.InstrumentRepository
	marketDataRepo *repositories.MarketDataRepository
	stopChan       chan struct{}
	rng            *rand.Rand
}

func NewPricingService(
	instrumentRepo *repositories.InstrumentRepository,
	marketDataRepo *repositories.MarketDataRepository,
) *PricingService {
	// Create a new random source with current time seed for varied randomness
	source := rand.NewSource(time.Now().UnixNano())
	return &PricingService{
		instrumentRepo: instrumentRepo,
		marketDataRepo: marketDataRepo,
		stopChan:       make(chan struct{}),
		rng:            rand.New(source),
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
			// Initialize market data with varied base prices
			// NSE stocks roughly ₹100-₹5000 range for top stocks
			basePrice := 100.0 + s.rng.Float64()*4900.0

			// Add some initial variance to open/high/low
			variance := basePrice * 0.02 // 2% variance
			open := basePrice + (s.rng.Float64()-0.5)*variance
			high := basePrice + s.rng.Float64()*variance
			low := basePrice - s.rng.Float64()*variance

			data = &models.MarketData{
				InstrumentID: inst.ID,
				Symbol:       inst.Symbol,
				LastPrice:    basePrice,
				PrevClose:    basePrice * (0.98 + s.rng.Float64()*0.04), // -2% to +2% from current
				Open:         open,
				High:         high,
				Low:          low,
				Volume:       int64(50000 + s.rng.Intn(950000)), // 50k to 1M volume
			}
		}

		// Move price with more realistic variance
		tick := inst.TickSize
		if tick <= 0 {
			tick = 0.05 // default to 5 paisa
		}

		// More varied movement: -5 to +5 ticks with weighted probability
		// 60% chance of small movement (-1 to +1), 40% chance of larger movement
		var moveTicks float64
		if s.rng.Float64() < 0.6 {
			// Small movement
			moveTicks = float64(s.rng.Intn(3) - 1) // -1, 0, or 1
		} else {
			// Larger movement
			moveTicks = float64(s.rng.Intn(11) - 5) // -5 to +5
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

		if err := s.marketDataRepo.Upsert(data); err != nil {
			log.Printf("Pricing engine error: failed to update %s: %v", inst.Symbol, err)
		}
	}
}
