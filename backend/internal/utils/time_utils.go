package utils

import (
	"fmt"
	"time"
)

// ParseTimeString parses time string in HH:MM format
func ParseTimeString(timeStr string) (hour int, minute int, err error) {
	_, err = fmt.Sscanf(timeStr, "%d:%d", &hour, &minute)
	if err != nil {
		return 0, 0, fmt.Errorf("invalid time format: %s", timeStr)
	}

	if hour < 0 || hour > 23 || minute < 0 || minute > 59 {
		return 0, 0, fmt.Errorf("invalid time values: %s", timeStr)
	}

	return hour, minute, nil
}

// IsTimeInRange checks if current time is within start and end time
func IsTimeInRange(current, start, end time.Time) bool {
	return (current.Equal(start) || current.After(start)) &&
		(current.Equal(end) || current.Before(end))
}

// GetISTTime returns current time in IST timezone
func GetISTTime() time.Time {
	ist, _ := time.LoadLocation("Asia/Kolkata")
	return time.Now().In(ist)
}

// CombineDateTime combines date with time string (HH:MM)
func CombineDateTime(date time.Time, timeStr string) (time.Time, error) {
	hour, minute, err := ParseTimeString(timeStr)
	if err != nil {
		return time.Time{}, err
	}

	ist, _ := time.LoadLocation("Asia/Kolkata")
	return time.Date(
		date.Year(),
		date.Month(),
		date.Day(),
		hour,
		minute,
		0,
		0,
		ist,
	), nil
}

// IsWeekend checks if given date is Saturday or Sunday
func IsWeekend(date time.Time) bool {
	weekday := date.Weekday()
	return weekday == time.Saturday || weekday == time.Sunday
}
