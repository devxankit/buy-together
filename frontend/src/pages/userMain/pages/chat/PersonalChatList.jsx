import React from 'react';
import { useNavigate } from 'react-router-dom';

const PersonalChatList = () => {
  const navigate = useNavigate();

  const chats = [
    {
      id: 1,
      name: 'Rohan Sharma',
      lastMessage: 'Hey, are you still interested in the iPhone deal?',
      time: '10:30 AM',
      unread: 2,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: 2,
      name: 'Neha Singh',
      lastMessage: 'I found a better vendor for the laptops.',
      time: 'Yesterday',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: 3,
      name: 'Amit Verma',
      lastMessage: 'Ok, let me know when you are ready.',
      time: 'Monday',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80'
    }
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F6F6F8] font-sans pb-24">
      {/* HEADER */}
      <div className="bg-surface px-4 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-surface-alt rounded-xl active:scale-95 transition-all text-ink">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-black text-ink">Messages</h1>
      </div>

      {/* CHAT LIST */}
      <div className="flex flex-col px-2 py-3 gap-2.5 w-full">
        {chats.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => navigate(`/messages/${chat.id}`)}
            className={`bg-surface rounded-[20px] p-4 flex gap-3.5 shadow-sm border ${chat.unread > 0 ? 'border-primary/20' : 'border-transparent'} active:scale-[0.98] transition-transform cursor-pointer w-full`}
          >
            <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover bg-surface-alt flex-shrink-0" />
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-[14px] font-black ${chat.unread > 0 ? 'text-ink' : 'text-ink'} truncate pr-2`}>
                  {chat.name}
                </h4>
                <span className={`text-[10px] font-bold ${chat.unread > 0 ? 'text-primary' : 'text-muted'} whitespace-nowrap`}>{chat.time}</span>
              </div>
              <p className={`text-[12px] truncate ${chat.unread > 0 ? 'font-bold text-ink' : 'font-medium text-faint'}`}>
                {chat.lastMessage}
              </p>
            </div>
            {chat.unread > 0 && (
              <div className="min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center self-center px-1">
                {chat.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalChatList;
