import React from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: 'Group goal reached!',
      message: 'Your iPhone 15 Pro group has reached its target. Payment link sent.',
      time: '10m ago',
      read: false,
      icon: (
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'New Member Joined',
      message: 'Alex joined your MacBook Air M3 group.',
      time: '2h ago',
      read: false,
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Flash Deal Closing Soon',
      message: 'Only 2 spots left in Zomato Gold Group Buy!',
      time: '5h ago',
      read: true,
      icon: (
        <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F6F6F8] font-sans pb-24">


      {/* NOTIFICATIONS LIST */}
      <div className="flex flex-col px-2 py-3 gap-2.5 w-full">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`bg-white rounded-[20px] p-4 flex gap-3.5 shadow-sm border ${notification.read ? 'border-transparent' : 'border-primary/20'} active:scale-[0.98] transition-transform cursor-pointer w-full`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
              {notification.icon}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className={`text-[13px] font-black ${notification.read ? 'text-slate-700' : 'text-ink'}`}>
                  {notification.title}
                </h4>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5">{notification.time}</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-snug pr-2">
                {notification.message}
              </p>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-danger flex-shrink-0 self-center" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
