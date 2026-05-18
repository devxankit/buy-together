import React from 'react';
import { Card, Button, Badge } from '../../components';

/**
 * Live Active Group Listing page for userMain module.
 * Directs users toward completing nearby community rooms.
 */
const GroupsList = () => {
  const activeGroups = [
    {
      id: 'g-a1',
      title: 'Premium Mangoes Box Buy',
      creator: 'Hritik (You)',
      joinedCount: 5,
      totalSpots: 8,
      status: 'Active',
      timeRemaining: '45 mins left'
    },
    {
      id: 'g-a2',
      title: 'Organic Apple Bulk Deal',
      creator: 'Ankit Sharma',
      joinedCount: 3,
      totalSpots: 5,
      status: 'Fast Filling',
      timeRemaining: '1 hr left'
    }
  ];

  return (
    <div className="flex flex-col gap-5 select-none animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-base font-black text-ink">My Active Rooms</h3>
        <p className="text-xs text-muted font-medium">Join and invite friends to lock down discounts before the time expires.</p>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {activeGroups.map((group) => {
          const progressPercent = (group.joinedCount / group.totalSpots) * 100;
          return (
            <Card key={group.id} hoverEffect className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-[15px] font-black text-ink leading-tight">
                    {group.title}
                  </h4>
                  <span className="text-xs text-muted font-semibold">
                    Started by {group.creator}
                  </span>
                </div>
                
                <Badge variant={group.status === 'Fast Filling' ? 'danger' : 'primary'} size="sm">
                  {group.status}
                </Badge>
              </div>

              {/* Progress */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold text-ink/80">
                  <span>Progress</span>
                  <span>{group.joinedCount}/{group.totalSpots} joined</span>
                </div>
                <div className="w-full h-2 bg-surface-deep rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action and Countdown */}
              <div className="flex items-center justify-between border-t border-line-soft pt-3 mt-1">
                <span className="text-xs font-bold text-danger animate-pulse">
                  ⏱ {group.timeRemaining}
                </span>
                
                <Button variant="primary" size="sm" className="h-9 px-4 rounded-xl">
                  Open Chat Room
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GroupsList;
