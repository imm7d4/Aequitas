package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"time"

	"aequitas/internal/config"
	"aequitas/internal/models"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// PriceRange defines min and max price for a sector
type PriceRange struct {
	Min float64
	Max float64
}

// Sector-based realistic price ranges (in ₹)
var sectorPriceRanges = map[string]PriceRange{
	"Banking":            {Min: 400, Max: 1800},  // HDFC Bank, ICICI Bank, SBI
	"IT":                 {Min: 800, Max: 4000},  // TCS, Infosys, Wipro
	"Energy":             {Min: 150, Max: 3000},  // Reliance, ONGC, BPCL
	"Pharma":             {Min: 300, Max: 1200},  // Sun Pharma, Dr Reddy's
	"FMCG":               {Min: 200, Max: 2800},  // HUL, ITC, Nestle
	"Automobile":         {Min: 300, Max: 4500},  // Maruti, Eicher Motors
	"Metals":             {Min: 80, Max: 800},    // Tata Steel, JSW Steel
	"Cement":             {Min: 300, Max: 35000}, // Shree Cement, UltraTech
	"Infrastructure":     {Min: 1500, Max: 3500}, // L&T, Adani Ports
	"Telecom":            {Min: 600, Max: 1200},  // Bharti Airtel
	"Consumer Durables":  {Min: 1500, Max: 3500}, // Asian Paints, Titan
	"Financial Services": {Min: 500, Max: 8000},  // Bajaj Finance, HDFC Life
	"Power":              {Min: 150, Max: 400},   // NTPC, Power Grid
	"Realty":             {Min: 200, Max: 800},   // DLF, Godrej Properties
	"Consumer Services":  {Min: 50, Max: 600},    // Zomato, IRCTC
	"Healthcare":         {Min: 4000, Max: 6500}, // Apollo Hospitals
	"Capital Goods":      {Min: 2000, Max: 5000}, // Siemens, ABB
	"Chemicals":          {Min: 2000, Max: 3000}, // Pidilite
	"Media":              {Min: 200, Max: 1500},  // Zee, Sun TV
	"Aviation":           {Min: 2000, Max: 4000}, // IndiGo
	"Logistics":          {Min: 300, Max: 500},   // Delhivery
}

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	// Load configuration
	cfg := config.New()

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(ctx)

	db := client.Database("aequitas")
	instrumentCollection := db.Collection("instruments")
	marketDataCollection := db.Collection("market_data")

	log.Println("Connected to MongoDB. Seeding initial market data...")

	// Seed random number generator
	rand.Seed(time.Now().UnixNano())

	// Get all instruments
	cursor, err := instrumentCollection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatalf("Failed to fetch instruments: %v", err)
	}
	defer cursor.Close(ctx)

	var instruments []models.Instrument
	if err = cursor.All(ctx, &instruments); err != nil {
		log.Fatalf("Failed to decode instruments: %v", err)
	}

	if len(instruments) == 0 {
		log.Println("⚠️  No instruments found. Please run seed_instruments.go first!")
		return
	}

	log.Printf("Found %d instruments. Generating initial prices...\n", len(instruments))

	// Generate market data for each instrument
	marketDataDocs := make([]interface{}, 0, len(instruments))

	for _, inst := range instruments {
		// Get price range for sector
		priceRange, ok := sectorPriceRanges[inst.Sector]
		if !ok {
			// Default range if sector not found
			priceRange = PriceRange{Min: 100, Max: 1000}
			log.Printf("Warning: No price range for sector '%s', using default", inst.Sector)
		}

		// Generate random price within range
		// Use more granular distribution for better realism
		priceSpread := priceRange.Max - priceRange.Min
		randomFactor := rand.Float64() // 0.0 to 1.0

		// Apply slight bias toward mid-range prices (bell curve approximation)
		randomFactor = (randomFactor + rand.Float64() + rand.Float64()) / 3.0

		lastPrice := priceRange.Min + (priceSpread * randomFactor)

		// Round to tick size (0.05)
		lastPrice = roundToTickSize(lastPrice, inst.TickSize)

		// Generate realistic volume (based on liquidity)
		var volume int64
		if inst.IsShortable {
			// F&O stocks have higher volume
			volume = int64(100000 + rand.Intn(900000)) // 100k to 1M
		} else {
			// Non-F&O stocks have lower volume
			volume = int64(10000 + rand.Intn(90000)) // 10k to 100k
		}

		// Generate OHLC data
		prevClose := lastPrice * (0.97 + rand.Float64()*0.06) // ±3%
		open := lastPrice * (0.98 + rand.Float64()*0.04)      // ±2% from current
		high := lastPrice * (1.00 + rand.Float64()*0.03)      // +0-3%
		low := lastPrice * (0.97 + rand.Float64()*0.03)       // -3-0%

		// Create market data document
		marketData := models.MarketData{
			ID:           primitive.NewObjectID(),
			InstrumentID: inst.ID,
			Symbol:       inst.Symbol,
			LastPrice:    lastPrice,
			Volume:       volume,
			Open:         open,
			High:         high,
			Low:          low,
			PrevClose:    prevClose,
			Change:       lastPrice - prevClose,
			ChangePct:    0, // Will be calculated
			UpdatedAt:    time.Now(),
		}

		// Calculate change percentage
		if marketData.PrevClose > 0 {
			marketData.ChangePct = (marketData.Change / marketData.PrevClose) * 100
		}

		marketDataDocs = append(marketDataDocs, marketData)

		log.Printf("  ✓ %s (%s): ₹%.2f (Change: %+.2f%%, Vol: %s)",
			inst.Symbol, inst.Sector, lastPrice, marketData.ChangePct, formatVolume(int(volume)))
	}

	// Insert all market data
	result, err := marketDataCollection.InsertMany(ctx, marketDataDocs)
	if err != nil {
		log.Fatalf("Failed to insert market data: %v", err)
	}

	log.Printf("\n✅ Successfully seeded market data for %d instruments", len(result.InsertedIDs))

	// Summary by sector
	sectorStats := make(map[string]struct {
		Count    int
		MinPrice float64
		MaxPrice float64
		AvgPrice float64
	})

	for _, doc := range marketDataDocs {
		md := doc.(models.MarketData)

		// Find instrument to get sector
		var sector string
		for _, inst := range instruments {
			if inst.ID == md.InstrumentID {
				sector = inst.Sector
				break
			}
		}

		stats := sectorStats[sector]
		if stats.Count == 0 {
			stats.MinPrice = md.LastPrice
			stats.MaxPrice = md.LastPrice
		} else {
			if md.LastPrice < stats.MinPrice {
				stats.MinPrice = md.LastPrice
			}
			if md.LastPrice > stats.MaxPrice {
				stats.MaxPrice = md.LastPrice
			}
		}
		stats.AvgPrice += md.LastPrice
		stats.Count++
		sectorStats[sector] = stats
	}

	log.Println("\n📊 Price Summary by Sector:")
	for sector, stats := range sectorStats {
		avgPrice := stats.AvgPrice / float64(stats.Count)
		log.Printf("   • %s: %d stocks, Avg: ₹%.2f (Range: ₹%.2f - ₹%.2f)",
			sector, stats.Count, avgPrice, stats.MinPrice, stats.MaxPrice)
	}

	log.Println("\n✅ Initial market data seeding complete!")
	log.Println("   Pricing engine will take over and update prices in real-time.")
}

// roundToTickSize rounds price to nearest tick size
func roundToTickSize(price float64, tickSize float64) float64 {
	return float64(int(price/tickSize+0.5)) * tickSize
}

// formatVolume formats volume with K/M suffix
func formatVolume(volume int) string {
	if volume >= 1000000 {
		return fmt.Sprintf("%.1fM", float64(volume)/1000000)
	} else if volume >= 1000 {
		return fmt.Sprintf("%.1fK", float64(volume)/1000)
	}
	return fmt.Sprintf("%d", volume)
}
