export const getCurrencySymbol = (currency: string): string => {
  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CAD: '$',
    AUD: '$',
  };

  return currencySymbols[currency] || currency;
};
