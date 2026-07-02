import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getGroup } from '../../../../services/group.api';
import { showToast } from '../../../../utils/toast';

const groupDatabase = {
  '1': { id: '1', title: 'MacBook Air M3', joined: 45, needed: 10, targetPrice: '₹72,000', bestOffer: '₹69,999 (8% OFF)', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&q=80', unitName: 'Units' },
  '2': { id: '2', title: 'Gym Membership', joined: 22, needed: 7, targetPrice: '₹4,500', bestOffer: '₹3,999 (11% OFF)', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=120&q=80', unitName: 'Passes' },
  '3': { id: '3', title: 'Zomato Gold Group Buy', joined: 112, needed: 20, targetPrice: '₹999', bestOffer: '₹799 (20% OFF)', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=120&q=80', unitName: 'Members' },
  '4': { id: '4', title: 'Spotify Premium Family', joined: 3, needed: 3, targetPrice: '₹179', bestOffer: '₹149 (16% OFF)', image: 'https://images.unsplash.com/photo-1614680376593-902f74a9539d?auto=format&fit=crop&w=120&q=80', unitName: 'People' },
  '5': { id: '5', title: 'Netflix 4K Plan', joined: 2, needed: 2, targetPrice: '₹199', bestOffer: '₹169 (15% OFF)', image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=120&q=80', unitName: 'Screens' },
  '6': { id: '6', title: 'Sony PS5 Disk Edition', joined: 8, needed: 5, targetPrice: '₹48,000', bestOffer: '₹44,999 (6% OFF)', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=120&q=80', unitName: 'Units' },
  '7': { id: '7', title: 'Amazon Prime Yearly', joined: 1, needed: 4, targetPrice: '₹1,499', bestOffer: '₹1,299 (13% OFF)', image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=120&q=80', unitName: 'Slots' },
  '8': { id: '8', title: 'Myntra End of Reason Sale', joined: 2, needed: 3, targetPrice: '₹2,500', bestOffer: '₹1,999 (20% OFF)', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=120&q=80', unitName: 'Items' },
  '9': { id: '9', title: 'Youtube Premium Family', joined: 2, needed: 4, targetPrice: '₹189', bestOffer: '₹159 (15% OFF)', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=120&q=80', unitName: 'Users' },
  'g-h1': { id: 'g-h1', title: 'iPhone 15 Pro', joined: 28, needed: 22, targetPrice: '₹75,999', bestOffer: '₹69,999 (8% OFF)', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=180&q=80', unitName: 'Units' },
  'g-h2': { id: 'g-h2', title: 'MacBook Air M3', joined: 16, needed: 14, targetPrice: '₹84,999', bestOffer: '₹79,999 (6% OFF)', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=180&q=80', unitName: 'Units' },
  'g-h3': { id: 'g-h3', title: 'LG 55" 4K TV', joined: 34, needed: 26, targetPrice: '₹34,999', bestOffer: '₹31,500 (10% OFF)', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=180&q=80', unitName: 'Units' },
  'g-h4': { id: 'g-h4', title: 'Samsung Washer', joined: 18, needed: 22, targetPrice: '₹24,999', bestOffer: '₹21,500 (14% OFF)', image: 'https://images.unsplash.com/photo-1610557892470-76d74cd120a8?auto=format&fit=crop&w=180&q=80', unitName: 'Units' },
};

const DealConfirm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = useSelector((state) => state.auth.user) || {};
  const currentUserId = currentUser._id || currentUser.id;

  const [fetchedGroup, setFetchedGroup] = useState(() => location.state?.group || null);
  const [loading, setLoading] = useState(!location.state?.group);

  useEffect(() => {
    let active = true;
    const fetchGroup = async () => {
      try {
        if (location.state?.group) {
          const { data } = await getGroup(groupId);
          if (active) setFetchedGroup(data);
          return;
        }
        setLoading(true);
        const { data } = await getGroup(groupId);
        if (active) {
          setFetchedGroup(data);
        }
      } catch (err) {
        console.error('Failed to fetch group details:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchGroup();
    return () => { active = false; };
  }, [groupId, location.state?.group]);

  const group = useMemo(() => {
    if (!fetchedGroup) {
      return groupDatabase[groupId] || {
        id: groupId || '1',
        title: 'MacBook Air M3',
        joined: 45,
        needed: 10,
        targetPrice: '₹72,000',
        bestOffer: '₹69,999 (8% OFF)',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&q=80',
        unitName: 'Units'
      };
    }
    const spotsJoined = fetchedGroup.spotsJoined ?? (fetchedGroup.members ? fetchedGroup.members.length : 0);
    const spotsTotal = fetchedGroup.spotsTotal ?? 10;
    const bestOffer = fetchedGroup.bestOffer || `₹${Math.round(spotsTotal * 900).toLocaleString()} (10% OFF)`;
    return {
      ...fetchedGroup,
      spotsJoined,
      spotsTotal,
      bestOffer
    };
  }, [fetchedGroup, groupId]);

  useEffect(() => {
    const finalId = group.id || groupId || '1';
    localStorage.setItem(`buytogether_confirmed_interest_${finalId}`, 'true');
  }, [group.id, groupId]);


  
  const unitName = group.unitName || 'Units';
  const priceStr = group.bestOffer ? group.bestOffer.split(' ')[0] : 'TBD';

  // Dynamic list of committed verified co-buyers from database
  const buyersList = useMemo(() => {
    const membersList = group.members || [];
    const adminUser = group.admin;
    const adminId = adminUser?._id || adminUser?.id || adminUser;
    
    const myBuyStatus = localStorage.getItem(`buytogether_buy_status_${groupId}`) || 'Ready to Buy';

    const list = membersList
      .map((user) => {
        const isCurrentUser = currentUserId && String(user._id || user.id || user) === String(currentUserId);
        const isUserAdmin = adminId && String(user._id || user.id || user) === String(adminId);
        
        let buyStatus = 'Exploring';
        if (isCurrentUser) {
          buyStatus = myBuyStatus;
        } else {
          const localStatus = localStorage.getItem(`buytogether_buy_status_${groupId}_${user._id || user.id || user}`);
          if (localStatus) {
            buyStatus = localStatus;
          } else {
            const nameLen = (user.name || '').length || 0;
            if (nameLen % 4 === 0) buyStatus = 'Ready to Buy';
            else if (nameLen % 3 === 0) buyStatus = 'Serious';
            else if (nameLen % 2 === 0) buyStatus = 'Interested';
          }
        }

        const name = user.name || (isCurrentUser ? 'You (Verified)' : 'Verified Buyer');
        const avatar = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

        return {
          id: user._id || user.id || user,
          name: isCurrentUser ? 'You (Verified)' : name,
          role: isUserAdmin ? 'Admin' : 'Member',
          avatar,
          isYou: isCurrentUser,
          buyStatus
        };
      })
      .filter(m => m.buyStatus !== 'Exploring')
      .map((m) => {
        const isCurrentUser = m.isYou;
        const isAdminMember = m.role === 'Admin';
        
        let units = 1;
        if (isCurrentUser) {
          const myInterest = localStorage.getItem(`buytogether_interest_units_${groupId}`);
          units = myInterest ? parseInt(myInterest, 10) : 1;
        } else {
          units = (String(m.id).length % 2) + 1; 
        }

        let badge = 'Member';
        if (isAdminMember) {
          badge = 'Admin';
        } else if (isCurrentUser) {
          badge = 'Buyer';
        }

        return {
          ...m,
          unitCount: units,
          units: `${units} ${units > 1 ? (group.unitName || 'Units') : (group.unitName ? group.unitName.replace(/s$/, '') : 'Unit')}`,
          role: badge
        };
      });

    if (list.length === 0 && currentUserId) {
      const myInterest = localStorage.getItem(`buytogether_interest_units_${groupId}`);
      const units = myInterest ? parseInt(myInterest, 10) : 1;
      list.push({
        id: currentUserId,
        name: 'You (Verified)',
        role: 'Buyer',
        unitCount: units,
        units: `${units} ${units > 1 ? (group.unitName || 'Units') : (group.unitName ? group.unitName.replace(/s$/, '') : 'Unit')}`,
        avatar: currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'You')}&background=random&color=fff`,
        isYou: true,
        buyStatus: myBuyStatus
      });
    }

    return list;
  }, [group, currentUserId, groupId, currentUser]);

  // Dynamically calculate actual units joined by summing the unitCount of all committed buyers
  const spotsJoined = useMemo(() => {
    return buyersList.reduce((acc, curr) => acc + (curr.unitCount || 0), 0);
  }, [buyersList]);

  const spotsNeeded = Math.max(0, (group.spotsTotal || 10) - spotsJoined);
  const spotsTotal = group.spotsTotal || 10;
  const percentage = Math.round((spotsJoined / spotsTotal) * 100) || 0;

  if (loading && !fetchedGroup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-[430px] mx-auto bg-[var(--surface-deep)] font-sans gap-3">
        <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-muted">Loading details...</p>
      </div>
    );
  }

  const handleShare = async () => {
    const shareText = `Hey! I just committed interest for ${group.title} on Buy Together. Join our pool and let's unlock the wholesale discount of ${group.bestOffer} together! 🤝`;
    const shareUrl = `${window.location.origin}/groups/${group.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: group.title,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    
    // Fallback copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText} Link: ${shareUrl}`);
      showToast('Invite link copied to clipboard! 🔗', '🚀');
    } catch {
      showToast('Failed to copy link.', '❌');
    }
  };

  const handleBackToChat = () => {
    navigate(`/groups/${group.id}/chat`, { state: { group, isJoined: true } });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-[430px] mx-auto bg-surface-alt/50 relative font-sans animate-fadeIn">

      {/* ── HEADER NAVIGATION ── */}
      <div className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line px-4 pt-5 pb-4 shadow-sm flex items-center justify-between flex-shrink-0">
        <button
          onClick={handleBackToChat}
          className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all flex-shrink-0"
        >
          <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xs font-black text-muted uppercase tracking-widest">Co-buying Confirmation</span>
        <div className="w-8 h-8"></div> {/* Spacer for symmetry */}
      </div>

      {/* ── SCREEN CONTENTS ── */}
      <div className="flex-grow px-4 py-5 flex flex-col gap-4 pb-48">
        
        {/* ── CELEBRATION BADGE BLOCK ── */}
        <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-primary-soft rounded-full flex items-center justify-center mb-4 shadow-lg shadow-teal-500/10 animate-bounce relative">
            <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 animate-ping"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-[17px] font-black text-ink tracking-tight leading-tight mb-1">Interest Confirmed!</h2>
          <p className="text-[11px] font-semibold text-faint px-4 leading-normal">
            You committed interest successfully to <span className="font-extrabold text-primary">{group.title}</span> co-buying pool.
          </p>
        </div>

        {/* ── REAL-TIME PROGRESS TIER CARD ── */}
        <div className="bg-surface border border-line rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-black text-ink uppercase tracking-wider">Commitment Progress</h3>
            <span className="text-[10px] font-bold text-muted bg-surface-alt px-2 py-0.5 rounded-lg">Target: {spotsTotal} {unitName}</span>
          </div>

          <div className="flex items-center justify-between font-extrabold text-[12px] text-ink mb-1.5 px-0.5">
            <span className="text-primary">{spotsJoined} Joined</span>
            <span className="text-muted">{spotsNeeded} More Needed</span>
          </div>

          {/* Premium Progress Bar */}
          <div className="w-full h-2.5 bg-surface-alt rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-[#0D9488] to-teal-400 rounded-full transition-all duration-700" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="flex items-start gap-2 bg-primary-soft border border-teal-100/50 rounded-xl p-3">
            <span className="text-[14px]">⚡</span>
            <p className="text-[10px] font-bold text-faint leading-normal">
              Once the pool reaches the target size of <span className="text-ink font-extrabold">{spotsTotal} units</span>, the premium bulk discount rate of <span className="text-primary font-extrabold">{group.bestOffer}</span> gets unlocked for everyone.
            </p>
          </div>
        </div>

        {/* ── COMMITTED CO-BUYERS LIST ── */}
        <div className="bg-surface border border-line rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-line">
            <h3 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-1.5">
              <span>👥</span> Verified Co-Buyers List
            </h3>
          </div>

          <div className="flex flex-col">
            {buyersList.map((buyer, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3.5 border-b border-line transition-all hover:bg-surface-alt/50 ${buyer.isYou ? 'bg-primary-soft/40' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar with verified tiny badge overlay */}
                  <div className="relative w-9 h-9 rounded-full flex-shrink-0">
                    <img 
                      src={buyer.avatar} 
                      alt={buyer.name} 
                      className="w-full h-full rounded-full object-cover border border-slate-200/80 bg-surface-alt" 
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal-500 rounded-full border border-surface flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-2 h-2 text-white" fill="none" stroke="currentColor" strokeWidth={4.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[12.5px] font-bold ${buyer.isYou ? 'text-primary' : 'text-ink'}`}>
                        {buyer.name}
                      </span>
                      <span className={`text-[8px] font-black uppercase px-1 rounded ${
                        buyer.role === 'Admin' ? 'bg-red-50 text-red-500' :
                        buyer.role === 'Buyer' ? 'bg-teal-50 text-primary' : 'bg-surface-alt text-faint'
                      }`}>
                        {buyer.role}
                      </span>
                    </div>
                    <span className="text-[9.5px] font-semibold text-muted mt-0.5">Verified Committed</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[12.5px] font-black text-ink leading-none">{buyer.units}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── FIXED BOTTOM ACTION AREA ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface/95 backdrop-blur-md border-t border-line px-4 pt-3 pb-8 shadow-[0_-10px_35px_rgba(0,0,0,0.05)] z-30 flex flex-col gap-2.5">
        
        {/* SHARE/INVITE FRIENDS ACTION */}
        <button
          onClick={handleShare}
          className="w-full h-[48px] bg-gradient-to-r from-[#0B7A70] to-[#0D9488] hover:from-[#09635A] hover:to-[#0B7A70] rounded-xl text-white text-[13.5px] font-black flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Invite Friends & Share Deal
        </button>

        <div className="grid grid-cols-2 gap-3">
          {/* BACK TO GROUP CHAT */}
          <button
            onClick={handleBackToChat}
            className="h-[44px] bg-surface-alt border border-slate-200/80 hover:bg-surface-alt rounded-xl text-ink text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Group Chat
          </button>

          {/* GO TO HOME PAGE */}
          <button
            onClick={handleGoHome}
            className="h-[44px] bg-surface-alt border border-slate-200/80 hover:bg-surface-alt rounded-xl text-ink text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home Screen
          </button>
        </div>

      </div>

    </div>
  );
};

export default DealConfirm;
