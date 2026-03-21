/**
 * Standardized formatters for Aequitas platform.
 */

/**
 * Formats a number as Indian currency (e.g., 1,23,456.78).
 */
export const formatCurrency = (
  amount: number,
  includeSymbol: boolean = true,
  decimals: number = 2
): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const formatted = formatter.format(amount);
  return includeSymbol ? `₹${formatted}` : formatted;
};

/**
 * Formats a date as DD/MM/YYYY.
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
};
