import { getCountryForTimezone } from "countries-and-timezones";

/**
 * Automatically detect user's country code (e.g., 'bd', 'in', 'us')
 * based on the browser's timezone. Fallback to 'bd'.
 */
export function getBrowserCountry(): string {
  if (typeof window === "undefined") {
    return "bd";
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      const country = getCountryForTimezone(tz);
      if (country?.id) {
        return country.id.toLowerCase();
      }
    }
  } catch (err) {
    // ignore and fallback
  }

  return "bd";
}
