package main

import (
	"context"
	"log"
	"time"

	"aequitas/internal/config"
	"aequitas/internal/models"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Stock represents seed data for an instrument
type Stock struct {
	Symbol      string
	Name        string
	ISIN        string
	Sector      string
	IsShortable bool
	ListingDate time.Time
}

func main() {
	// Load .env file to get production MongoDB URI
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

	log.Println("Connected to MongoDB. Seeding top 100 NSE stocks...")

	// Top 100 NSE stocks with realistic data
	stocks := []Stock{
		// Nifty 50 - All Shortable (F&O Available)
		{"RELIANCE", "Reliance Industries Ltd", "INE002A01018", "Energy", true, time.Date(1977, 11, 29, 0, 0, 0, 0, time.UTC)},
		{"TCS", "Tata Consultancy Services Ltd", "INE467B01029", "IT", true, time.Date(2004, 8, 25, 0, 0, 0, 0, time.UTC)},
		{"HDFCBANK", "HDFC Bank Ltd", "INE040A01034", "Banking", true, time.Date(1995, 11, 8, 0, 0, 0, 0, time.UTC)},
		{"INFY", "Infosys Ltd", "INE009A01021", "IT", true, time.Date(1993, 6, 12, 0, 0, 0, 0, time.UTC)},
		{"ICICIBANK", "ICICI Bank Ltd", "INE090A01021", "Banking", true, time.Date(1998, 9, 17, 0, 0, 0, 0, time.UTC)},
		{"HINDUNILVR", "Hindustan Unilever Ltd", "INE030A01027", "FMCG", true, time.Date(1995, 6, 28, 0, 0, 0, 0, time.UTC)},
		{"ITC", "ITC Ltd", "INE154A01025", "FMCG", true, time.Date(1995, 8, 24, 0, 0, 0, 0, time.UTC)},
		{"SBIN", "State Bank of India", "INE062A01020", "Banking", true, time.Date(1995, 3, 1, 0, 0, 0, 0, time.UTC)},
		{"BHARTIARTL", "Bharti Airtel Ltd", "INE397D01024", "Telecom", true, time.Date(2002, 2, 15, 0, 0, 0, 0, time.UTC)},
		{"KOTAKBANK", "Kotak Mahindra Bank Ltd", "INE237A01028", "Banking", true, time.Date(1995, 12, 20, 0, 0, 0, 0, time.UTC)},

		{"LT", "Larsen & Toubro Ltd", "INE018A01030", "Infrastructure", true, time.Date(1995, 7, 23, 0, 0, 0, 0, time.UTC)},
		{"AXISBANK", "Axis Bank Ltd", "INE238A01034", "Banking", true, time.Date(1998, 11, 16, 0, 0, 0, 0, time.UTC)},
		{"BAJFINANCE", "Bajaj Finance Ltd", "INE296A01024", "Financial Services", true, time.Date(2003, 4, 1, 0, 0, 0, 0, time.UTC)},
		{"ASIANPAINT", "Asian Paints Ltd", "INE021A01026", "Consumer Durables", true, time.Date(1995, 5, 31, 0, 0, 0, 0, time.UTC)},
		{"MARUTI", "Maruti Suzuki India Ltd", "INE585B01010", "Automobile", true, time.Date(2003, 7, 9, 0, 0, 0, 0, time.UTC)},
		{"TITAN", "Titan Company Ltd", "INE280A01028", "Consumer Durables", true, time.Date(2004, 9, 24, 0, 0, 0, 0, time.UTC)},
		{"SUNPHARMA", "Sun Pharmaceutical Industries Ltd", "INE044A01036", "Pharma", true, time.Date(1995, 2, 8, 0, 0, 0, 0, time.UTC)},
		{"ULTRACEMCO", "UltraTech Cement Ltd", "INE481G01011", "Cement", true, time.Date(2004, 8, 24, 0, 0, 0, 0, time.UTC)},
		{"NESTLEIND", "Nestle India Ltd", "INE239A01016", "FMCG", true, time.Date(1995, 4, 26, 0, 0, 0, 0, time.UTC)},
		{"WIPRO", "Wipro Ltd", "INE075A01022", "IT", true, time.Date(1995, 10, 29, 0, 0, 0, 0, time.UTC)},

		{"HCLTECH", "HCL Technologies Ltd", "INE860A01027", "IT", true, time.Date(2000, 11, 20, 0, 0, 0, 0, time.UTC)},
		{"POWERGRID", "Power Grid Corporation of India Ltd", "INE752E01010", "Power", true, time.Date(2007, 10, 5, 0, 0, 0, 0, time.UTC)},
		{"NTPC", "NTPC Ltd", "INE733E01010", "Power", true, time.Date(2004, 11, 5, 0, 0, 0, 0, time.UTC)},
		{"TATAMOTORS", "Tata Motors Ltd", "INE155A01022", "Automobile", true, time.Date(1998, 11, 23, 0, 0, 0, 0, time.UTC)},
		{"TATASTEEL", "Tata Steel Ltd", "INE081A01020", "Metals", true, time.Date(1995, 11, 18, 0, 0, 0, 0, time.UTC)},
		{"ONGC", "Oil and Natural Gas Corporation Ltd", "INE213A01029", "Energy", true, time.Date(1995, 3, 2, 0, 0, 0, 0, time.UTC)},
		{"TECHM", "Tech Mahindra Ltd", "INE669C01036", "IT", true, time.Date(2006, 8, 28, 0, 0, 0, 0, time.UTC)},
		{"M&M", "Mahindra & Mahindra Ltd", "INE101A01026", "Automobile", true, time.Date(1995, 1, 3, 0, 0, 0, 0, time.UTC)},
		{"ADANIENT", "Adani Enterprises Ltd", "INE423A01024", "Metals", true, time.Date(1995, 6, 4, 0, 0, 0, 0, time.UTC)},
		{"JSWSTEEL", "JSW Steel Ltd", "INE019A01038", "Metals", true, time.Date(2005, 3, 23, 0, 0, 0, 0, time.UTC)},

		{"COALINDIA", "Coal India Ltd", "INE522F01014", "Metals", true, time.Date(2010, 11, 4, 0, 0, 0, 0, time.UTC)},
		{"DIVISLAB", "Divi's Laboratories Ltd", "INE361B01024", "Pharma", true, time.Date(2003, 3, 12, 0, 0, 0, 0, time.UTC)},
		{"DRREDDY", "Dr. Reddy's Laboratories Ltd", "INE089A01023", "Pharma", true, time.Date(2001, 5, 30, 0, 0, 0, 0, time.UTC)},
		{"EICHERMOT", "Eicher Motors Ltd", "INE066A01021", "Automobile", true, time.Date(2004, 3, 5, 0, 0, 0, 0, time.UTC)},
		{"GRASIM", "Grasim Industries Ltd", "INE047A01021", "Cement", true, time.Date(1995, 2, 14, 0, 0, 0, 0, time.UTC)},
		{"HEROMOTOCO", "Hero MotoCorp Ltd", "INE158A01026", "Automobile", true, time.Date(2003, 4, 15, 0, 0, 0, 0, time.UTC)},
		{"HINDALCO", "Hindalco Industries Ltd", "INE038A01020", "Metals", true, time.Date(1995, 1, 8, 0, 0, 0, 0, time.UTC)},
		{"INDUSINDBK", "IndusInd Bank Ltd", "INE095A01012", "Banking", true, time.Date(1998, 1, 28, 0, 0, 0, 0, time.UTC)},
		{"CIPLA", "Cipla Ltd", "INE059A01026", "Pharma", true, time.Date(1995, 2, 8, 0, 0, 0, 0, time.UTC)},
		{"BAJAJFINSV", "Bajaj Finserv Ltd", "INE918I01018", "Financial Services", true, time.Date(2008, 5, 26, 0, 0, 0, 0, time.UTC)},

		{"BRITANNIA", "Britannia Industries Ltd", "INE216A01030", "FMCG", true, time.Date(1998, 11, 5, 0, 0, 0, 0, time.UTC)},
		{"APOLLOHOSP", "Apollo Hospitals Enterprise Ltd", "INE437A01024", "Healthcare", true, time.Date(1995, 1, 10, 0, 0, 0, 0, time.UTC)},
		{"BPCL", "Bharat Petroleum Corporation Ltd", "INE029A01011", "Energy", true, time.Date(1995, 9, 13, 0, 0, 0, 0, time.UTC)},
		{"TATACONSUM", "Tata Consumer Products Ltd", "INE192A01025", "FMCG", true, time.Date(1998, 2, 18, 0, 0, 0, 0, time.UTC)},
		{"ADANIPORTS", "Adani Ports and Special Economic Zone Ltd", "INE742F01042", "Infrastructure", true, time.Date(2007, 11, 27, 0, 0, 0, 0, time.UTC)},
		{"SHREECEM", "Shree Cement Ltd", "INE070A01015", "Cement", true, time.Date(1995, 4, 26, 0, 0, 0, 0, time.UTC)},
		{"SBILIFE", "SBI Life Insurance Company Ltd", "INE123W01016", "Financial Services", true, time.Date(2017, 10, 3, 0, 0, 0, 0, time.UTC)},
		{"HDFCLIFE", "HDFC Life Insurance Company Ltd", "INE795G01014", "Financial Services", true, time.Date(2017, 11, 17, 0, 0, 0, 0, time.UTC)},
		{"BAJAJ-AUTO", "Bajaj Auto Ltd", "INE917I01010", "Automobile", true, time.Date(2008, 5, 26, 0, 0, 0, 0, time.UTC)},
		{"VEDL", "Vedanta Ltd", "INE205A01025", "Metals", true, time.Date(1998, 5, 13, 0, 0, 0, 0, time.UTC)},

		// Next 50 - Mix of Shortable and Non-Shortable
		{"PIDILITIND", "Pidilite Industries Ltd", "INE318A01026", "Chemicals", true, time.Date(1995, 4, 26, 0, 0, 0, 0, time.UTC)},
		{"GODREJCP", "Godrej Consumer Products Ltd", "INE102D01028", "FMCG", true, time.Date(2001, 11, 20, 0, 0, 0, 0, time.UTC)},
		{"DABUR", "Dabur India Ltd", "INE016A01026", "FMCG", true, time.Date(1996, 4, 22, 0, 0, 0, 0, time.UTC)},
		{"MARICO", "Marico Ltd", "INE196A01026", "FMCG", true, time.Date(1996, 5, 1, 0, 0, 0, 0, time.UTC)},
		{"HAVELLS", "Havells India Ltd", "INE176B01034", "Consumer Durables", true, time.Date(2001, 3, 21, 0, 0, 0, 0, time.UTC)},
		{"SIEMENS", "Siemens Ltd", "INE003A01024", "Capital Goods", true, time.Date(1995, 9, 6, 0, 0, 0, 0, time.UTC)},
		{"BOSCHLTD", "Bosch Ltd", "INE323A01026", "Automobile", true, time.Date(2003, 5, 12, 0, 0, 0, 0, time.UTC)},
		{"ABB", "ABB India Ltd", "INE117A01022", "Capital Goods", true, time.Date(1995, 12, 8, 0, 0, 0, 0, time.UTC)},
		{"MOTHERSON", "Samvardhana Motherson International Ltd", "INE775A01035", "Automobile", true, time.Date(1993, 4, 23, 0, 0, 0, 0, time.UTC)},
		{"TORNTPHARM", "Torrent Pharmaceuticals Ltd", "INE685A01028", "Pharma", true, time.Date(2000, 11, 25, 0, 0, 0, 0, time.UTC)},

		{"BIOCON", "Biocon Ltd", "INE376G01013", "Pharma", true, time.Date(2004, 4, 7, 0, 0, 0, 0, time.UTC)},
		{"LUPIN", "Lupin Ltd", "INE326A01037", "Pharma", true, time.Date(2001, 9, 10, 0, 0, 0, 0, time.UTC)},
		{"ALKEM", "Alkem Laboratories Ltd", "INE540L01014", "Pharma", true, time.Date(2015, 12, 23, 0, 0, 0, 0, time.UTC)},
		{"AUROPHARMA", "Aurobindo Pharma Ltd", "INE406A01037", "Pharma", true, time.Date(2000, 5, 19, 0, 0, 0, 0, time.UTC)},
		{"GLENMARK", "Glenmark Pharmaceuticals Ltd", "INE935A01035", "Pharma", true, time.Date(2000, 2, 7, 0, 0, 0, 0, time.UTC)},
		{"BANDHANBNK", "Bandhan Bank Ltd", "INE545U01014", "Banking", true, time.Date(2018, 3, 27, 0, 0, 0, 0, time.UTC)},
		{"IDFCFIRSTB", "IDFC First Bank Ltd", "INE092T01019", "Banking", true, time.Date(2015, 11, 6, 0, 0, 0, 0, time.UTC)},
		{"PNB", "Punjab National Bank", "INE160A01022", "Banking", true, time.Date(2002, 4, 24, 0, 0, 0, 0, time.UTC)},
		{"BANKBARODA", "Bank of Baroda", "INE028A01039", "Banking", true, time.Date(1997, 2, 19, 0, 0, 0, 0, time.UTC)},
		{"CANBK", "Canara Bank", "INE476A01022", "Banking", true, time.Date(2002, 12, 23, 0, 0, 0, 0, time.UTC)},

		{"IOC", "Indian Oil Corporation Ltd", "INE242A01010", "Energy", true, time.Date(1996, 7, 24, 0, 0, 0, 0, time.UTC)},
		{"GAIL", "GAIL (India) Ltd", "INE129A01019", "Energy", true, time.Date(1997, 4, 2, 0, 0, 0, 0, time.UTC)},
		{"ADANIGREEN", "Adani Green Energy Ltd", "INE364U01010", "Power", false, time.Date(2018, 6, 18, 0, 0, 0, 0, time.UTC)},
		{"TATAPOWER", "Tata Power Company Ltd", "INE245A01021", "Power", true, time.Date(1995, 11, 3, 0, 0, 0, 0, time.UTC)},
		{"TORNTPOWER", "Torrent Power Ltd", "INE813H01021", "Power", true, time.Date(2006, 11, 28, 0, 0, 0, 0, time.UTC)},
		{"AMBUJACEM", "Ambuja Cements Ltd", "INE079A01024", "Cement", true, time.Date(1995, 2, 18, 0, 0, 0, 0, time.UTC)},
		{"ACC", "ACC Ltd", "INE012A01025", "Cement", true, time.Date(1995, 2, 10, 0, 0, 0, 0, time.UTC)},
		{"RAMCOCEM", "The Ramco Cements Ltd", "INE331A01037", "Cement", true, time.Date(1996, 2, 1, 0, 0, 0, 0, time.UTC)},
		{"JINDALSTEL", "Jindal Steel & Power Ltd", "INE749A01030", "Metals", true, time.Date(1999, 12, 29, 0, 0, 0, 0, time.UTC)},
		{"SAIL", "Steel Authority of India Ltd", "INE114A01011", "Metals", true, time.Date(1995, 1, 24, 0, 0, 0, 0, time.UTC)},

		{"NMDC", "NMDC Ltd", "INE584A01023", "Metals", true, time.Date(2008, 3, 3, 0, 0, 0, 0, time.UTC)},
		{"HINDZINC", "Hindustan Zinc Ltd", "INE267A01025", "Metals", true, time.Date(2006, 11, 21, 0, 0, 0, 0, time.UTC)},
		{"NATIONALUM", "National Aluminium Company Ltd", "INE139A01034", "Metals", true, time.Date(1999, 4, 28, 0, 0, 0, 0, time.UTC)},
		{"DLF", "DLF Ltd", "INE271C01023", "Realty", true, time.Date(2007, 7, 5, 0, 0, 0, 0, time.UTC)},
		{"GODREJPROP", "Godrej Properties Ltd", "INE484J01027", "Realty", true, time.Date(2010, 1, 6, 0, 0, 0, 0, time.UTC)},
		{"OBEROIRLTY", "Oberoi Realty Ltd", "INE093I01010", "Realty", true, time.Date(2010, 10, 20, 0, 0, 0, 0, time.UTC)},
		{"PRESTIGE", "Prestige Estates Projects Ltd", "INE811K01011", "Realty", true, time.Date(2010, 10, 13, 0, 0, 0, 0, time.UTC)},
		{"ZOMATO", "Zomato Ltd", "INE758T01015", "Consumer Services", false, time.Date(2021, 7, 23, 0, 0, 0, 0, time.UTC)},
		{"NYKAA", "FSN E-Commerce Ventures Ltd", "INE388Y01029", "Consumer Services", false, time.Date(2021, 11, 10, 0, 0, 0, 0, time.UTC)},
		{"PAYTM", "One 97 Communications Ltd", "INE982J01020", "Financial Services", false, time.Date(2021, 11, 18, 0, 0, 0, 0, time.UTC)},

		{"POLICYBZR", "PB Fintech Ltd", "INE0LM101013", "Financial Services", false, time.Date(2021, 11, 15, 0, 0, 0, 0, time.UTC)},
		{"DELHIVERY", "Delhivery Ltd", "INE148O01028", "Logistics", false, time.Date(2022, 5, 24, 0, 0, 0, 0, time.UTC)},
		{"IRCTC", "Indian Railway Catering and Tourism Corporation Ltd", "INE335Y01020", "Consumer Services", true, time.Date(2019, 10, 14, 0, 0, 0, 0, time.UTC)},
		{"INDIGO", "InterGlobe Aviation Ltd", "INE646L01027", "Aviation", true, time.Date(2015, 11, 10, 0, 0, 0, 0, time.UTC)},
		{"SPICEJET", "SpiceJet Ltd", "INE285B01017", "Aviation", false, time.Date(2005, 6, 22, 0, 0, 0, 0, time.UTC)},
		{"PVR", "PVR Ltd", "INE191H01014", "Media", true, time.Date(2006, 1, 4, 0, 0, 0, 0, time.UTC)},
		{"ZEEL", "Zee Entertainment Enterprises Ltd", "INE256A01028", "Media", true, time.Date(1993, 9, 27, 0, 0, 0, 0, time.UTC)},
		{"SUNTV", "Sun TV Network Ltd", "INE424H01027", "Media", true, time.Date(2006, 4, 24, 0, 0, 0, 0, time.UTC)},
		{"DIXON", "Dixon Technologies (India) Ltd", "INE935N01012", "Consumer Durables", false, time.Date(2017, 9, 18, 0, 0, 0, 0, time.UTC)},
		{"VOLTAS", "Voltas Ltd", "INE226A01021", "Consumer Durables", true, time.Date(1995, 2, 13, 0, 0, 0, 0, time.UTC)},
	}

	// Convert to Instrument models
	instruments := make([]models.Instrument, len(stocks))
	for i, stock := range stocks {
		instruments[i] = models.Instrument{
			ID:          primitive.NewObjectID(),
			Symbol:      stock.Symbol,
			Name:        stock.Name,
			ISIN:        stock.ISIN,
			Exchange:    "NSE",
			Type:        "EQUITY",
			Sector:      stock.Sector,
			LotSize:     1,
			TickSize:    0.05,
			Status:      "ACTIVE",
			IsShortable: stock.IsShortable,
			ListingDate: stock.ListingDate,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		}
	}

	// Convert to interface slice for InsertMany
	docs := make([]interface{}, len(instruments))
	for i, inst := range instruments {
		docs[i] = inst
	}

	// Insert instruments
	result, err := instrumentCollection.InsertMany(ctx, docs)
	if err != nil {
		log.Fatalf("Failed to insert instruments: %v", err)
	}

	log.Printf("✅ Successfully seeded %d instruments", len(result.InsertedIDs))

	// Summary by sector
	sectorCount := make(map[string]int)
	shortableCount := 0
	for _, inst := range instruments {
		sectorCount[inst.Sector]++
		if inst.IsShortable {
			shortableCount++
		}
	}

	log.Printf("\n📊 Summary:")
	log.Printf("   • Total: %d", len(instruments))
	log.Printf("   • Shortable (F&O): %d", shortableCount)
	log.Printf("   • Non-shortable: %d", len(instruments)-shortableCount)

	log.Println("\n📋 Sector Breakdown:")
	for sector, count := range sectorCount {
		log.Printf("   • %s: %d", sector, count)
	}

	log.Println("\n✅ Seeding complete!")
}
