/**
 * Loads the Google Maps JavaScript API (with the Places library) exactly once,
 * no matter how many components ask for it. Returns a promise that resolves to
 * the global `google` namespace.
 *
 * The key comes from VITE_GOOGLE_MAPS_API_KEY. It ships in the client bundle
 * (unavoidable for the Maps JS API) — lock it down by HTTP referrer in the
 * Google Cloud console.
 */
let loaderPromise = null;

export const loadGoogleMaps = () => {
  // Already loaded (e.g. a previous component pulled it in).
  if (typeof window !== 'undefined' && window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      reject(new Error('VITE_GOOGLE_MAPS_API_KEY is not set'));
      return;
    }

    const callbackName = '__buyTogetherInitGoogleMaps__';
    window[callbackName] = () => {
      resolve(window.google);
      delete window[callbackName];
    };

    const script = document.createElement('script');
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}` +
      `&libraries=places&loading=async&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      loaderPromise = null; // allow a later retry
      reject(new Error('Failed to load the Google Maps script'));
    };
    document.head.appendChild(script);
  });

  return loaderPromise;
};

/**
 * Reverse-geocodes latitude and longitude into "City, State" using Google Maps Geocoder.
 */
export const reverseGeocode = async (lat, lng) => {
  const google = await loadGoogleMaps();
  const geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const addressComponents = results[0].address_components;
        let city = '';
        let state = '';
        for (const component of addressComponents) {
          const types = component.types;
          if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_3') && !city) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_2') && !city) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
        }
        const loc = city && state ? `${city}, ${state}` : city || state || 'Unknown Location';
        resolve(loc);
      } else {
        reject(new Error(`Geocoding failed with status: ${status}`));
      }
    });
  });
};

/**
 * Fetches matching city autocomplete suggestions from Google Places API.
 */
export const getPlaceSuggestions = async (input) => {
  if (!input || !input.trim()) return [];
  const google = await loadGoogleMaps();
  const service = new google.maps.places.AutocompleteService();
  return new Promise((resolve) => {
    service.getPlacePredictions(
      {
        input,
        types: ['(cities)'],
        componentRestrictions: { country: 'in' }, // Focused on Indian cities
      },
      (predictions, status) => {
        if (status === 'OK' && predictions) {
          resolve(predictions.map((p) => p.description));
        } else {
          resolve([]);
        }
      }
    );
  });
};

/**
 * Geocodes an address string into { lat, lng } using the Google Geocoder.
 * Resolves to null if the address can't be resolved.
 */
export const geocodeAddress = async (address) => {
  if (!address || !address.trim()) return null;
  const google = await loadGoogleMaps();
  const geocoder = new google.maps.Geocoder();
  return new Promise((resolve) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location;
        resolve({ lat: loc.lat(), lng: loc.lng() });
      } else {
        resolve(null);
      }
    });
  });
};

/**
 * Great-circle distance in kilometres between two { lat, lng } points
 * (Haversine formula). Returns null if either point is missing coordinates.
 */
export const haversineKm = (a, b) => {
  if (!a || !b || a.lat == null || a.lng == null || b.lat == null || b.lng == null) return null;
  const R = 6371; // Earth radius (km)
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

