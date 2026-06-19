import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlist, fetchWishlist } from '../../../../redux/slices/wishlistSlice';

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const loaded = useSelector((state) => state.wishlist.loaded);

  // Ensure saved groups are loaded (e.g. on a hard refresh / direct visit).
  useEffect(() => {
    if (!loaded) dispatch(fetchWishlist());
  }, [loaded, dispatch]);

  const handleGroupClick = (group) => {
    navigate(`/groups/${group.id || group.groupId}/chat`, { state: { group, isJoined: false } });
  };

  const handleRemove = (e, group) => {
    e.stopPropagation();
    dispatch(toggleWishlist(group));
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans pb-20">
      <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-surface sticky top-0 z-30 shadow-sm shadow-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 bg-surface-alt rounded-full active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-extrabold text-ink">My Wishlist</h1>
        </div>
      </div>

      <div className="px-5 py-4">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-faint max-w-[250px]">Explore groups and tap the heart icon to save them for later.</p>
            <button 
              onClick={() => navigate('/categories')}
              className="mt-6 bg-teal-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm active:scale-95 transition-all"
            >
              Explore Groups
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {wishlistItems.map((group, index) => (
              <div 
                key={index}
                onClick={() => handleGroupClick(group)}
                className="bg-surface rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-line flex flex-col active:scale-95 transition-transform"
              >
                <div className="h-32 bg-surface-alt relative w-full">
                  <img src={group.image} alt={group.title} className="w-full h-full object-cover" />
                  <button 
                    onClick={(e) => handleRemove(e, group)}
                    className="absolute top-2 right-2 w-7 h-7 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute top-2 left-2 bg-surface/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[9px] font-bold text-ink shadow-sm">
                    {group.location || 'Local'}
                  </div>
                </div>
                
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider mb-1 block">{group.category || 'Group'}</span>
                    <h3 className="font-bold text-ink text-xs leading-tight line-clamp-2">{group.title}</h3>
                  </div>

                  {/* Real group metrics — buyers progress + deadline */}
                  <div className="mt-2.5 pt-2.5 border-t border-line flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-teal-600">
                        {group.spotsJoined ?? 0}/{group.spotsTotal ?? 0} <span className="text-muted font-bold">buyers</span>
                      </span>
                      <span className="text-[9px] font-bold text-muted">{group.daysLeft || '—'}</span>
                    </div>
                    <div className="h-[4px] bg-surface-alt rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${group.spotsTotal ? Math.min(100, Math.round((group.spotsJoined / group.spotsTotal) * 100)) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
