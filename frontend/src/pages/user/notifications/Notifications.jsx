import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, CheckCircle2, Megaphone, Zap, MessageSquare, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NOTIFICATIONS_DATA = [
  {
    id: '1',
    type: 'update',
    title: 'App Update',
    message: 'New update out now! Discover improved productivity tools and more.',
    time: '2 days ago',
    icon: CheckCircle2,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-50'
  },
  {
    id: '2',
    type: 'offer',
    title: 'Upgrade Offer',
    message: 'Get Lumina Premium now at 40% off for advanced productivity features!',
    time: '2 days ago',
    icon: Megaphone,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50'
  },
  {
    id: '3',
    type: 'group',
    title: 'New Group Joined',
    message: '5 people just joined the iPhone 16 Pro group near you.',
    time: '3 days ago',
    icon: Zap,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50'
  },
  {
    id: '4',
    type: 'chat',
    title: 'Message Received',
    message: 'You have a new message from the Maruti Baleno group admin.',
    time: '4 days ago',
    icon: MessageSquare,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50'
  }
];

const Notifications = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-6 border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="flex-1 text-center text-lg font-black tracking-tight text-gray-900 pr-8">
          NOTIFICATIONS
        </h1>
      </div>

      {/* List */}
      <div className="flex-1 px-5 pt-4">
        <div className="space-y-10">
          {NOTIFICATIONS_DATA.map((item) => (
            <div key={item.id} className="relative flex items-start gap-5">
              {/* Left Icon */}
              <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${item.iconBg}`}>
                <item.icon size={24} className={item.iconColor} />
              </div>

              {/* Content */}
              <div className="flex-1 pt-0.5">
                <div className="flex items-start justify-between">
                  <h2 className="text-[16px] font-bold text-gray-900 mb-1">{item.title}</h2>
                  <button 
                    onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                    className="p-1 -mr-2 text-gray-400"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
                <p className="text-[14px] text-gray-400 leading-snug mb-2 pr-4">
                  {item.message}
                </p>
                <span className="text-[13px] text-gray-300 font-medium">
                  {item.time}
                </span>

                {/* Popover Menu (Simplified) */}
                {activeMenu === item.id && (
                  <div className="absolute right-0 top-8 z-50 bg-white border border-gray-100 rounded-xl shadow-2xl shadow-black/10 py-1 min-w-[140px] animate-in fade-in zoom-in duration-200">
                    <button className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 border-b border-gray-50">
                      Mark as read
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
