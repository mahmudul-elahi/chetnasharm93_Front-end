'use client';
import { useState, useEffect } from 'react';

const currencySymbols: Record<string, string> = {
  USD: '$', INR: '₹', GBP: '£', EUR: '€', CAD: 'C$', AUD: 'A$',
  PKR: '₨', BDT: '৳', NGN: '₦', JPY: '¥', CNY: '¥', KRW: '₩',
  RUB: '₽', BRL: 'R$', MXN: '$', ZAR: 'R', SGD: 'S$', MYR: 'RM',
  THB: '฿', VND: '₫', PHP: '₱', IDR: 'Rp', TRY: '₺', SAR: '﷼',
  AED: 'د.إ', CHF: 'Fr', SEK: 'kr', NOK: 'kr', DKK: 'kr', PLN: 'zł',
};

const fallbackRates: Record<string, number> = {
  INR: 83, GBP: 0.79, EUR: 0.92, CAD: 1.35, AUD: 1.51,
  PKR: 278, BDT: 109, NGN: 1480, JPY: 148, CNY: 7.2,
};

export const useUserCurrency = (amountUSD: number) => {
  const [formatted, setFormatted] = useState(`$${amountUSD}`);
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const convert = async () => {
      try {
        // Use ip-api.com instead (free, no API key, no CORS issues)
        const geo = await fetch('http://ip-api.com/json/');
        const data = await geo.json();
        
        if (data.status === 'success') {
          // Map country to currency
          const countryToCurrency: Record<string, string> = {
            'US': 'USD', 'IN': 'INR', 'GB': 'GBP', 'CA': 'CAD',
            'AU': 'AUD', 'PK': 'PKR', 'BD': 'BDT', 'NG': 'NGN',
            'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
            'JP': 'JPY', 'CN': 'CNY', 'KR': 'KRW', 'BR': 'BRL',
            'MX': 'MXN', 'ZA': 'ZAR', 'SG': 'SGD', 'MY': 'MYR',
          };
          
          const currency = countryToCurrency[data.countryCode] || 'USD';
          setCurrencyCode(currency);
          
          if (currency === 'USD') {
            setFormatted(`$${amountUSD}`);
          } else {
            // Try to get live rate, fallback if fails
            try {
              const rateRes = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${currency}`);
              if (rateRes.ok) {
                const rateData = await rateRes.json();
                if (rateData.rates && rateData.rates[currency]) {
                  const converted = amountUSD * rateData.rates[currency];
                  const symbol = currencySymbols[currency] || currency;
                  setFormatted(`${symbol}${converted.toFixed(2)}`);
                  setLoading(false);
                  return;
                }
              }
              throw new Error('API failed');
            } catch {
              // Use fallback rate
              const rate = fallbackRates[currency] || 83;
              const converted = amountUSD * rate;
              const symbol = currencySymbols[currency] || currency;
              setFormatted(`${symbol}${converted.toFixed(2)}`);
            }
          }
        } else {
          throw new Error('Geolocation failed');
        }
      } catch (error) {
        console.error('Currency detection error:', error);
        setFormatted(`$${amountUSD}`);
      } finally {
        setLoading(false);
      }
    };
    
    convert();
  }, [amountUSD]);

  return { formatted, loading, currencyCode };
};