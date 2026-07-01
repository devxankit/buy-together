import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../../../services/category.api';
import { createGroup } from '../../../../services/group.api';
import { uploadImage } from '../../../../services/upload.api';
import { useUserMainContext } from '../../context';
import { showToast } from '../../../../utils/toast';
import { normalizeImageForUpload } from '../../../../utils/image';
import { captureImageViaFlutter, isFlutterCameraBridge } from '../../../../utils/flutterBridge';
import LocationPicker from './components/LocationPicker';

// Persist the in-progress form so an accidental refresh (or navigating away and
// back) doesn't wipe everything the user typed. Cleared on a successful create.
const DRAFT_KEY = 'create_group_draft';
const readDraft = () => {
  try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY)) || {}; }
  catch { return {}; }
};

const CreateGroup = () => {
  const navigate = useNavigate();
  const { selectedCity } = useUserMainContext();

  const [draft] = useState(readDraft); // one-time read of any saved draft

  // Form Fields
  const [groupName, setGroupName] = useState(draft.groupName || '');
  const [goal, setGoal] = useState(draft.goal || 10);
  const [deadline, setDeadline] = useState(draft.deadline || '7');
  const [selectedMainCat, setSelectedMainCat] = useState(draft.selectedMainCat || '');
  const [selectedSubCat, setSelectedSubCat] = useState(draft.selectedSubCat || '');
  const [productName, setProductName] = useState(draft.productName || '');
  const [productDesc, setProductDesc] = useState(draft.productDesc || '');

  // Image Upload Fields
  const [image, setImage] = useState(draft.image || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploadErr, setUploadErr] = useState('');
  const [showSourceSheet, setShowSourceSheet] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Live Location Field — `liveLocation` is the human label shown to the user,
  // while `coordinates` is the exact device pinpoint used for distance sorting.
  const [liveLocation, setLiveLocation] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [locating, setLocating] = useState(true);

  // Dynamic Categories Fields
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Dropdown States
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [isDeadlineOpen, setIsDeadlineOpen] = useState(false);

  // Geolocation lookup on mount. We keep the *exact* device coordinates (this is
  // what powers nearest-first sorting on Explore) and also build a precise human
  // label down to the neighbourhood/road — not just the city, state.
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // Exact pinpoint — store it regardless of whether the label resolves.
        setCoordinates({ lat, lng });
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          if (data && data.address) {
            const a = data.address;
            const area = a.neighbourhood || a.suburb || a.road || a.hamlet || '';
            const city = a.city || a.town || a.village || a.county || '';
            const state = a.state || '';
            // Most specific first: "Area, City" → "City, State" → whatever exists.
            const loc = [area, city].filter(Boolean).join(', ') || [city, state].filter(Boolean).join(', ') || state;
            if (loc) setLiveLocation(loc);
          }
        } catch (err) {
          console.error('Failed to reverse-geocode coordinates:', err);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.warn('Geolocation permission denied or error:', error);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Keep the draft in sync as the user fills the form (location/coordinates are
  // re-derived from the device on mount, so they aren't persisted).
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
        groupName, goal, deadline, selectedMainCat, selectedSubCat, productName, productDesc, image,
      }));
    } catch { /* storage full / unavailable — ignore */ }
  }, [groupName, goal, deadline, selectedMainCat, selectedSubCat, productName, productDesc, image]);

  // Fetch active categories on mount
  useEffect(() => {
    let active = true;
    const fetchCats = async () => {
      try {
        const { data } = await getCategories();
        if (active) {
          setCategories(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        if (active) setLoadingCategories(false);
      }
    };
    fetchCats();
    return () => { active = false; };
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadErr('');

    // Don't reject on MIME/size up front: camera captures inside the Flutter
    // WebView often arrive oversized and with an empty/octet-stream type.
    // Normalization re-encodes them to a compact JPEG so they pass the server's
    // strict image-only, 5MB filter. Only genuine non-images are blocked, and
    // only after we've confirmed the file can't be decoded as an image.
    setUploadingImage(true);
    setUploadPct(0);
    try {
      const normalized = await normalizeImageForUpload(file);

      // If normalization couldn't produce an image (returned the original) and
      // the source clearly isn't an image, stop with a clear message.
      const looksLikeImage =
        normalized.type?.startsWith('image/') || file.type?.startsWith('image/');
      if (!looksLikeImage) {
        setUploadErr('Please select an image file.');
        return;
      }
      if (normalized.size > 5 * 1024 * 1024) {
        setUploadErr('Image is too large even after compression. Try a smaller photo.');
        return;
      }

      const { data } = await uploadImage(normalized, { folder: 'groups', onProgress: setUploadPct });
      setImage(data.url);
    } catch (err) {
      setUploadErr(err.response?.data?.message || 'Upload failed. Try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Camera capture. Inside the Flutter wrapper we go through the native bridge
  // (image_picker → base64 → File) because the WebView's own file-chooser camera
  // path doesn't return the photo. In a normal mobile browser we fall back to a
  // standard capture input, which opens the OS camera directly.
  const handleCameraCapture = async () => {
    setUploadErr('');
    if (isFlutterCameraBridge()) {
      try {
        const file = await captureImageViaFlutter();
        if (file) await handleImageUpload(file); // null = user cancelled
      } catch (err) {
        console.error('Native camera capture failed:', err);
        setUploadErr('Camera failed. Try uploading from the gallery instead.');
      }
      return;
    }
    cameraInputRef.current?.click();
  };

  // Entry point for the upload area. Inside the Flutter wrapper the OS file
  // chooser's camera option is broken, so we present our own Gallery/Camera
  // choice (Camera → native bridge). In a normal browser the standard file
  // input already offers both, so we just open it directly.
  const openImagePicker = () => {
    setUploadErr('');
    if (isFlutterCameraBridge()) {
      setShowSourceSheet(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const chooseGallery = () => {
    setShowSourceSheet(false);
    fileInputRef.current?.click();
  };

  const chooseCamera = () => {
    setShowSourceSheet(false);
    handleCameraCapture();
  };

  const canSubmit = () => {
    return (
      groupName.trim().length >= 3 &&
      selectedMainCat !== '' &&
      selectedSubCat !== '' &&
      goal >= 2 &&
      productName.trim().length >= 2 &&
      // An exact pinpoint is required so the group can be ranked by distance on
      // Explore. Auto-detected on mount, or set by picking a search suggestion.
      !!(coordinates && coordinates.lat != null && coordinates.lng != null)
    );
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!canSubmit() || submitting) return;

    setSubmitting(true);
    setError('');

    // Same field shape the admin console posts — only management fields
    // (status/slogan/image/location) are omitted and default on the server.
    const payload = {
      title: groupName.trim(),
      productName: productName.trim(),
      category: selectedMainCat,
      subCategory: selectedSubCat,
      type: 'user',
      spotsTotal: Number(goal),
      image: image || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=260&q=80',
      location: liveLocation || selectedCity || 'Indore, MP',
      // Exact pinpoint so Explore's nearest-first sorting differentiates this
      // group from others in the same city. Null only if geolocation was denied.
      coordinates: coordinates || null,
      description: productDesc.trim(),
      // Convert the "N days" picker into an absolute deadline.
      closesAt: new Date(Date.now() + parseInt(deadline, 10) * 86400000).toISOString(),
    };

    try {
      await createGroup(payload);
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      showToast('Group created successfully! 🎉');
      navigate('/groups');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the group. Please try again.');
      setSubmitting(false);
    }
  };

  const selectedCatObj = categories.find(
    (c) => c.name.toLowerCase() === selectedMainCat?.toLowerCase() || c.slug.toLowerCase() === selectedMainCat?.toLowerCase()
  );
  const subCategoriesList = selectedCatObj ? (selectedCatObj.subCategories || []) : [];

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[430px] mx-auto bg-surface font-sans overflow-hidden">

      {/* ── SCROLLABLE FORM ── */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-6 pb-28">

        {/* ── TYPOGRAPHIC HERO TITLE ── */}
        <div className="pb-2 border-b border-line">
          <h1 className="text-[20px] font-black text-ink tracking-tight">Create Co-Buying Group</h1>
          <p className="text-[11px] text-muted font-semibold mt-0.5">Fill in the fields below to launch a new buying pool</p>
        </div>

        {/* ── SECTION 1: BASIC INFORMATION ── */}
        <div className="flex flex-col gap-3 pb-5 border-b border-line">
          <h3 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Group Profile
          </h3>

          <div>
            <label className="text-[10px] font-bold text-muted block mb-1">Group Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value.slice(0, 60))}
              placeholder="e.g. Indore MacBook Buyers, Pune EV Group"
              className="w-full text-xs font-bold text-ink placeholder:text-muted bg-surface-alt border border-line rounded-xl px-3 py-2.5 outline-none focus:border-primary focus:bg-surface transition-all"
              required
            />
            <p className="text-[9px] text-muted font-medium mt-1 text-right">{groupName.length}/60</p>
          </div>

          <div className="mt-1">
            <label className="text-[10px] font-bold text-muted block mb-1.5">Cover Image</label>
            
            {image ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-line bg-surface-alt">
                <img src={image} alt="Group preview" className="w-full h-full object-cover" />
                {uploadingImage && (
                  <div className="absolute inset-0 bg-ink/60 flex flex-col items-center justify-center gap-2 text-white">
                    <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    <span className="text-[11px] font-bold">Uploading... {uploadPct}%</span>
                  </div>
                )}
                {!uploadingImage && (
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={openImagePicker}
                      className="w-8 h-8 rounded-lg bg-black/60 hover:bg-black/80 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="w-8 h-8 rounded-lg bg-red-500/90 hover:bg-red-600 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openImagePicker}
                className="w-full h-32 rounded-xl border-2 border-dashed border-line hover:border-primary/50 bg-surface-alt flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
              >
                {uploadingImage ? (
                  <>
                    <span className="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                    <span className="text-[12px] font-bold text-ink">Uploading... {uploadPct}%</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-[12px] font-bold text-ink">Click to upload a group photo</span>
                    <span className="text-[10px] text-faint">PNG, JPG, WebP — up to 5MB</span>
                  </>
                )}
              </button>
            )}

            {uploadErr && <p className="text-[10px] font-bold text-red-500 mt-1">{uploadErr}</p>}
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(file);
                }
                e.target.value = ''; // allow re-picking the same file
              }}
            />

            {/* Browser-only camera fallback (used when the Flutter bridge is absent). */}
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(file);
                }
                e.target.value = '';
              }}
            />

            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Or paste an image URL..."
              className="w-full text-[11px] font-bold text-ink placeholder:text-muted bg-surface-alt border border-line rounded-lg px-2.5 py-1.5 mt-2 outline-none focus:border-primary focus:bg-surface transition-all"
            />
          </div>
        </div>

        {/* ── SECTION 1b: GROUP LOCATION (exact pinpoint) ── */}
        <div className="flex flex-col gap-3 pb-5 border-b border-line">
          <h3 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Group Location
          </h3>

          <div>
            <label className="text-[10px] font-bold text-muted block mb-1">
              Search an exact area or address <span className="text-red-400">*</span>
            </label>
            <LocationPicker
              value={liveLocation}
              onChange={setLiveLocation}
              onCoordinates={setCoordinates}
            />
            {coordinates ? (
              <p className="text-[9.5px] font-bold text-primary mt-1.5 flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Exact pinpoint set — buyers nearby will find this group first.
              </p>
            ) : locating ? (
              <p className="text-[9.5px] font-semibold text-muted mt-1.5">Detecting your location…</p>
            ) : (
              <p className="text-[9.5px] font-semibold text-amber-600 mt-1.5">
                Pick a suggestion to attach an exact pinpoint so nearby buyers can find you.
              </p>
            )}
          </div>
        </div>

        {/* ── SECTION 2: DYNAMIC CATEGORY & SUB-CATEGORY ── */}
        <div className="flex flex-col gap-3.5 pb-5 border-b border-line">
          <h3 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Category Classification
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="text-[10px] font-bold text-muted block mb-1">Category <span className="text-red-400">*</span></label>
              <button
                type="button"
                onClick={() => {
                  setIsMainOpen(!isMainOpen);
                  setIsSubOpen(false);
                  setIsDeadlineOpen(false);
                }}
                className={`w-full flex items-center justify-between text-xs font-bold text-ink bg-surface-alt/50 border rounded-xl px-3 py-2.5 outline-none transition-all cursor-pointer ${
                  isMainOpen ? 'border-primary bg-surface ring-2 ring-[#0D9488]/10' : 'border-slate-200/80'
                }`}
              >
                <span className="truncate">{selectedMainCat ? categories.find(c => c.name.toLowerCase() === selectedMainCat.toLowerCase() || c.slug.toLowerCase() === selectedMainCat.toLowerCase())?.name || selectedMainCat : 'Select Category'}</span>
                <svg className={`w-3.5 h-3.5 text-muted transition-transform duration-200 flex-shrink-0 ml-1 ${isMainOpen ? 'rotate-180 text-primary' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isMainOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMainOpen(false)}></div>
                  <div className="absolute left-0 right-0 bottom-full mb-1.5 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 max-h-[220px] overflow-y-auto animate-slideDown">
                    {loadingCategories ? (
                      <div className="px-3.5 py-2.5 text-xs font-bold text-muted">Loading…</div>
                    ) : categories.length === 0 ? (
                      <div className="px-3.5 py-2.5 text-xs font-bold text-muted">No Categories</div>
                    ) : (
                      categories.map(cat => (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => {
                            setSelectedMainCat(cat.name);
                            setSelectedSubCat('');
                            setIsMainOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 text-left text-xs font-bold transition-all hover:bg-surface-alt ${
                            selectedMainCat?.toLowerCase() === cat.name.toLowerCase() || selectedMainCat?.toLowerCase() === cat.slug.toLowerCase() ? 'text-primary bg-primary-soft' : 'text-faint'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold text-muted block mb-1">Sub-Category <span className="text-red-400">*</span></label>
              <button
                type="button"
                disabled={!selectedMainCat}
                onClick={() => {
                  setIsSubOpen(!isSubOpen);
                  setIsMainOpen(false);
                  setIsDeadlineOpen(false);
                }}
                className={`w-full flex items-center justify-between text-xs font-bold transition-all cursor-pointer rounded-xl px-3 py-2.5 outline-none ${
                  !selectedMainCat 
                    ? 'bg-surface-alt border border-slate-200/50 text-slate-300 cursor-not-allowed opacity-60' 
                    : isSubOpen 
                      ? 'border-primary bg-surface ring-2 ring-[#0D9488]/10 text-ink' 
                      : 'bg-surface-alt/50 border border-slate-200/80 text-ink'
                }`}
              >
                <span className="truncate">{selectedSubCat || 'Select Sub'}</span>
                <svg className={`w-3.5 h-3.5 text-muted transition-transform duration-200 flex-shrink-0 ml-1 ${isSubOpen ? 'rotate-180 text-primary' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isSubOpen && selectedMainCat && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSubOpen(false)}></div>
                  <div className="absolute left-0 right-0 bottom-full mb-1.5 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 max-h-[220px] overflow-y-auto animate-slideDown">
                    {subCategoriesList.length === 0 ? (
                      <div className="px-3.5 py-2.5 text-xs font-bold text-muted">No Sub-categories</div>
                    ) : (
                      subCategoriesList.map(sub => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            setSelectedSubCat(sub);
                            setIsSubOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 text-left text-xs font-bold transition-all hover:bg-surface-alt ${
                            selectedSubCat === sub ? 'text-primary bg-primary-soft' : 'text-faint'
                          }`}
                        >
                          {sub}
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── SECTION 3: GROUP GOAL & TIMELINE ── */}
        <div className="flex flex-col gap-4 pb-5 border-b border-line">
          <h3 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            Deal Target & Duration
          </h3>

          {/* Counters */}
          <div>
            <label className="text-[10px] font-bold text-muted block mb-1.5">Minimum Buyers Required <span className="text-red-400">*</span></label>
            <div className="flex items-center justify-between bg-surface-alt/50 border border-slate-200/60 rounded-xl px-4 py-2">
              <button
                type="button"
                onClick={() => setGoal(Math.max(2, goal - 1))}
                className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center active:scale-90 transition-all text-faint hover:bg-slate-200"
              >
                <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
              </button>
              <div className="text-center flex items-baseline gap-1">
                <span className="text-[20px] font-black text-primary">{goal}</span>
                <span className="text-[9px] font-bold text-muted">buyers</span>
              </div>
              <button
                type="button"
                onClick={() => setGoal(Math.min(500, goal + 1))}
                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center active:scale-90 transition-all text-white hover:bg-teal-600 shadow-sm"
              >
                <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            {/* Quick selectors */}
            <div className="flex gap-1.5 mt-2 justify-between">
              {[5, 10, 25, 50, 100].map(n => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setGoal(n)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all active:scale-95 border ${goal === n ? 'bg-primary text-white border-transparent shadow-sm' : 'bg-surface border-slate-200/60 text-faint hover:bg-surface-alt'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Duration selection dropdown */}
          <div className="relative">
            <label className="text-[10px] font-bold text-muted block mb-1">Group Timeline Deadline <span className="text-red-400">*</span></label>
            <button
              type="button"
              onClick={() => {
                setIsDeadlineOpen(!isDeadlineOpen);
                setIsMainOpen(false);
                setIsSubOpen(false);
              }}
              className={`w-full flex items-center justify-between text-xs font-bold text-ink bg-surface-alt/50 border rounded-xl px-3 py-2.5 outline-none transition-all cursor-pointer ${
                isDeadlineOpen ? 'border-primary bg-surface ring-2 ring-[#0D9488]/10' : 'border-slate-200/80'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {deadline === '3' && '3 Days (Fast track)'}
                {deadline === '7' && '7 Days (Standard)'}
                {deadline === '14' && '14 Days (Extended)'}
                {deadline === '30' && '30 Days (Maximum window)'}
              </span>
              <svg className={`w-3.5 h-3.5 text-muted transition-transform duration-200 flex-shrink-0 ${isDeadlineOpen ? 'rotate-180 text-primary' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDeadlineOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDeadlineOpen(false)}></div>
                {/* Opens UPWARD so it stays in viewport */}
                <div className="absolute left-0 right-0 bottom-full mb-1.5 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-slideDown">
                  {[
                    {
                      val: '3',
                      label: '3 Days',
                      sublabel: 'Fast track',
                      icon: (
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                      )
                    },
                    {
                      val: '7',
                      label: '7 Days',
                      sublabel: 'Standard',
                      icon: (
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      )
                    },
                    {
                      val: '14',
                      label: '14 Days',
                      sublabel: 'Extended',
                      icon: (
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                        </svg>
                      )
                    },
                    {
                      val: '30',
                      label: '30 Days',
                      sublabel: 'Maximum window',
                      icon: (
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                        </svg>
                      )
                    }
                  ].map(item => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => {
                        setDeadline(item.val);
                        setIsDeadlineOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 transition-all hover:bg-surface-alt ${
                        deadline === item.val ? 'text-primary bg-primary-soft' : 'text-faint'
                      }`}
                    >
                      <span className={`${deadline === item.val ? 'text-primary' : 'text-muted'}`}>
                        {item.icon}
                      </span>
                      <span className="flex flex-col">
                        <span className="text-xs font-black">{item.label}</span>
                        <span className="text-[9px] font-semibold opacity-70">{item.sublabel}</span>
                      </span>
                      {deadline === item.val && (
                        <svg className="w-3.5 h-3.5 text-primary ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── SECTION 4: PRODUCT SPECIFICS ── */}
        <div className="flex flex-col gap-3 pb-5 border-b border-line">
          <h3 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Target Product Specs
          </h3>

          <div>
            <label className="text-[10px] font-bold text-muted block mb-1">Product Model / Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value.slice(0, 80))}
              placeholder="e.g. Apple iPad Air M2 128GB Space Gray"
              className="w-full text-xs font-bold text-ink placeholder:text-muted bg-surface-alt border border-line rounded-xl px-3 py-2.5 outline-none focus:border-primary focus:bg-surface transition-all"
              required
            />
            <p className="text-[9px] text-muted font-medium mt-1 text-right">{productName.length}/80</p>
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted block mb-1">Requirements Description <span className="text-muted font-normal">(optional)</span></label>
            <textarea
              value={productDesc}
              onChange={e => setProductDesc(e.target.value.slice(0, 300))}
              placeholder="Describe color variants, storage configurations, or details about the supplier quote..."
              className="w-full text-xs font-semibold text-ink placeholder:text-muted bg-surface-alt border border-line rounded-xl px-3 py-2 outline-none focus:border-primary focus:bg-surface transition-all resize-none"
              rows={2}
            />
            <p className="text-[9px] text-muted font-medium mt-0.5 text-right">{productDesc.length}/300</p>
          </div>
        </div>

        {/* ── SECTION 5: LIVE SUMMARY BOX ── */}
        <div className="bg-gradient-to-r from-teal-50/80 to-[#F0FDF9]/80 border border-teal-100/50 rounded-2xl p-4 flex flex-col gap-2.5">
          <p className="text-[10.5px] font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            LIVE PREVIEW SUMMARY
          </p>
          <div className="flex flex-col gap-1.5 text-[11px] font-semibold text-faint">
            <div className="flex justify-between items-center border-b border-teal-100/50 pb-1">
              <span className="opacity-75">Pool Name:</span>
              <span className="text-ink font-extrabold truncate max-w-[200px]">{groupName || 'Unspecified Name'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-teal-100/50 pb-1">
              <span className="opacity-75">Target Product:</span>
              <span className="text-ink font-extrabold truncate max-w-[200px]">{productName || 'Unspecified Product'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-teal-100/50 pb-1">
              <span className="opacity-75">Category Range:</span>
              <span className="text-ink font-extrabold">{selectedMainCat ? `${selectedMainCat} › ${selectedSubCat || 'Sub-cat'}` : 'Not Categorized'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-teal-100/50 pb-1">
              <span className="opacity-75">Location:</span>
              <span className="flex items-center gap-1 text-ink font-extrabold truncate max-w-[210px]">
                {coordinates && (
                  <svg className="w-3 h-3 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                <span className="truncate">
                  {locating ? 'Detecting exact location…' : liveLocation || selectedCity || 'Location unavailable'}
                </span>
              </span>
            </div>
            {!locating && !coordinates && (
              <p className="text-[9.5px] font-bold text-amber-600 -mt-1">
                ⚠ Exact pinpoint not captured — enable location access so buyers can find this group nearby.
              </p>
            )}
            <div className="flex justify-between items-center pt-0.5">
              <span className="opacity-75">Deal Target:</span>
              <span className="text-ink font-extrabold">{goal} Buyers • {deadline} Days Limit</span>
            </div>
          </div>
        </div>

      </form>

      {/* ── FIXED BOTTOM ACTION BUTTON ── */}
      <div className="flex-shrink-0 bg-surface border-t border-line px-4 py-3 shadow-[0_-8px_35px_rgba(0,0,0,0.04)] z-30">
        {error && (
          <p className="text-[11px] font-bold text-red-500 mb-2 text-center">{error}</p>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit() || submitting}
          className="w-full h-[48px] bg-primary hover:bg-[#0B7A70] rounded-xl text-white text-[13.5px] font-black flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
        >
          {submitting ? (
            'Creating…'
          ) : (
            <>
              <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create Group &amp; Launch
            </>
          )}
        </button>
      </div>

      {/* ── IMAGE SOURCE CHOOSER (Gallery / Camera) ──
          Shown only inside the Flutter wrapper, where the OS file-chooser's
          camera option doesn't work. Camera routes through the native bridge. */}
      {showSourceSheet && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end" onClick={() => setShowSourceSheet(false)}>
          <div className="absolute inset-0 bg-black/40 animate-fadeIn" />
          <div
            className="relative bg-surface rounded-t-2xl px-5 pt-4 pb-6 shadow-2xl animate-slideUp w-full max-w-[430px] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-line mx-auto mb-4" />
            <p className="text-[11px] font-black text-ink uppercase tracking-wider text-center mb-3">Add group photo</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={chooseCamera}
                className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-line bg-surface-alt active:scale-95 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-[12px] font-bold text-ink">Camera</span>
              </button>
              <button
                type="button"
                onClick={chooseGallery}
                className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-line bg-surface-alt active:scale-95 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-[12px] font-bold text-ink">Gallery</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowSourceSheet(false)}
              className="w-full mt-3 py-2.5 text-[12px] font-bold text-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateGroup;
