/**
 * Standardized formatters for Aequitas platform.
 * Pre-instantiated Intl objects for performance in high-frequency rendering.
 */

const currencyFormatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

/**
 * Formats a number as Indian currency (e.g., 1,23,456.78).
 */
export const formatCurrency = (
    amount: number,
    includeSymbol: boolean = true,
    decimals: number = 2
): string => {
    // If custom decimals are needed, we fallback to creating a new formatter or 
    // we could keep a small cache if this becomes a bottleneck.
    // For now, most of our app uses 2 decimals.
    let formatted: string;
    if (decimals === 2) {
        formatted = currencyFormatter.format(amount);
    } else {
        formatted = new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(amount);
    }
    
    return includeSymbol ? `₹${formatted}` : formatted;
};

/**
 * Formats a date as DD/MM/YYYY.
 */
export const formatDate = (date: Date | string | number): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    return dateFormatter.format(d);
};
