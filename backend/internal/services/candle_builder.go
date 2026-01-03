package services

import (
	"log"
	"sync"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CandleInterval represents supported candle intervals
type CandleInterval string

const (
	Interval1m  CandleInterval = "1m"
	Interval5m  CandleInterval = "5m"
	Interval15m CandleInterval = "15m"
	Interval1h  CandleInterval = "1h"
	Interval1d  CandleInterval = "1d"
)

// ActiveCandle represents a candle currently being built
type ActiveCandle struct {
	InstrumentID primitive.ObjectID
	Interval     CandleInterval
	StartTime    time.Time
	Open         float64
	High         float64
	Low          float64
	Close        float64
	Volume       int64
	TickCount    int
}

// CandleBuilder aggregates price ticks into OHLC candles
type CandleBuilder struct {
	repo          *repositories.CandleRepository
	activeCandles map[string]*ActiveCandle // key: instrumentID_interval
	mu            sync.RWMutex
	broadcastFunc func(instrumentID string, candle *models.Candle)
}

// NewCandleBuilder creates a new candle builder instance
func NewCandleBuilder(repo *repositories.CandleRepository) *CandleBuilder {
	return &CandleBuilder{
		repo:          repo,
		activeCandles: make(map[string]*ActiveCandle),
	}
}

// SetBroadcastFunc sets the function to broadcast candle updates
func (cb *CandleBuilder) SetBroadcastFunc(fn func(string, *models.Candle)) {
	cb.broadcastFunc = fn
}

// OnPriceTick processes a new price tick and updates candles
func (cb *CandleBuilder) OnPriceTick(instrumentID primitive.ObjectID, price float64, volume int64) {
	now := time.Now()

	// Update candles for all intervals
	intervals := []CandleInterval{Interval1m, Interval5m, Interval15m, Interval1h, Interval1d}
	for _, interval := range intervals {
		cb.updateCandle(instrumentID, interval, now, price, volume)
	}
}

// updateCandle updates or creates a candle for a specific interval
func (cb *CandleBuilder) updateCandle(
	instrumentID primitive.ObjectID,
	interval CandleInterval,
	timestamp time.Time,
	price float64,
	volume int64,
) {
	key := instrumentID.Hex() + "_" + string(interval)
	startTime := cb.getCandleStartTime(timestamp, interval)

	cb.mu.Lock()
	defer cb.mu.Unlock()

	active, exists := cb.activeCandles[key]

	if exists && !active.StartTime.Equal(startTime) {
		// Store previous close to maintain continuity (Standard Charting Behavior)
		prevClose := active.Close
		cb.completeCandle(active)

		// Start new candle using prevClose as Open
		active = &ActiveCandle{
			InstrumentID: instrumentID,
			Interval:     interval,
			StartTime:    startTime,
			Open:         prevClose,
			High:         max(prevClose, price),
			Low:          min(prevClose, price),
			Close:        price,
			Volume:       volume,
			TickCount:    1,
		}
		cb.activeCandles[key] = active
		// Skip standard update as initialization already handled this tick
	} else if !exists {
		// Very first candle for this instrument/interval
		active = &ActiveCandle{
			InstrumentID: instrumentID,
			Interval:     interval,
			StartTime:    startTime,
			Open:         price,
			High:         price,
			Low:          price,
			Close:        price,
			Volume:       volume,
			TickCount:    1,
		}
		cb.activeCandles[key] = active
	} else {
		// Update existing candle
		active.High = max(active.High, price)
		active.Low = min(active.Low, price)
		active.Close = price
		active.Volume += volume
		active.TickCount++
	}

	// Broadcast current candle state
	if cb.broadcastFunc != nil {
		candle := cb.activeToModel(active)
		cb.broadcastFunc(instrumentID.Hex(), candle)
	}
}

// completeCandle saves a completed candle to the database
func (cb *CandleBuilder) completeCandle(active *ActiveCandle) {
	candle := cb.activeToModel(active)

	if err := cb.repo.SaveCandle(candle); err != nil {
		log.Printf("CandleBuilder: Failed to save candle: %v", err)
	}
}

// activeToModel converts ActiveCandle to models.Candle
func (cb *CandleBuilder) activeToModel(active *ActiveCandle) *models.Candle {
	return &models.Candle{
		InstrumentID: active.InstrumentID,
		Interval:     string(active.Interval),
		Time:         active.StartTime,
		Open:         active.Open,
		High:         active.High,
		Low:          active.Low,
		Close:        active.Close,
		Volume:       active.Volume,
	}
}

// getCandleStartTime calculates the start time for a candle based on interval
func (cb *CandleBuilder) getCandleStartTime(t time.Time, interval CandleInterval) time.Time {
	switch interval {
	case Interval1m:
		return time.Date(t.Year(), t.Month(), t.Day(), t.Hour(), t.Minute(), 0, 0, t.Location())
	case Interval5m:
		minute := (t.Minute() / 5) * 5
		return time.Date(t.Year(), t.Month(), t.Day(), t.Hour(), minute, 0, 0, t.Location())
	case Interval15m:
		minute := (t.Minute() / 15) * 15
		return time.Date(t.Year(), t.Month(), t.Day(), t.Hour(), minute, 0, 0, t.Location())
	case Interval1h:
		return time.Date(t.Year(), t.Month(), t.Day(), t.Hour(), 0, 0, 0, t.Location())
	case Interval1d:
		return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
	default:
		return t
	}
}

// Helper functions for min/max
func min(a, b float64) float64 {
	if a < b {
		return a
	}
	return b
}

func max(a, b float64) float64 {
	if a > b {
		return a
	}
	return b
}
