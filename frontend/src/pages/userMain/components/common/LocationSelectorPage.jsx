import React, { useState, useEffect } from 'react';
import { reverseGeocode, getPlaceSuggestions } from '../../../../utils/googleMaps';
import { showToast } from '../../../../utils/toast';

/**
 * Premium dedicated Location Selector Page component.
 * Features a clean, high-fidelity full-screen presentation covering the viewport
 * with robust search, geographic quick detection, and geometric gradients for popular cities.
 */
const LocationSelectorPage = ({ selectedLocation, setSelectedLocation, onClose }) => {
  const [locationSearch, setLocationSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const popularLocations = [
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Bengaluru, Karnataka',
    'Hyderabad, Telangana',
    'Chennai, Tamil Nadu',
    'Pune, Maharashtra',
    'Indore, Madhya Pradesh',
    'Ahmedabad, Gujarat',
    'Kolkata, West Bengal',
    'Jaipur, Rajasthan',
  ];

  // Debounced Autocomplete search
  useEffect(() => {
    if (!locationSearch.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await getPlaceSuggestions(locationSearch);
        setSearchResults(results);
      } catch (err) {
        console.error('Failed to autocomplete:', err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [locationSearch]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', '⚠️');
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const locName = await reverseGeocode(lat, lng);
          setSelectedLocation(locName);
          showToast('Location updated successfully! 📍');
          onClose();
        } catch (err) {
          console.error(err);
          showToast('Failed to reverse-geocode coordinates.', '❌');
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        showToast(error.message || 'Permission denied or location unavailable.', '❌');
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="fixed inset-0 z-[300] bg-surface flex flex-col animate-slideUp max-w-[430px] mx-auto shadow-2xl border-x border-line">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-line bg-surface">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-ink active:scale-90 transition-all border border-line"
          aria-label="Back"
        >
          <svg className="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex flex-col">
          <h2 className="text-base font-black text-ink leading-tight">Select Location</h2>
          <p className="text-[10px] font-bold text-muted mt-0.5">Choose your city for local group deals</p>
        </div>
      </div>

      {/* Search and Current Location */}
      <div className="px-5 pt-4 pb-3 flex flex-col gap-3">
        {/* Search Bar */}
        <div className="relative flex items-center bg-surface-alt border border-line rounded-2xl h-12 px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
          <svg className="w-4 h-4 text-muted flex-shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            autoFocus
            type="text"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="Search for your city..."
            className="flex-1 text-xs font-semibold text-ink placeholder:text-muted bg-transparent outline-none border-none h-full"
          />
          {locationSearch && (
            <button
              onClick={() => setLocationSearch('')}
              className="w-6 h-6 rounded-full bg-line/55 flex items-center justify-center text-ink/75 active:scale-90 transition-all"
            >
              <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Detect Location Option */}
        <button
          onClick={handleDetectLocation}
          disabled={detecting}
          className="flex items-center gap-3 px-4 py-3 bg-primary-soft/40 hover:bg-primary-soft/60 border border-primary/15 rounded-2xl transition-all active:scale-[0.98] text-left disabled:opacity-70 disabled:active:scale-100"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            {detecting ? (
              <span className="w-4.5 h-4.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4.5 h-4.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path strokeLinecap="round" d="M12 2v2M12 20v2M2 12h2M20 12h2" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-xs font-extrabold text-primary leading-tight">
              {detecting ? 'Detecting Location...' : 'Detect Current Location'}
            </p>
            <p className="text-[10px] font-bold text-teal-800/70 mt-0.5">Using GPS or internet provider</p>
          </div>
        </button>
      </div>

      {/* Cities Container */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {locationSearch.trim() ? (
          // Search results view
          <>
            <h3 className="text-[11.5px] font-black text-muted tracking-wider uppercase mb-3.5">
              Search Results
            </h3>
            {searching ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-muted">Searching locations...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-bold text-ink mb-1">No cities found</p>
                <p className="text-xs text-muted">Try typing another city name</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {searchResults.map((loc) => {
                  const parts = loc.split(',');
                  const cityName = parts[0]?.trim() || '';
                  const subText = parts.slice(1).map((p) => p.trim()).join(', ');
                  const isSelected = selectedLocation === loc;

                  return (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        onClose();
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all active:scale-95 text-left ${
                        isSelected
                          ? 'bg-primary-soft/50 border-primary/30 shadow-sm shadow-primary/5'
                          : 'bg-surface border-line hover:border-slate-300'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[12.5px] font-black leading-tight truncate ${isSelected ? 'text-primary' : 'text-ink'}`}>
                          {cityName}
                        </p>
                        <p className="text-[10px] font-bold text-muted truncate mt-0.5">
                          {subText}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 ml-auto">
                          <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          // Popular cities grid view
          <>
            <h3 className="text-[11.5px] font-black text-muted tracking-wider uppercase mb-3.5">Popular Cities</h3>
            <div className="grid grid-cols-2 gap-3">
              {popularLocations.map((loc) => {
                const cityName = loc.split(',')[0];
                const stateName = loc.split(',')[1]?.trim() || '';
                const initials = cityName.substring(0, 3).toUpperCase();
                const isSelected = selectedLocation === loc;

                const schemeMap = {
                  'Mumbai': 'from-[#0D9488] to-[#14B8A6]',
                  'Delhi': 'from-[#E11D48] to-[#F43F5E]',
                  'Bengaluru': 'from-[#2563EB] to-[#3B82F6]',
                  'Hyderabad': 'from-[#7C3AED] to-[#8B5CF6]',
                  'Chennai': 'from-[#D97706] to-[#F59E0B]',
                  'Pune': 'from-[#059669] to-[#10B981]',
                  'Indore': 'from-[#4F46E5] to-[#6366F1]',
                  'Ahmedabad': 'from-[#DB2777] to-[#EC4899]',
                  'Kolkata': 'from-[#9333EA] to-[#A855F7]',
                  'Jaipur': 'from-[#EA580C] to-[#F97316]'
                };
                const scheme = schemeMap[cityName] || 'from-teal-600 to-teal-500';

                return (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      onClose();
                    }}
                    className={`flex items-center gap-3 p-3 rounded-[22px] border transition-all active:scale-95 text-left ${
                      isSelected
                        ? 'bg-primary-soft/50 border-primary/30 shadow-sm shadow-primary/5'
                        : 'bg-surface border-line hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-[16px] bg-gradient-to-br ${scheme} flex items-center justify-center text-white text-xs font-black shadow-md flex-shrink-0`}>
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[12.5px] font-black leading-tight truncate ${isSelected ? 'text-primary' : 'text-ink'}`}>
                        {cityName}
                      </p>
                      <p className="text-[10px] font-bold text-muted truncate mt-0.5">
                        {stateName}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 ml-auto">
                        <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LocationSelectorPage;
