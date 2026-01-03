package main

import (
	"context"
	"log"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"aequitas/internal/config"
	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

func main() {
	// Load environment variables
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("No .env file found")
	}

	cfg := config.New()

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer client.Disconnect(context.Background())

	db := client.Database("aequitas")

	// Initialize repositories
	instrumentRepo := repositories.NewInstrumentRepository(db)
	marketRepo := repositories.NewMarketRepository(db)

	log.Println("Starting database seeding...")

	// Seed instruments
	if err := seedInstruments(instrumentRepo); err != nil {
		log.Fatal("Failed to seed instruments:", err)
	}

	// Seed market hours
	if err := seedMarketHours(marketRepo); err != nil {
		log.Fatal("Failed to seed market hours:", err)
	}

	// Seed holidays
	if err := seedHolidays(marketRepo); err != nil {
		log.Fatal("Failed to seed holidays:", err)
	}

	log.Println("Database seeding completed successfully!")
}

func seedInstruments(repo *repositories.InstrumentRepository) error {
	log.Println("Seeding top 100 NSE stocks...")

	instruments := getTop100NSEStocks()

	for _, inst := range instruments {
		// Check if already exists
		existing, _ := repo.FindBySymbol(inst.Symbol, inst.Exchange)
		if existing != nil {
			log.Printf("Skipping %s - already exists\n", inst.Symbol)
			continue
		}

		if err := repo.Create(&inst); err != nil {
			log.Printf("Error creating %s: %v\n", inst.Symbol, err)
			continue
		}
		log.Printf("Created instrument: %s\n", inst.Symbol)
	}

	log.Printf("Seeded %d instruments\n", len(instruments))
	return nil
}

func seedMarketHours(repo *repositories.MarketRepository) error {
	log.Println("Seeding market hours...")

	// NSE market hours (Monday-Friday)
	for day := 1; day <= 5; day++ {
		hours := &models.MarketHours{
			Exchange:        "NSE",
			DayOfWeek:       day,
			PreMarketStart:  "09:00",
			PreMarketEnd:    "09:15",
			MarketOpen:      "09:15",
			MarketClose:     "15:30",
			PostMarketStart: "15:30",
			PostMarketEnd:   "16:00",
			IsClosed:        false,
		}

		if err := repo.CreateMarketHours(hours); err != nil {
			log.Printf("Error creating market hours for day %d: %v\n", day, err)
		}
	}

	// BSE market hours (Monday-Friday)
	for day := 1; day <= 5; day++ {
		hours := &models.MarketHours{
			Exchange:        "BSE",
			DayOfWeek:       day,
			PreMarketStart:  "09:00",
			PreMarketEnd:    "09:15",
			MarketOpen:      "09:15",
			MarketClose:     "15:30",
			PostMarketStart: "15:30",
			PostMarketEnd:   "16:00",
			IsClosed:        false,
		}

		if err := repo.CreateMarketHours(hours); err != nil {
			log.Printf("Error creating market hours for day %d: %v\n", day, err)
		}
	}

	log.Println("Market hours seeded successfully")
	return nil
}

func seedHolidays(repo *repositories.MarketRepository) error {
	log.Println("Seeding market holidays for 2026...")

	holidays := []struct {
		date string
		name string
	}{
		{"2026-01-26", "Republic Day"},
		{"2026-03-14", "Holi"},
		{"2026-04-02", "Ram Navami"},
		{"2026-04-06", "Mahavir Jayanti"},
		{"2026-04-10", "Good Friday"},
		{"2026-05-01", "Maharashtra Day"},
		{"2026-08-15", "Independence Day"},
		{"2026-10-02", "Gandhi Jayanti"},
		{"2026-10-24", "Dussehra"},
		{"2026-11-12", "Diwali"},
		{"2026-11-13", "Diwali (Balipratipada)"},
		{"2026-12-25", "Christmas"},
	}

	for _, h := range holidays {
		date, _ := time.Parse("2006-01-02", h.date)

		holiday := &models.MarketHoliday{
			Exchange: "NSE",
			Date:     date,
			Name:     h.name,
		}

		if err := repo.CreateHoliday(holiday); err != nil {
			log.Printf("Error creating holiday %s: %v\n", h.name, err)
		}

		// Same holidays for BSE
		holidayBSE := &models.MarketHoliday{
			Exchange: "BSE",
			Date:     date,
			Name:     h.name,
		}

		if err := repo.CreateHoliday(holidayBSE); err != nil {
			log.Printf("Error creating BSE holiday %s: %v\n", h.name, err)
		}
	}

	log.Println("Market holidays seeded successfully")
	return nil
}

func getTop100NSEStocks() []models.Instrument {
	now := time.Now()

	return []models.Instrument{
		// Top 20 by market cap
		{Symbol: "RELIANCE", Name: "Reliance Industries Ltd", ISIN: "INE002A01018", Exchange: "NSE", Type: "STOCK", Sector: "Energy", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "TCS", Name: "Tata Consultancy Services Ltd", ISIN: "INE467B01029", Exchange: "NSE", Type: "STOCK", Sector: "IT", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "HDFCBANK", Name: "HDFC Bank Ltd", ISIN: "INE040A01034", Exchange: "NSE", Type: "STOCK", Sector: "Banking", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "INFY", Name: "Infosys Ltd", ISIN: "INE009A01021", Exchange: "NSE", Type: "STOCK", Sector: "IT", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ICICIBANK", Name: "ICICI Bank Ltd", ISIN: "INE090A01021", Exchange: "NSE", Type: "STOCK", Sector: "Banking", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "HINDUNILVR", Name: "Hindustan Unilever Ltd", ISIN: "INE030A01027", Exchange: "NSE", Type: "STOCK", Sector: "FMCG", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ITC", Name: "ITC Ltd", ISIN: "INE154A01025", Exchange: "NSE", Type: "STOCK", Sector: "FMCG", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "SBIN", Name: "State Bank of India", ISIN: "INE062A01020", Exchange: "NSE", Type: "STOCK", Sector: "Banking", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "BHARTIARTL", Name: "Bharti Airtel Ltd", ISIN: "INE397D01024", Exchange: "NSE", Type: "STOCK", Sector: "Telecom", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "KOTAKBANK", Name: "Kotak Mahindra Bank Ltd", ISIN: "INE237A01028", Exchange: "NSE", Type: "STOCK", Sector: "Banking", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "LT", Name: "Larsen & Toubro Ltd", ISIN: "INE018A01030", Exchange: "NSE", Type: "STOCK", Sector: "Infrastructure", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "HCLTECH", Name: "HCL Technologies Ltd", ISIN: "INE860A01027", Exchange: "NSE", Type: "STOCK", Sector: "IT", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "AXISBANK", Name: "Axis Bank Ltd", ISIN: "INE238A01034", Exchange: "NSE", Type: "STOCK", Sector: "Banking", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ASIANPAINT", Name: "Asian Paints Ltd", ISIN: "INE021A01026", Exchange: "NSE", Type: "STOCK", Sector: "Consumer Goods", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "MARUTI", Name: "Maruti Suzuki India Ltd", ISIN: "INE585B01010", Exchange: "NSE", Type: "STOCK", Sector: "Automobile", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "SUNPHARMA", Name: "Sun Pharmaceutical Industries Ltd", ISIN: "INE044A01036", Exchange: "NSE", Type: "STOCK", Sector: "Pharma", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "TITAN", Name: "Titan Company Ltd", ISIN: "INE280A01028", Exchange: "NSE", Type: "STOCK", Sector: "Consumer Goods", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "WIPRO", Name: "Wipro Ltd", ISIN: "INE075A01022", Exchange: "NSE", Type: "STOCK", Sector: "IT", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ULTRACEMCO", Name: "UltraTech Cement Ltd", ISIN: "INE481G01011", Exchange: "NSE", Type: "STOCK", Sector: "Cement", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "NESTLEIND", Name: "Nestle India Ltd", ISIN: "INE239A01016", Exchange: "NSE", Type: "STOCK", Sector: "FMCG", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},

		// Next 30 stocks (21-50)
		{Symbol: "BAJFINANCE", Name: "Bajaj Finance Ltd", ISIN: "INE296A01024", Exchange: "NSE", Type: "STOCK", Sector: "Finance", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ADANIENT", Name: "Adani Enterprises Ltd", ISIN: "INE423A01024", Exchange: "NSE", Type: "STOCK", Sector: "Conglomerate", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ONGC", Name: "Oil & Natural Gas Corporation Ltd", ISIN: "INE213A01029", Exchange: "NSE", Type: "STOCK", Sector: "Energy", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "NTPC", Name: "NTPC Ltd", ISIN: "INE733E01010", Exchange: "NSE", Type: "STOCK", Sector: "Power", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "POWERGRID", Name: "Power Grid Corporation of India Ltd", ISIN: "INE752E01010", Exchange: "NSE", Type: "STOCK", Sector: "Power", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "M&M", Name: "Mahindra & Mahindra Ltd", ISIN: "INE101A01026", Exchange: "NSE", Type: "STOCK", Sector: "Automobile", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "TATAMOTORS", Name: "Tata Motors Ltd", ISIN: "INE155A01022", Exchange: "NSE", Type: "STOCK", Sector: "Automobile", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "TATASTEEL", Name: "Tata Steel Ltd", ISIN: "INE081A01012", Exchange: "NSE", Type: "STOCK", Sector: "Metals", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "JSWSTEEL", Name: "JSW Steel Ltd", ISIN: "INE019A01038", Exchange: "NSE", Type: "STOCK", Sector: "Metals", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "HINDALCO", Name: "Hindalco Industries Ltd", ISIN: "INE038A01020", Exchange: "NSE", Type: "STOCK", Sector: "Metals", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "COALINDIA", Name: "Coal India Ltd", ISIN: "INE522F01014", Exchange: "NSE", Type: "STOCK", Sector: "Mining", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "INDUSINDBK", Name: "IndusInd Bank Ltd", ISIN: "INE095A01012", Exchange: "NSE", Type: "STOCK", Sector: "Banking", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "BAJAJFINSV", Name: "Bajaj Finserv Ltd", ISIN: "INE918I01018", Exchange: "NSE", Type: "STOCK", Sector: "Finance", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "TECHM", Name: "Tech Mahindra Ltd", ISIN: "INE669C01036", Exchange: "NSE", Type: "STOCK", Sector: "IT", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "DRREDDY", Name: "Dr. Reddy's Laboratories Ltd", ISIN: "INE089A01023", Exchange: "NSE", Type: "STOCK", Sector: "Pharma", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "CIPLA", Name: "Cipla Ltd", ISIN: "INE059A01026", Exchange: "NSE", Type: "STOCK", Sector: "Pharma", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "DIVISLAB", Name: "Divi's Laboratories Ltd", ISIN: "INE361B01024", Exchange: "NSE", Type: "STOCK", Sector: "Pharma", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "EICHERMOT", Name: "Eicher Motors Ltd", ISIN: "INE066A01021", Exchange: "NSE", Type: "STOCK", Sector: "Automobile", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "HEROMOTOCO", Name: "Hero MotoCorp Ltd", ISIN: "INE158A01026", Exchange: "NSE", Type: "STOCK", Sector: "Automobile", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "GRASIM", Name: "Grasim Industries Ltd", ISIN: "INE047A01021", Exchange: "NSE", Type: "STOCK", Sector: "Cement", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "BRITANNIA", Name: "Britannia Industries Ltd", ISIN: "INE216A01030", Exchange: "NSE", Type: "STOCK", Sector: "FMCG", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ADANIPORTS", Name: "Adani Ports and Special Economic Zone Ltd", ISIN: "INE742F01042", Exchange: "NSE", Type: "STOCK", Sector: "Infrastructure", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "SHREECEM", Name: "Shree Cement Ltd", ISIN: "INE070A01015", Exchange: "NSE", Type: "STOCK", Sector: "Cement", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "BPCL", Name: "Bharat Petroleum Corporation Ltd", ISIN: "INE029A01011", Exchange: "NSE", Type: "STOCK", Sector: "Energy", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "IOC", Name: "Indian Oil Corporation Ltd", ISIN: "INE242A01010", Exchange: "NSE", Type: "STOCK", Sector: "Energy", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "APOLLOHOSP", Name: "Apollo Hospitals Enterprise Ltd", ISIN: "INE437A01024", Exchange: "NSE", Type: "STOCK", Sector: "Healthcare", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "SBILIFE", Name: "SBI Life Insurance Company Ltd", ISIN: "INE123W01016", Exchange: "NSE", Type: "STOCK", Sector: "Insurance", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "HDFCLIFE", Name: "HDFC Life Insurance Company Ltd", ISIN: "INE795G01014", Exchange: "NSE", Type: "STOCK", Sector: "Insurance", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ICICIPRULI", Name: "ICICI Prudential Life Insurance Company Ltd", ISIN: "INE726G01019", Exchange: "NSE", Type: "STOCK", Sector: "Insurance", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "BAJAJ-AUTO", Name: "Bajaj Auto Ltd", ISIN: "INE917I01010", Exchange: "NSE", Type: "STOCK", Sector: "Automobile", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},

		// Additional 50 stocks (51-100)
		{Symbol: "TATACONSUM", Name: "Tata Consumer Products Ltd", ISIN: "INE192A01025", Exchange: "NSE", Type: "STOCK", Sector: "FMCG", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "VEDL", Name: "Vedanta Ltd", ISIN: "INE205A01025", Exchange: "NSE", Type: "STOCK", Sector: "Metals", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "GODREJCP", Name: "Godrej Consumer Products Ltd", ISIN: "INE102D01028", Exchange: "NSE", Type: "STOCK", Sector: "FMCG", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "DABUR", Name: "Dabur India Ltd", ISIN: "INE016A01026", Exchange: "NSE", Type: "STOCK", Sector: "FMCG", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "MARICO", Name: "Marico Ltd", ISIN: "INE196A01026", Exchange: "NSE", Type: "STOCK", Sector: "FMCG", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "PIDILITIND", Name: "Pidilite Industries Ltd", ISIN: "INE318A01026", Exchange: "NSE", Type: "STOCK", Sector: "Chemicals", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "SIEMENS", Name: "Siemens Ltd", ISIN: "INE003A01024", Exchange: "NSE", Type: "STOCK", Sector: "Engineering", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ABB", Name: "ABB India Ltd", ISIN: "INE117A01022", Exchange: "NSE", Type: "STOCK", Sector: "Engineering", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "BOSCHLTD", Name: "Bosch Ltd", ISIN: "INE323A01026", Exchange: "NSE", Type: "STOCK", Sector: "Automobile", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "HAVELLS", Name: "Havells India Ltd", ISIN: "INE176B01034", Exchange: "NSE", Type: "STOCK", Sector: "Consumer Goods", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "BERGEPAINT", Name: "Berger Paints India Ltd", ISIN: "INE463A01038", Exchange: "NSE", Type: "STOCK", Sector: "Consumer Goods", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "DLF", Name: "DLF Ltd", ISIN: "INE271C01023", Exchange: "NSE", Type: "STOCK", Sector: "Real Estate", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "GODREJPROP", Name: "Godrej Properties Ltd", ISIN: "INE484J01027", Exchange: "NSE", Type: "STOCK", Sector: "Real Estate", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "MCDOWELL-N", Name: "United Spirits Ltd", ISIN: "INE854D01024", Exchange: "NSE", Type: "STOCK", Sector: "FMCG", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "UBL", Name: "United Breweries Ltd", ISIN: "INE686F01025", Exchange: "NSE", Type: "STOCK", Sector: "FMCG", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "AMBUJACEM", Name: "Ambuja Cements Ltd", ISIN: "INE079A01024", Exchange: "NSE", Type: "STOCK", Sector: "Cement", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ACC", Name: "ACC Ltd", ISIN: "INE012A01025", Exchange: "NSE", Type: "STOCK", Sector: "Cement", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "BANKBARODA", Name: "Bank of Baroda", ISIN: "INE028A01039", Exchange: "NSE", Type: "STOCK", Sector: "Banking", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "PNB", Name: "Punjab National Bank", ISIN: "INE160A01022", Exchange: "NSE", Type: "STOCK", Sector: "Banking", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "CANBK", Name: "Canara Bank", ISIN: "INE476A01022", Exchange: "NSE", Type: "STOCK", Sector: "Banking", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "BANDHANBNK", Name: "Bandhan Bank Ltd", ISIN: "INE545U01014", Exchange: "NSE", Type: "STOCK", Sector: "Banking", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "FEDERALBNK", Name: "Federal Bank Ltd", ISIN: "INE171A01029", Exchange: "NSE", Type: "STOCK", Sector: "Banking", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "IDFCFIRSTB", Name: "IDFC First Bank Ltd", ISIN: "INE092T01019", Exchange: "NSE", Type: "STOCK", Sector: "Banking", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "PFC", Name: "Power Finance Corporation Ltd", ISIN: "INE134E01011", Exchange: "NSE", Type: "STOCK", Sector: "Finance", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "RECLTD", Name: "REC Ltd", ISIN: "INE020B01018", Exchange: "NSE", Type: "STOCK", Sector: "Finance", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "LICHSGFIN", Name: "LIC Housing Finance Ltd", ISIN: "INE115A01026", Exchange: "NSE", Type: "STOCK", Sector: "Finance", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "MUTHOOTFIN", Name: "Muthoot Finance Ltd", ISIN: "INE414G01012", Exchange: "NSE", Type: "STOCK", Sector: "Finance", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "CHOLAFIN", Name: "Cholamandalam Investment and Finance Company Ltd", ISIN: "INE121A01024", Exchange: "NSE", Type: "STOCK", Sector: "Finance", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "MFSL", Name: "Max Financial Services Ltd", ISIN: "INE180A01020", Exchange: "NSE", Type: "STOCK", Sector: "Insurance", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "LUPIN", Name: "Lupin Ltd", ISIN: "INE326A01037", Exchange: "NSE", Type: "STOCK", Sector: "Pharma", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "BIOCON", Name: "Biocon Ltd", ISIN: "INE376G01013", Exchange: "NSE", Type: "STOCK", Sector: "Pharma", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "TORNTPHARM", Name: "Torrent Pharmaceuticals Ltd", ISIN: "INE685A01028", Exchange: "NSE", Type: "STOCK", Sector: "Pharma", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ALKEM", Name: "Alkem Laboratories Ltd", ISIN: "INE540L01014", Exchange: "NSE", Type: "STOCK", Sector: "Pharma", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "AUROPHARMA", Name: "Aurobindo Pharma Ltd", ISIN: "INE406A01037", Exchange: "NSE", Type: "STOCK", Sector: "Pharma", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ZYDUSLIFE", Name: "Zydus Lifesciences Ltd", ISIN: "INE010B01027", Exchange: "NSE", Type: "STOCK", Sector: "Pharma", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "GAIL", Name: "GAIL (India) Ltd", ISIN: "INE129A01019", Exchange: "NSE", Type: "STOCK", Sector: "Energy", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "INDIGO", Name: "InterGlobe Aviation Ltd", ISIN: "INE646L01027", Exchange: "NSE", Type: "STOCK", Sector: "Aviation", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "ZOMATO", Name: "Zomato Ltd", ISIN: "INE758T01015", Exchange: "NSE", Type: "STOCK", Sector: "Technology", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "PAYTM", Name: "One 97 Communications Ltd", ISIN: "INE982J01020", Exchange: "NSE", Type: "STOCK", Sector: "Technology", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "NYKAA", Name: "FSN E-Commerce Ventures Ltd", ISIN: "INE388Y01029", Exchange: "NSE", Type: "STOCK", Sector: "E-Commerce", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "DMART", Name: "Avenue Supermarts Ltd", ISIN: "INE192R01011", Exchange: "NSE", Type: "STOCK", Sector: "Retail", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "TRENT", Name: "Trent Ltd", ISIN: "INE849A01020", Exchange: "NSE", Type: "STOCK", Sector: "Retail", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "JUBLFOOD", Name: "Jubilant Foodworks Ltd", ISIN: "INE797F01012", Exchange: "NSE", Type: "STOCK", Sector: "Retail", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "DIXON", Name: "Dixon Technologies (India) Ltd", ISIN: "INE935N01012", Exchange: "NSE", Type: "STOCK", Sector: "Electronics", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "VOLTAS", Name: "Voltas Ltd", ISIN: "INE226A01021", Exchange: "NSE", Type: "STOCK", Sector: "Consumer Goods", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "WHIRLPOOL", Name: "Whirlpool of India Ltd", ISIN: "INE716A01013", Exchange: "NSE", Type: "STOCK", Sector: "Consumer Goods", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "PAGEIND", Name: "Page Industries Ltd", ISIN: "INE761H01022", Exchange: "NSE", Type: "STOCK", Sector: "Textile", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "MPHASIS", Name: "Mphasis Ltd", ISIN: "INE356A01018", Exchange: "NSE", Type: "STOCK", Sector: "IT", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "PERSISTENT", Name: "Persistent Systems Ltd", ISIN: "INE262H01013", Exchange: "NSE", Type: "STOCK", Sector: "IT", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
		{Symbol: "COFORGE", Name: "Coforge Ltd", ISIN: "INE591G01017", Exchange: "NSE", Type: "STOCK", Sector: "IT", LotSize: 1, TickSize: 0.05, Status: "ACTIVE", ListingDate: now},
	}
}
