import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../../../../redux/slices/wishlistSlice';
import WishlistButton from '../../../../../components/ui/WishlistButton';
import { cldImg } from '../../../../../utils/imageUrl';

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

      <div className="flex flex-col gap-3">
        {visibleGroups.map((group) => {
          const progressPercent = Math.min((group.joined / group.spotsTotal) * 100, 100);
          return (
            <div 
              key={group.id} 
              onClick={() => navigate(`/groups/${group.id}/chat`, { state: { group, isJoined: false } })}
              className="relative flex p-3.5 gap-3.5 bg-surface border border-line rounded-[20px] shadow-sm hover:shadow-md cursor-pointer active:scale-[0.985] transition-all hover:border-primary/30 min-h-[110px]"
            >
              {/* Product Image on the left (Rounded rectangle) */}
              <div className="w-[75px] h-[75px] rounded-xl overflow-hidden flex-shrink-0 bg-[#F6F6F8] border border-line/40">
                <img src={cldImg(group.image, { w: 160, h: 160 })} alt={group.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>

              {/* Content Column */}
              <div className="flex-1 flex flex-col justify-between min-w-0 pr-14">
                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-[13.5px] font-black text-ink truncate leading-tight tracking-tight">{group.title}</h3>
                  <p className="text-[10px] text-faint truncate mt-0.5 font-medium">{group.subtitle}</p>
                </div>
                
                {/* Progress bar */}
                <div className="mt-1.5 flex flex-col gap-0.5">
                  <div className="w-full h-[3.5px] bg-surface-deep rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-[9px] font-bold text-muted leading-none">
                      <span className="text-ink font-semibold">{group.joined}</span>/{group.spotsTotal} members
                    </span>
                    <span className="text-[9px] font-bold text-muted leading-none">{group.needed} needed</span>
                  </div>
                </div>

                {/* Serious & Ready stats */}
                <div className="flex items-center gap-3 mt-1.5 pt-1 border-t border-line/40">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-[9.5px] font-black text-ink leading-none">{group.seriousCount}</span>
                    <span className="text-[8px] font-bold text-muted leading-none">serious</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-[9.5px] font-black text-ink leading-none">{group.readyCount}</span>
                    <span className="text-[8px] font-bold text-muted leading-none">ready</span>
                  </div>
                </div>
              </div>

              {/* Action Column on the Right (Absolute positioned) */}
              <div className="absolute right-3.5 top-3.5 bottom-3.5 flex flex-col justify-between items-end pointer-events-auto">
                <WishlistButton
                  isWishlisted={wishlistItems.some(item => String(item.id || item._id) === String(group.id || group._id))}
                  onClick={() => dispatch(toggleWishlist(group))}
                  className="scale-[0.95]"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/groups/${group.id}/chat`, { state: { group, isJoined: false } });
                  }}
                  className="px-3.5 py-1.5 border border-primary text-primary text-[10px] font-black rounded-lg active:scale-95 transition-all bg-surface hover:bg-primary/5 whitespace-nowrap"
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

