import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../../../../redux/slices/wishlistSlice';
import WishlistButton from '../../../../../components/ui/WishlistButton';

const ActiveGroupsList = ({ title = 'Active Groups You Might Like', groups = [], onViewAll }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleViewAll = onViewAll || (() => navigate('/groups'));
  const visibleGroups = groups;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[15.5px] font-extrabold tracking-tight text-ink">{title}</h3>
        <button
          onClick={handleViewAll}
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
        onClick={handleViewAll}
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

