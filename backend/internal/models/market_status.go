package models

import "time"

type MarketStatus struct {
	Exchange    string    `json:"exchange"`
	Status      string    `json:"status"`
	CurrentTime time.Time `json:"currentTime"`
	NextOpen    time.Time `json:"nextOpen"`
	NextClose   time.Time `json:"nextClose"`
}
