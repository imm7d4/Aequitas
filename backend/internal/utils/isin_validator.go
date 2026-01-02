package utils

import (
	"regexp"
	"strconv"
)

// ValidateISIN validates ISIN format and check digit using Luhn algorithm
func ValidateISIN(isin string) bool {
	// ISIN must be exactly 12 characters
	if len(isin) != 12 {
		return false
	}

	// First 2 characters must be letters (country code)
	if !regexp.MustCompile(`^[A-Z]{2}`).MatchString(isin) {
		return false
	}

	// Next 9 characters must be alphanumeric (NSIN)
	if !regexp.MustCompile(`^[A-Z]{2}[A-Z0-9]{9}[0-9]$`).MatchString(isin) {
		return false
	}

	// Validate check digit using Luhn algorithm
	return validateISINCheckDigit(isin)
}

func validateISINCheckDigit(isin string) bool {
	// Convert letters to numbers (A=10, B=11, ..., Z=35)
	var digits string
	for _, char := range isin[:11] {
		if char >= 'A' && char <= 'Z' {
			digits += strconv.Itoa(int(char - 'A' + 10))
		} else {
			digits += string(char)
		}
	}

	// Apply Luhn algorithm
	sum := 0
	double := len(digits)%2 != 0

	for _, char := range digits {
		digit, _ := strconv.Atoi(string(char))

		if double {
			digit *= 2
			if digit > 9 {
				digit -= 9
			}
		}

		sum += digit
		double = !double
	}

	// Check digit should make sum divisible by 10
	checkDigit, _ := strconv.Atoi(string(isin[11]))
	return (sum+checkDigit)%10 == 0
}
