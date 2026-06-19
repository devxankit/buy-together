import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { loadGoogleMaps, geocodeAddress } from '../../../utils/googleMaps';

/**
 * LocationAutocomplete
 * --------------------
 * A Google Places-backed location picker styled to match the admin forms.
 * The admin types a place, picks from live suggestions, and the chosen text is
 * stored as a plain string via `onChange`. If the Maps script can't load (no
 * key / network / API disabled) it degrades to a normal free-text input so the
 * form still works.
 *
 * Props:
 *   value       current location string
 *   onChange    (string) => void — fires on every keystroke and on select
 *   placeholder input placeholder
 */
const LocationAutocomplete = ({ value = '', onChange, onCoordinates, placeholder = 'Search city or area…' }) => {
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
        
        // Dynamically import the modern places library if importLibrary is present
        if (google.maps.importLibrary) {
          google.maps.importLibrary('places')
            .then((placesLib) => {
              if (!alive) return;
              if (placesLib.AutocompleteSuggestion) {
                suggestionServiceRef.current = placesLib.AutocompleteSuggestion;
                tokenRef.current = new google.maps.places.AutocompleteSessionToken();
                setReady(true);
              } else {
                // Fallback to legacy
                serviceRef.current = new google.maps.places.AutocompleteService();
                tokenRef.current = new google.maps.places.AutocompleteSessionToken();
                setReady(true);
              }
            })
            .catch((err) => {
              console.warn('Failed to import modern places library, falling back to legacy AutocompleteService:', err);
              if (!alive) return;
              serviceRef.current = new google.maps.places.AutocompleteService();
              tokenRef.current = new google.maps.places.AutocompleteSessionToken();
              setReady(true);
            });
        } else {
          // Fallback to legacy AutocompleteService
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
      // Modern AutocompleteSuggestion API
      const request = {
        input,
        includedRegionCodes: ['in'],
        sessionToken: tokenRef.current,
      };

      suggestionServiceRef.current.fetchAutocompleteSuggestions(request)
        .then(({ suggestions: preds }) => {
          setLoading(false);
          const formatted = (preds || []).map((s) => {
            const p = s.placePrediction;
            return {
              place_id: p.placeId,
              description: p.text?.toString() || p.description || '',
              structured_formatting: {
                main_text: p.structuredFormat?.mainText?.text || p.text?.toString() || p.description || '',
                secondary_text: p.structuredFormat?.secondaryText?.text || '',
              },
            };
          });
          setSuggestions(formatted);
        })
        .catch((err) => {
          console.error('AutocompleteSuggestion fetch failed:', err);
          setLoading(false);
          setSuggestions([]);
        });
    } else if (serviceRef.current) {
      // Legacy AutocompleteService API
      serviceRef.current.getPlacePredictions(
        {
          input,
          types: ['(regions)'],
          componentRestrictions: { country: 'in' },
          sessionToken: tokenRef.current,
        },
        (preds, status) => {
          setLoading(false);
          const ok = window.google?.maps?.places?.PlacesServiceStatus?.OK;
          setSuggestions(status === ok && preds ? preds : []);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const handleInput = (e) => {
    const text = e.target.value;
    onChange?.(text);
    // Manually edited text invalidates any previously resolved pinpoint — the
    // admin must pick a suggestion again to attach coordinates.
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
    // Resolve the picked place to pinpoint coordinates for distance sorting.
    if (onCoordinates) {
      geocodeAddress(prediction.description)
        .then((coords) => onCoordinates(coords))
        .catch(() => onCoordinates(null));
    }
    // Fresh session token for the next lookup (Places billing best practice).
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
    <div style={{ position: 'relative' }}>
      <div
        className="admin-focusable"
        style={{ display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 12px', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg }}
      >
        <MapPin size={16} color={T.faint} strokeWidth={2.1} />
        <input
          className="admin-input"
          value={value}
          onChange={handleInput}
          onFocus={() => value && suggestions.length > 0 && setOpen(true)}
          onBlur={() => { blurTimer.current = setTimeout(() => setOpen(false), 150); }}
          placeholder={failed ? 'Enter location' : placeholder}
          style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: T.ink, fontWeight: 500 }}
          autoComplete="off"
        />
        {loading && <Loader2 size={15} color={T.faint} className="admin-spin" />}
        {!loading && value && (
          <button type="button" onClick={clear} className="admin-icon-btn" title="Clear" style={{ border: 'none', background: 'transparent', color: T.faint, cursor: 'pointer', display: 'inline-flex', padding: 0 }}>
            <X size={15} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          style={{ position: 'absolute', left: 0, right: 0, top: 'calc(100% + 6px)', zIndex: 20, background: T.surface, border: `1px solid ${T.line}`, borderRadius: radius.lg, boxShadow: T.shadowLg, overflow: 'hidden', maxHeight: 240, overflowY: 'auto' }}
          className="admin-scroll"
        >
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handlePick(s); }}
              className="admin-btn"
              style={{ display: 'flex', alignItems: 'flex-start', gap: 9, width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', borderBottom: `1px solid ${T.lineSoft}`, background: 'transparent', cursor: 'pointer' }}
            >
              <MapPin size={15} color={T.primary} strokeWidth={2.1} style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.structured_formatting?.main_text || s.description}
                </span>
                {s.structured_formatting?.secondary_text && (
                  <span style={{ display: 'block', fontSize: 11.5, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.structured_formatting.secondary_text}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
