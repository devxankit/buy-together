import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../../../utils/toast';
import { getGroups } from '../../../../services/group.api';

const getPlaceholderAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;

/**
 * ContactProfile
 * --------------
 * WhatsApp-style contact bottom sheet shared by PersonalChat and GroupChat.
 * Shows the user's avatar, name, phone number (with copy), location and any
 * media shared in the conversation. No calling — copy / message only.
 *
 * profile: { id, name, avatar, phone | number, location, role, buyStatus }
 */
const ContactProfile = ({ open, onClose, profile, sharedMedia = [], onMessage }) => {
  const navigate = useNavigate();
  const [userGroups, setUserGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  useEffect(() => {
    if (!open || !profile) return;
    const targetUserId = String(profile.id || profile._id || '');
    if (!targetUserId) return;

    setLoadingGroups(true);
    Promise.all([
      getGroups({ joined: 'true' }),
      getGroups({ created: 'true' })
    ])
      .then(([joinedRes, createdRes]) => {
        const joined = joinedRes.data || [];
        const created = createdRes.data || [];
        const allGroups = [...created, ...joined];
        
        // Filter groups where targetUserId is a member or admin
        const filtered = allGroups.filter(group => {
          const isAdmin = String(group.admin?._id || group.admin?.id || group.admin) === targetUserId;
          const isMember = group.members?.some(m => String(m._id || m.id || m) === targetUserId);
          return isAdmin || isMember;
        });

        // De-duplicate groups by ID just in case
        const unique = [];
        const seen = new Set();
        for (const g of filtered) {
          const id = String(g.id || g._id);
          if (!seen.has(id)) {
            seen.add(id);
            unique.push(g);
          }
        }

        setUserGroups(unique);
      })
      .catch((err) => {
        console.error('Failed to load groups for contact profile modal:', err);
      })
      .finally(() => {
        setLoadingGroups(false);
      });
  }, [open, profile]);

  if (!open || !profile) return null;

  const name = profile.name || 'User';
  const avatar = profile.avatar || getPlaceholderAvatar(name);

  const rawPhone = profile.phone || profile.number || '';
  const phone = rawPhone
    ? String(rawPhone).trim().startsWith('+')
      ? String(rawPhone).trim()
      : `+91 ${String(rawPhone).trim()}`
    : '';

  const location = profile.location;
  const role = profile.role;
  const buyStatus = profile.buyStatus;

  const handleCopy = () => {
    if (!phone) return;
    navigator.clipboard.writeText(phone.replace(/\s+/g, ''));
    showToast('Phone number copied', '📋');
  };

  const handleGroupClick = (group) => {
    onClose();
    navigate(`/groups/${group.id || group._id}/chat`, { state: { group, isJoined: true } });
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] bg-surface rounded-t-3xl shadow-2xl animate-slideUp flex flex-col max-h-[88vh] overflow-y-auto no-scrollbar pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="sticky top-0 bg-surface pt-3 pb-2 z-10 flex items-center justify-between px-4">
          <div className="w-10" />
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          <button
            onClick={onClose}
            className="w-10 h-8 flex items-center justify-end text-faint hover:text-ink transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center px-6 pt-1 pb-5">
          <img
            src={avatar}
            alt={name}
            className="w-24 h-24 rounded-full object-cover bg-surface-alt border-4 border-surface shadow-lg"
          />
          <h2 className="text-[18px] font-black text-ink mt-3 text-center leading-tight">{name}</h2>
          <div className="flex items-center gap-2 mt-2">
            {role && role !== 'Member' && (
              <span className="text-[9px] font-extrabold text-primary bg-primary-soft px-2 py-0.5 rounded-full uppercase tracking-wider">
                {role}
              </span>
            )}
            {buyStatus && (
              <span className="text-[9px] font-extrabold text-faint bg-surface-alt px-2 py-0.5 rounded-full uppercase tracking-wider">
                {buyStatus}
              </span>
            )}
          </div>
          {location && (
            <p className="text-[11px] font-semibold text-faint mt-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {location}
            </p>
          )}
        </div>

        {/* Phone card */}
        {phone && (
          <div className="mx-4 mb-4 bg-surface-alt/60 border border-line rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-faint uppercase tracking-wider">Phone</span>
              <span className="text-[15px] font-extrabold text-ink mt-0.5 truncate">{phone}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface border border-line rounded-xl text-[11px] font-black text-primary active:scale-95 transition-all flex-shrink-0 hover:bg-primary-soft"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3" />
              </svg>
              Copy
            </button>
          </div>
        )}

        {/* Message action */}
        {onMessage && (
          <div className="px-4 mb-4">
            <button
              onClick={onMessage}
              className="w-full bg-primary text-white rounded-2xl py-3 font-black text-sm active:scale-95 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Message
            </button>
          </div>
        )}

        {/* Joined Groups List */}
        <div className="px-4 mb-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-faint uppercase tracking-wider">
              Joined Groups
            </span>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
              {loadingGroups ? '...' : userGroups.length}
            </span>
          </div>

          {loadingGroups ? (
            <div className="flex flex-col gap-2 mt-1 animate-pulse">
              {[1, 2].map(i => (
                <div key={i} className="h-14 bg-slate-100 rounded-xl w-full" />
              ))}
            </div>
          ) : userGroups.length === 0 ? (
            <p className="text-[12px] text-faint font-semibold text-center py-4 bg-surface-alt/40 border border-dashed border-line rounded-xl">
              No shared groups found
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto no-scrollbar">
              {userGroups.map(group => (
                <div
                  key={group.id || group._id}
                  onClick={() => handleGroupClick(group)}
                  className="flex items-center gap-3 bg-surface border border-line rounded-2xl p-2.5 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer shadow-[0_2px_8px_rgba(15,23,42,0.01)] hover:border-primary/20"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E2E8F0] p-0.5 bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <img src={group.image} alt={group.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[13px] font-black text-ink truncate leading-tight">
                      {group.title}
                    </span>
                    <span className="block text-[10px] text-faint font-semibold truncate mt-0.5">
                      {group.slogan || 'Group chat is active'}
                    </span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#94A3B8] flex-shrink-0 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shared media */}
        {sharedMedia.length > 0 && (
          <div className="px-4 pt-1">
            <span className="text-[10px] font-black text-faint uppercase tracking-wider">
              Shared Media ({sharedMedia.length})
            </span>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {sharedMedia.slice(0, 9).map((img, i) => (
                <div key={i} className="aspect-square bg-surface-alt rounded-md overflow-hidden">
                  <img src={img} alt={`Shared ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactProfile;
