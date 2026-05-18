import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../../components';

/**
 * Single Group Details page for userMain module.
 * Incorporates participant grids, real-time status checkouts, and custom sharing CTA triggers.
 */
const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  // Mock group detailed info
  const group = {
    id: groupId || 'g-101',
    title: 'Premium Organic Avocados (Pack of 6)',
    vendor: 'Fresh Farms Ltd.',
    isVerified: true,
    rating: 4.8,
    originalPrice: 499,
    groupPrice: 299,
    spotsTotal: 10,
    spotsJoined: 7,
    joinedUsers: [
      { name: 'Hritik (Host)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80', isHost: true },
      { name: 'Ankit', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80', isHost: false },
      { name: 'Sneha', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', isHost: false },
      { name: 'Vikram', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', isHost: false }
    ],
    timeRemaining: '1h 32m remaining',
    rules: [
      'Joined users must pay their share when the pool completes.',
      'Deal validates immediately after 10 slots fill up.',
      'Direct farm delivery provided by vendor within 24 hours.'
    ]
  };

  const spotsRemaining = group.spotsTotal - group.spotsJoined;

  return (
    <div className="flex flex-col gap-6 select-none animate-fadeIn">
      {/* Product Image Placeholder with Tinted Shadow */}
      <div className="w-full h-48 bg-white border border-line/50 rounded-[28px] overflow-hidden flex items-center justify-center relative shadow-card">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        <div className="text-primary font-black text-xl">🥑 Product Image</div>
      </div>

      {/* Main Info */}
      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">✓ Verified Vendor</Badge>
          <Badge variant="primary" size="sm">★ {group.rating}</Badge>
        </div>
        <h2 className="text-xl font-black text-ink leading-tight mt-1">{group.title}</h2>
        <span className="text-xs font-semibold text-muted">Offered by {group.vendor}</span>
      </div>

      {/* Pricing card */}
      <Card className="flex items-center justify-between bg-primary-soft/30 border-primary/10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-primary uppercase tracking-wide">Group Price Locked</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-black text-primary">₹{group.groupPrice}</span>
            <span className="text-sm font-bold text-muted line-through">₹{group.originalPrice}</span>
          </div>
        </div>
        <Badge variant="danger" size="md" className="animate-pulse">
          Save ₹{group.originalPrice - group.groupPrice}
        </Badge>
      </Card>

      {/* Participants Feed */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-black text-ink">Joined Members ({group.spotsJoined}/{group.spotsTotal})</h3>
          <span className="text-xs font-bold text-danger">{spotsRemaining} spots left!</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {group.joinedUsers.map((user, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                {user.isHost && (
                  <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">
                    Host
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-ink truncate max-w-full">{user.name.split(' ')[0]}</span>
            </div>
          ))}
          
          {/* Missing slots indicators */}
          {[...Array(Math.min(4, spotsRemaining))].map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-1.5 opacity-60">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted/50 flex items-center justify-center text-muted font-bold text-lg bg-surface">
                ?
              </div>
              <span className="text-[10px] font-bold text-muted">Join</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rules list */}
      <Card padding="p-4" className="bg-surface">
        <h4 className="text-xs font-black text-ink uppercase tracking-wide mb-2">Deal Conditions</h4>
        <ul className="flex flex-col gap-1.5">
          {group.rules.map((rule, idx) => (
            <li key={idx} className="text-xs font-medium text-muted flex gap-2">
              <span className="text-primary">•</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Bottom Sticky Action Buttons */}
      <div className="flex flex-col gap-2 mt-4">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => navigate(`/groups/${group.id}/chat`)}
        >
          Join Group Chat & Pool
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
        >
          Share Invite Link
        </Button>
      </div>
    </div>
  );
};

export default GroupDetails;
