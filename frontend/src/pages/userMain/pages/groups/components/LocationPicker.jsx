import { useEffect, useRef, useState, useCallback } from 'react';
import { loadGoogleMaps, geocodeAddress } from '../../../../../utils/googleMaps';

/**
 * LocationPicker
 * --------------
 * Google Places-backed location search for the consumer Create Group form,
 * styled with the app's Tailwind tokens. The buyer types a place, picks an
 * exact suggestion (address / establishment / area — not just a city), and the
 * chosen text is stored via `onChange` while its pinpoint `{ lat, lng }` is
 * resolved and emitted via `onCoordinates`. Distance sorting on Explore keys off
 * those coordinates, so picking a precise place is what makes "nearest first"
 * meaningful.
 *
 * If the Maps script can't load (no key / offline / API disabled) it degrades to
 * a plain free-text input so group creation still works — just without a pinpoint.
 *
 * Props:
 *   value         current location string
 *   onChange      (string) => void — fires on each keystroke and on select
 *   onCoordinates ({lat,lng}|null) => void — pinpoint for the picked place
 *   placeholder   input placeholder
 */
const LocationPicker = ({ value = '', onChange, onCoordinates, placeholder = 'Search your area, address or landmark…' }) => {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const serviceRef = useRef(null);
  const suggestionServiceRef = useRef(null);
  const tokenRef = useRef(null);
  const debounceRef = useRef(null);
  const blurTimer = useRef(null);

  // Load Maps + Places once, then stand up the prediction service.
  useEffect(() => {
    let alive = true;
    loadGoogleMaps()
      .then((google) => {
        if (!alive) return;
        if (google.maps.importLibrary) {
          google.maps
            .importLibrary('places')
            .then((placesLib) => {
              if (!alive) return;
              if (placesLib.AutocompleteSuggestion) {
                suggestionServiceRef.current = placesLib.AutocompleteSuggestion;
              } else {
                serviceRef.current = new google.maps.places.AutocompleteService();
              }
              tokenRef.current = new google.maps.places.AutocompleteSessionToken();
              setReady(true);
            })
            .catch(() => {
              if (!alive) return;
              serviceRef.current = new google.maps.places.AutocompleteService();
              tokenRef.current = new google.maps.places.AutocompleteSessionToken();
              setReady(true);
            });
        } else {
          serviceRef.current = new google.maps.places.AutocompleteService();
          tokenRef.current = new google.maps.places.AutocompleteSessionToken();
          setReady(true);
        }
      })
      .catch((err) => {
        console.error('Google Maps Script failed to load:', err);
        if (alive) setFailed(true);
      });

    return () => {
      alive = false;
      clearTimeout(debounceRef.current);
      clearTimeout(blurTimer.current);
    };
  }, []);

  const fetchPredictions = useCallback((input) => {
    if (input.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    if (suggestionServiceRef.current) {
      // Modern AutocompleteSuggestion API — no type filter so buyers can pick
      // an exact address/landmark, not just a city region.
      suggestionServiceRef.current
        .fetchAutocompleteSuggestions({
          input,
          includedRegionCodes: ['in'],
          sessionToken: tokenRef.current,
        })
        .then(({ suggestions: preds }) => {
          setLoading(false);
          const formatted = (preds || []).map((s) => {
            const p = s.placePrediction;
            return {
              place_id: p.placeId,
              description: p.text?.toString() || p.description || '',
              main_text: p.structuredFormat?.mainText?.text || p.text?.toString() || '',
              secondary_text: p.structuredFormat?.secondaryText?.text || '',
            };
          });
          setSuggestions(formatted);
        })
        .catch(() => {
          setLoading(false);
          setSuggestions([]);
        });
    } else if (serviceRef.current) {
      serviceRef.current.getPlacePredictions(
        { input, componentRestrictions: { country: 'in' }, sessionToken: tokenRef.current },
        (preds, status) => {
          setLoading(false);
          const ok = window.google?.maps?.places?.PlacesServiceStatus?.OK;
          setSuggestions(
            status === ok && preds
              ? preds.map((p) => ({
                  place_id: p.place_id,
                  description: p.description,
                  main_text: p.structured_formatting?.main_text || p.description,
                  secondary_text: p.structured_formatting?.secondary_text || '',
                }))
              : []
          );
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const handleInput = (e) => {
    const text = e.target.value;
    onChange?.(text);
    // Typed text invalidates any previously resolved pinpoint — the buyer must
    // pick a suggestion again to re-attach coordinates.
    onCoordinates?.(null);
    setOpen(true);
    if (!ready) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(text), 250);
  };

  const handlePick = (prediction) => {
    onChange?.(prediction.description);
    setSuggestions([]);
    setOpen(false);
    // Resolve the picked place to a precise pinpoint for distance sorting.
    geocodeAddress(prediction.description)
      .then((coords) => onCoordinates?.(coords))
      .catch(() => onCoordinates?.(null));
    if (window.google?.maps?.places) {
      tokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  };

  const clear = () => {
    onChange?.('');
    onCoordinates?.(null);
    setSuggestions([]);
    setOpen(false);
  };

  const showDropdown = open && ready && suggestions.length > 0;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-surface-alt border border-line rounded-xl px-3 py-2.5 focus-within:border-primary focus-within:bg-surface transition-all">
        <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={handleInput}
          onFocus={() => value && suggestions.length > 0 && setOpen(true)}
          onBlur={() => { blurTimer.current = setTimeout(() => setOpen(false), 150); }}
          placeholder={failed ? 'Enter your location' : placeholder}
          autoComplete="off"
          className="flex-1 min-w-0 text-xs font-bold text-ink placeholder:text-muted bg-transparent outline-none"
        />
        {loading && <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />}
        {!loading && value && (
          <button type="button" onClick={clear} className="flex-shrink-0 text-muted hover:text-ink active:scale-90 transition-all" title="Clear">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-surface border border-line rounded-xl shadow-xl overflow-hidden max-h-[240px] overflow-y-auto animate-slideDown">
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handlePick(s); }}
              className="w-full flex items-start gap-2 text-left px-3 py-2.5 border-b border-line last:border-b-0 hover:bg-surface-alt transition-all"
            >
              <svg className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-ink truncate">{s.main_text || s.description}</span>
                {s.secondary_text && <span className="block text-[10px] font-semibold text-muted truncate">{s.secondary_text}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
