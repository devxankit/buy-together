import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUser } from '../../../../redux/slices/authSlice';
import { useTheme } from '../../context';
import { uploadImage } from '../../../../services/upload.api';
import { getUserProfile, updateUserProfile } from '../../../../services/user.api';
import { showToast } from '../../../../utils/toast';

const getPlaceholderAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  const currentUser = useSelector((state) => state.auth.user) || {};
  const [uploading, setUploading] = React.useState(false);
  const [showBenefits, setShowBenefits] = React.useState(false);

  const MEMBER_BENEFITS = [
    { icon: '🎯', title: 'Priority access', desc: 'Jump the queue on closing-soon groups before spots run out.' },
    { icon: '💸', title: 'Exclusive deals', desc: 'Member-only group prices and early access to new launches.' },
    { icon: '⚡', title: 'Faster support', desc: 'Your support tickets are prioritised by our team.' },
    { icon: '🛡️', title: 'Trusted badge', desc: 'Your verified badge builds trust with other buyers in groups.' },
  ];

  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    let active = true;
    const fetchProfile = async () => {
      try {
        const { data } = await getUserProfile();
        if (active) {
          dispatch(updateUser(data));
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
      }
    };
    fetchProfile();
    return () => { active = false; };
  }, [dispatch]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data } = await uploadImage(file, { folder: 'misc' });
      const avatarUrl = data.url;

      // Update database profile
      await updateUserProfile({ avatar: avatarUrl });

      // Update Redux state
      dispatch(updateUser({ avatar: avatarUrl }));

      showToast('Profile photo updated! 📸');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload photo.', '❌');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userStats = currentUser.stats || {};
  const stats = [
    { label: 'Groups Joined', route: '/groups', value: String(userStats.groupsJoined ?? 0), icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg> },
    { label: 'Groups Created', route: '/groups', value: String(userStats.groupsCreated ?? 0), icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { label: 'Deals Booked', route: '/deals', value: String(userStats.dealsBooked ?? 0), icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
    { label: 'Active Pools', route: '/groups', value: String(userStats.activePools ?? 0), icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg> },
  ];

  const shortcuts = [
    { label: 'Wishlist', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> },
    { label: 'My Deals', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /> },
    { label: 'My Groups', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
    // 'Help & Support' tile removed — it duplicated 'Help Center' in the
    // Support & Legal section below (both opened /help-center).
  ];

  const orders = [
    { label: 'All Orders', value: '0', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /> },
    { label: 'Confirmed', value: '0', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /> },
    { label: 'In Progress', value: '0', color: 'text-orange-500', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /> },
    { label: 'Completed', value: '0', color: 'text-green-500', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { label: 'Cancelled', value: '0', color: 'text-red-500', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  ];
  orders[2].icon = <path d="M8 16a2 2 0 01-2 2m0 0a2 2 0 01-2-2m4 0h6m0 0a2 2 0 012 2m-2-2a2 2 0 012-2m0 0h2a1 1 0 001-1v-4a1 1 0 00-1-1h-2m-8 0h6m0 0V8a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2h2zm4-6v4m0 0H8" strokeLinecap="round" strokeLinejoin="round" />;

  const settings = [
    { label: 'Personal Information', route: '/personal-info', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
    { label: 'Privacy Settings', route: '/privacy-settings', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
  ];

  const legal = [
    { label: 'Help Center', route: '/help-center', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { label: 'Terms & Conditions', route: '/terms', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { label: 'Privacy Policy', route: '/privacy-policy', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
    { label: 'Community Guidelines', route: '/community-guidelines', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
    { label: 'About Us', route: '/about', rightText: 'Version 2.3.1', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  ];

  const handleRoute = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[var(--surface-deep)] font-sans pb-28 relative">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-0 left-0 w-full h-[320px] overflow-hidden z-0">
        <div className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full bg-[var(--primary-soft)] blur-3xl opacity-60"></div>
        <div className="absolute -top-[50px] -left-[150px] w-[350px] h-[350px] rounded-full bg-primary-glow/10 blur-3xl opacity-40"></div>
      </div>

      {/* Header Area */}
      <div className="relative z-10 px-5 pt-4 pb-6">
        {/* Spacer for top */}
        <div className="mb-6"></div>

        <div className="flex items-center gap-4 relative">
          <div className="relative flex-shrink-0 cursor-pointer" onClick={() => !uploading && fileInputRef.current?.click()}>
            <img src={currentUser.avatar || getPlaceholderAvatar(currentUser.name)} alt={currentUser.name} className="w-[75px] h-[75px] rounded-full object-cover border-2 border-[var(--surface)] shadow-md" style={uploading ? { opacity: 0.6 } : undefined} />
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-surface border border-line rounded-full flex items-center justify-center shadow-sm text-primary active:scale-95 transition-all">
              {uploading ? (
                <span className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" disabled={uploading} />
          </div>
          <div className="flex-1 flex flex-col items-start min-w-0 justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <h2 className="text-[17px] font-extrabold text-ink truncate leading-none">{currentUser.name || 'Unnamed User'}</h2>
              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="bg-primary-soft text-primary px-1.5 py-0.5 rounded text-[8.5px] font-bold tracking-tight mb-1.5 w-fit">
              Verified Member
            </div>
            <p className="text-[10.5px] font-semibold text-muted mb-1 w-full truncate">{currentUser.phone || 'No phone number'}</p>
            <p className="text-[9.5px] font-bold text-muted flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {currentUser.location || 'Location not set'}
            </p>
          </div>
          <button onClick={() => navigate('/personal-info')} className="flex-shrink-0 bg-surface border border-line rounded-full px-2.5 py-1.5 shadow-sm text-[9.5px] font-bold text-primary flex items-center gap-1 active:scale-95 transition-all self-center mt-2">
            Edit Profile
            <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative z-10 px-5 flex flex-col gap-5">
        
        {/* Stats Row */}
        <div className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-line p-4 flex justify-between">
          {stats.map((item, idx) => (
            <React.Fragment key={idx}>
              <div
                onClick={() => handleRoute(item.route)}
                className="flex flex-col items-center flex-1 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="text-primary mb-1.5">
                  {item.icon}
                </div>
                <span className="text-[14px] font-black text-ink mb-0.5 leading-none">{item.value}</span>
                <span className="text-[8px] font-bold text-muted text-center leading-tight max-w-[50px]">{item.label}</span>
              </div>
              {idx < stats.length - 1 && <div className="w-[1px] bg-line my-1"></div>}
            </React.Fragment>
          ))}
        </div>

        {/* Verified Banner */}
        <div className="bg-gradient-to-r from-[var(--primary-deep)] to-[var(--primary)] rounded-[20px] p-4 flex items-center justify-between shadow-md shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-surface opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full border border-surface/20 flex items-center justify-center flex-shrink-0 bg-surface/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-[13px] font-extrabold text-white">Verified Member</h3>
                <div className="w-3.5 h-3.5 bg-surface rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2 h-2 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <p className="text-[9.5px] font-medium text-white/90 leading-tight pr-2">Enjoy exclusive deals, priority access to closing soon groups and more benefits.</p>
            </div>
          </div>
          <button
            onClick={() => setShowBenefits(true)}
            className="flex-shrink-0 bg-surface text-primary text-[9.5px] font-bold rounded-full px-3 py-2 flex items-center gap-1 active:scale-95 transition-all shadow-sm"
          >
            View Benefits
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>

        {/* Member benefits sheet (opened from "View Benefits") */}
        {showBenefits && (
          <div
            onClick={() => setShowBenefits(false)}
            className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] bg-surface rounded-t-[24px] sm:rounded-[24px] p-5 pb-7 flex flex-col gap-4 animate-slideUp"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-black text-ink">Verified Member Benefits</h3>
                <button
                  onClick={() => setShowBenefits(false)}
                  className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center active:scale-90 transition-all"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {MEMBER_BENEFITS.map((b) => (
                  <div key={b.title} className="flex items-start gap-3 bg-surface-alt rounded-2xl p-3">
                    <span className="text-xl leading-none mt-0.5">{b.icon}</span>
                    <div>
                      <p className="text-[12.5px] font-extrabold text-ink">{b.title}</p>
                      <p className="text-[10.5px] font-medium text-muted leading-tight mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowBenefits(false)}
                className="h-[44px] bg-primary text-white text-[13px] font-black rounded-xl active:scale-95 transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {/* My Shortcuts */}
        <div>
          <h3 className="text-[13px] font-extrabold text-ink mb-3">My Shortcuts</h3>
          <div className="grid grid-cols-4 gap-2">
            {shortcuts.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  if (item.label === 'Wishlist') handleRoute('/wishlist');
                  else if (item.label === 'My Deals') handleRoute('/deals');
                  else if (item.label === 'My Groups') handleRoute('/groups');
                  else handleRoute('/help-center');
                }}
                className="bg-surface border border-line rounded-[18px] p-3 flex flex-col items-center justify-center gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-95 transition-all cursor-pointer hover:border-primary/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  {item.icon}
                </svg>
                <span className="text-[9px] font-bold text-muted text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* My Orders */}
        <div className="bg-surface border border-line rounded-[20px] p-4 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[13px] font-extrabold text-ink">My Orders</h3>
              <span className="bg-surface-alt text-muted px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider border border-line">Coming Soon</span>
            </div>
            <button 
              onClick={() => showToast('Order tracking coming soon! 📦', 'ℹ️')}
              className="text-[10px] font-extrabold text-primary flex items-center gap-0.5 active:scale-95 transition-all"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="flex justify-between">
            {orders.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => showToast('Order tracking coming soon! 📦', 'ℹ️')}
                className="flex flex-col items-center flex-1 cursor-pointer group active:scale-95 transition-all"
              >
                <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center mb-1.5 transition-colors ${item.color || 'text-primary bg-transparent group-hover:bg-primary-soft'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${item.color || 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    {item.icon}
                  </svg>
                </div>
                <span className="text-[9px] font-bold text-ink text-center leading-tight mb-0.5">{item.label}</span>
                <span className="text-[10px] font-black text-muted">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Account & Settings */}
        <div>
          <h3 className="text-[13px] font-extrabold text-ink mb-3">Account & Settings</h3>
          <div className="bg-surface border border-line rounded-[20px] overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
            {settings.map((item, idx) => (
              <div key={idx} onClick={() => handleRoute(item.route)} className={`flex items-center justify-between p-3.5 active:bg-surface-alt transition-colors cursor-pointer border-b border-line`}>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {item.icon}
                  </svg>
                  <span className="text-[11.5px] font-bold text-muted">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.rightText && <span className="text-[10px] font-bold text-muted">{item.rightText}</span>}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
            
            {/* High-Fidelity Dark Mode Toggle Switch */}
            <div className="flex items-center justify-between p-3.5 active:bg-surface-alt transition-colors cursor-pointer" onClick={toggleTheme}>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {theme === 'dark' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  )}
                </svg>
                <span className="text-[11.5px] font-bold text-muted">Dark Mode</span>
              </div>
              <div 
                className="relative w-10 h-5.5 rounded-full transition-colors duration-200 border border-line" 
                style={{ backgroundColor: theme === 'dark' ? 'var(--primary)' : 'var(--line)' }}
              >
                <div 
                  className="absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-surface rounded-full transition-transform duration-200 flex items-center justify-center shadow-sm"
                  style={{ transform: theme === 'dark' ? 'translateX(18px)' : 'translateX(0)' }}
                >
                  {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-primary stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-muted stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Legal */}
        <div>
          <h3 className="text-[13px] font-extrabold text-ink mb-3">Support & Legal</h3>
          <div className="bg-surface border border-line rounded-[20px] overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
            {legal.map((item, idx) => (
              <div key={idx} onClick={() => handleRoute(item.route)} className={`flex items-center justify-between p-3.5 active:bg-surface-alt transition-colors cursor-pointer border-b border-line`}>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {item.icon}
                  </svg>
                  <span className="text-[11.5px] font-bold text-muted">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.rightText && <span className="text-[10px] font-bold text-muted">{item.rightText}</span>}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full bg-danger/10 hover:bg-danger/15 text-danger py-3.5 rounded-[16px] font-extrabold text-[12.5px] flex items-center justify-center gap-2 mt-2 active:scale-[0.98] transition-all border border-danger/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>

      </div>
    </div>
  );
};

export default Profile;
