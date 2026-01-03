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
}

func NewPricingService(
	instrumentRepo *repositories.InstrumentRepository,
	marketDataRepo *repositories.MarketDataRepository,
) *PricingService {
	return &PricingService{
		instrumentRepo: instrumentRepo,
		marketDataRepo: marketDataRepo,
		stopChan:       make(chan struct{}),
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
			// Initialize market data
			// NSE stocks roughly ₹100-₹5000 range for top stocks
			basePrice := 100.0 + rand.Float64()*1000.0
			data = &models.MarketData{
				InstrumentID: inst.ID,
				Symbol:       inst.Symbol,
				LastPrice:    basePrice,
				PrevClose:    basePrice,
				Open:         basePrice,
				High:         basePrice,
				Low:          basePrice,
				Volume:       100000,
			}
		}

		// Move price
		tick := inst.TickSize
		if tick <= 0 {
			tick = 0.05 // default to 5 paisa
		}

		// Random movement: -2 to +2 ticks
		moveTicks := float64(rand.Intn(5) - 2)
		movement := moveTicks * tick

		data.LastPrice += movement
		if data.LastPrice < tick {
			data.LastPrice = tick // Don't go below 1 tick
		}

		// Update metrics
		data.Change = data.LastPrice - data.PrevClose
		data.ChangePct = (data.Change / data.PrevClose) * 100

		if data.LastPrice > data.High {
			data.High = data.LastPrice
		}
		if data.LastPrice < data.Low {
			data.Low = data.LastPrice
		}

		data.Volume += int64(rand.Intn(1000))

		if err := s.marketDataRepo.Upsert(data); err != nil {
			log.Printf("Pricing engine error: failed to update %s: %v", inst.Symbol, err)
		}
	}
}
