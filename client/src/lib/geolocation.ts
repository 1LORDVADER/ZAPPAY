/**
 * Geolocation service for detecting user's state
 * Uses ipapi.co free tier (HTTPS-compatible)
 */

export interface GeolocationData {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  status: 'success' | 'fail';
  message?: string;
}

const GEOLOCATION_CACHE_KEY = 'zappay_user_location';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get user's location from IP address
 */
export async function getUserLocation(): Promise<GeolocationData | null> {
  try {
    // Check cache first
    const cached = localStorage.getItem(GEOLOCATION_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    // Fetch from API (using ipapi.co for HTTPS support)
    const response = await fetch('https://ipapi.co/json/');
    const apiData = await response.json();
    
    // Map ipapi.co response to our GeolocationData interface
    const data: GeolocationData = {
      country: apiData.country_name || '',
      countryCode: apiData.country_code || '',
      region: apiData.region_code || '',
      regionName: apiData.region || '',
      city: apiData.city || '',
      zip: apiData.postal || '',
      lat: apiData.latitude || 0,
      lon: apiData.longitude || 0,
      timezone: apiData.timezone || '',
      isp: apiData.org || '',
      status: 'success',
    };

    if (data.countryCode) {
      // Cache the result
      localStorage.setItem(GEOLOCATION_CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      return data;
    }

    return null;
  } catch (error) {
    console.error('Failed to get user location:', error);
    return null;
  }
}

/**
 * Get user's state abbreviation (e.g., "CA", "NY")
 */
export async function getUserState(): Promise<string | null> {
  const location = await getUserLocation();
  return location?.region || null;
}

/**
 * Clear cached location (useful when user manually selects a different state)
 */
export function clearLocationCache(): void {
  localStorage.removeItem(GEOLOCATION_CACHE_KEY);
}

/**
 * Manually set user's state (overrides geolocation)
 */
export function setUserState(stateAbbr: string): void {
  localStorage.setItem('zappay_user_state_override', stateAbbr);
}

/**
 * Get user's state (checks override first, then geolocation)
 */
export async function getEffectiveUserState(): Promise<string | null> {
  const override = localStorage.getItem('zappay_user_state_override');
  if (override) {
    return override;
  }
  return getUserState();
}

/**
 * Clear state override
 */
export function clearStateOverride(): void {
  localStorage.removeItem('zappay_user_state_override');
}
