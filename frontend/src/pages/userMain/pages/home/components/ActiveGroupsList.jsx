import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../../../../redux/slices/wishlistSlice';
import WishlistButton from '../../../../../components/ui/WishlistButton';

const ActiveGroupsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const groups = [
    {
      id: 1,
      title: 'MacBook Air M3',
      subtitle: 'Looking for the best student deal',
      joined: 45,
      needed: 10,
      spotsTotal: 55,
      seriousCount: 16,
      readyCount: 8,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&q=80',
      bgColor: 'bg-indigo-500'
    },
    {
      id: 2,
      title: 'Gym Membership',
      subtitle: 'Affordable gyms in Indore',
      joined: 22,
      needed: 7,
      spotsTotal: 29,
      seriousCount: 8,
      readyCount: 4,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=120&q=80',
      bgColor: 'bg-orange-500'
    },
    {
      id: 3,
      title: 'Zomato Gold Group Buy',
      subtitle: "Let's get maximum discount!",
      joined: 112,
      needed: 20,
      spotsTotal: 132,
      seriousCount: 41,
      readyCount: 22,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=120&q=80',
      bgColor: 'bg-red-500'
    },
    {
      id: 4,
      title: 'Spotify Premium Family',
      subtitle: 'Need 3 more people',
      joined: 3,
      needed: 3,
      spotsTotal: 6,
      seriousCount: 2,
      readyCount: 1,
      image: 'https://images.unsplash.com/photo-1614680376593-902f74a9539d?auto=format&fit=crop&w=120&q=80',
      bgColor: 'bg-green-500'
    },
    {
      id: 5,
      title: 'Netflix 4K Plan',
      subtitle: 'Looking to share screen limit',
      joined: 2,
      needed: 2,
      spotsTotal: 4,
      seriousCount: 1,
      readyCount: 1,
      image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=120&q=80',
      bgColor: 'bg-black'
    },
    {
      id: 6,
      title: 'Sony PS5 Disk Edition',
      subtitle: 'Bulk buy for max discount',
      joined: 8,
      needed: 5,
      spotsTotal: 13,
      seriousCount: 3,
      readyCount: 2,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=120&q=80',
      bgColor: 'bg-blue-600'
    },
    {
      id: 7,
      title: 'Amazon Prime Yearly',
      subtitle: 'Join to share benefits',
      joined: 1,
      needed: 4,
      spotsTotal: 5,
      seriousCount: 0,
      readyCount: 0,
      image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=120&q=80',
      bgColor: 'bg-blue-400'
    },
    {
      id: 8,
      title: 'Myntra End of Reason Sale',
      subtitle: 'Buy 5 get 50% OFF',
      joined: 2,
      needed: 3,
      spotsTotal: 5,
      seriousCount: 1,
      readyCount: 0,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=120&q=80',
      bgColor: 'bg-pink-500'
    },
    {
      id: 9,
      title: 'Youtube Premium Family',
      subtitle: 'No more ads, need 4 users',
      joined: 2,
      needed: 4,
      spotsTotal: 6,
      seriousCount: 1,
      readyCount: 1,
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=120&q=80',
      bgColor: 'bg-red-600'
    }
  ];

  const visibleGroups = groups;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[15.5px] font-extrabold tracking-tight text-ink">Active Groups You Might Like</h3>
        <button 
          onClick={() => navigate('/groups')}
          className="text-xs font-extrabold text-primary flex items-center gap-0.5 active:scale-95 transition-all"
        >
          See All
          <svg className="w-3 h-3 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {visibleGroups.map((group) => {
          const progressPercent = Math.min((group.joined / group.spotsTotal) * 100, 100);
          return (
            <div 
              key={group.id} 
              onClick={() => navigate(`/groups/${group.id}/chat`, { state: { group, isJoined: false } })}
              className="flex items-center p-3 gap-3 bg-surface border border-line rounded-2xl shadow-sm cursor-pointer active:scale-[0.98] transition-all hover:border-primary/30"
            >
              {/* Logo/Image */}
              <div className={`w-[50px] h-[50px] rounded-full flex-shrink-0 overflow-hidden ${group.bgColor}`}>
                <img src={group.image} alt={group.title} className="w-full h-full object-cover opacity-90" />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center overflow-hidden min-w-0">
                <h3 className="text-xs font-bold text-ink truncate">{group.title}</h3>
                <p className="text-[9.5px] text-faint truncate mt-0.5">{group.subtitle}</p>
                
                {/* Progress bar */}
                <div className="mt-1.5 flex flex-col gap-0.5">
                  <div className="w-full h-[3px] bg-surface-deep rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-bold text-muted leading-none">
                      <span className="text-ink font-semibold">{group.joined}</span>/{group.spotsTotal} members
                    </span>
                    <span className="text-[8px] font-bold text-muted leading-none">{group.needed} more needed</span>
                  </div>
                </div>

                {/* Serious & Ready stats */}
                <div className="flex items-center gap-3 mt-1.5 pt-1 border-t border-line/40">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-[8.5px] font-black text-ink leading-none">{group.seriousCount}</span>
                    <span className="text-[7.5px] font-medium text-muted leading-none">serious</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-[8.5px] font-black text-ink leading-none">{group.readyCount}</span>
                    <span className="text-[7.5px] font-medium text-muted leading-none">ready to buy</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <WishlistButton
                  isWishlisted={wishlistItems.some(item => item.id === group.id)}
                  onClick={() => dispatch(toggleWishlist(group))}
                  className="scale-[1.05]"
                />
                <button 
                  onClick={() => navigate(`/groups/${group.id}/chat`, { state: { group, isJoined: false } })}
                  className="px-3.5 py-1.5 border border-primary text-primary text-[10px] font-bold rounded-lg active:scale-95 transition-all bg-surface hover:bg-primary/5 whitespace-nowrap"
                >
                  Join
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View More Redirect Button */}
      <button
        onClick={() => navigate('/groups')}
        className="w-full py-2.5 bg-surface border border-slate-200/80 hover:bg-surface-alt hover:border-slate-300 text-primary text-[11px] font-extrabold rounded-xl flex items-center justify-center gap-1 active:scale-[0.98] transition-all shadow-sm mt-1"
      >
        <span>View More</span>
        <svg 
          className="w-3.5 h-3.5 stroke-[2.5]" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default ActiveGroupsList;

