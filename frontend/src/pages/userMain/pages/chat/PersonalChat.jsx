import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const initialMessages = [
  {
    id: 1,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80",
    name: "Rohan Sharma",
    time: "10:30 AM",
    content: "Hey, are you still interested in the iPhone deal?",
    isMe: false
  },
  {
    id: 2,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
    name: "You",
    time: "10:32 AM",
    content: "Yes, I am! Just waiting for more people to join to get the maximum discount.",
    isMe: true
  },
  {
    id: 3,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80",
    name: "Rohan Sharma",
    time: "10:35 AM",
    content: "Great, I will share the link with a few more groups.",
    isMe: false
  }
];

const TopBar = ({ navigate, user }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-line sticky top-0 z-30 w-full gap-2">
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <button onClick={() => navigate(-1)} className="p-1 active:scale-95 transition-all flex-shrink-0 text-ink hover:bg-surface-alt rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover bg-surface-alt flex-shrink-0" />

      <div className="flex flex-col min-w-0 flex-1">
        <h1 className="text-[14px] font-black text-ink truncate leading-tight">
          {user.name}
        </h1>
        <p className="text-[11px] font-bold text-green-600 mt-0.5 truncate leading-none">
          Online
        </p>
      </div>
    </div>

    <div className="flex items-center gap-1 flex-shrink-0">
      <button className="p-2 active:scale-95 transition-all text-faint hover:bg-surface-alt rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </button>
      <button className="p-2 active:scale-95 transition-all text-faint hover:bg-surface-alt rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  </div>
);

const ChatMessage = ({ avatar, name, time, content, isMe }) => {
  return (
    <div className={`flex gap-2.5 mb-5 px-4 w-full ${isMe ? 'flex-row-reverse' : ''}`}>
      {!isMe && <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-slate-200 mt-1" />}
      <div className={`flex flex-col min-w-0 max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
        <div className="bg-surface rounded-[16px] p-3 shadow-sm border border-line relative" style={isMe ? { borderBottomRightRadius: '4px', backgroundColor: '#e6f7f6', borderColor: 'transparent' } : { borderTopLeftRadius: '4px' }}>
          <p className="text-[13px] text-ink leading-relaxed break-words whitespace-pre-wrap">{content}</p>
          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[9px] font-bold text-faint">{time}</span>
            {isMe && (
              <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BottomInputArea = ({ newMessage, setNewMessage, handleSendMessage }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-line px-4 py-3 pb-8 md:pb-4 z-40 max-w-[430px] mx-auto shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
    <div className="flex items-center gap-2.5 bg-[#F6F6F8] rounded-2xl p-1.5 pl-4 border border-line-soft">
      <input 
        type="text" 
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Type a message..." 
        className="flex-1 bg-transparent text-[13px] font-medium text-ink placeholder:text-muted outline-none w-full min-w-0"
      />
      <div className="flex items-center gap-1">
        <button className="p-2 text-muted hover:text-primary transition-colors active:scale-95 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${newMessage.trim() ? 'bg-primary text-white shadow-sm' : 'bg-surface-alt text-faint'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

const PersonalChat = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const endRef = useRef(null);

  const user = {
    name: chatId === '1' ? 'Rohan Sharma' : chatId === '2' ? 'Neha Singh' : 'Amit Verma',
    avatar: chatId === '1' ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80' : 
            chatId === '2' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' : 
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80'
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      name: "You",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      content: newMessage,
      isMe: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F6F6F8] font-sans pb-[76px]">
      <TopBar navigate={navigate} user={user} />
      
      <div className="flex-1 overflow-y-auto pt-5 pb-4 w-full max-w-[430px] mx-auto no-scrollbar">
        {messages.map(msg => (
          <ChatMessage key={msg.id} {...msg} />
        ))}
        <div ref={endRef} />
      </div>

      <BottomInputArea 
        newMessage={newMessage} 
        setNewMessage={setNewMessage} 
        handleSendMessage={handleSendMessage} 
      />
    </div>
  );
};

export default PersonalChat;
