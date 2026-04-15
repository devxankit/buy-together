import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image, MoreVertical, Search, MessageSquareCode } from 'lucide-react';
import { useDispatch } from '../../../hooks/useDispatch';
import { useSelector } from '../../../hooks/useSelector';

const GroupChat = () => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setInput('');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Search Sidebar - Mobile Hidden */}
      <div className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-100 p-6 gap-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquareCode className="text-secondary w-7 h-7" />
          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            <span className="text-secondary">BUY</span> <span className="text-primary">TOGETHER</span>
          </h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search group members..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black transition-all outline-none"
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/10">E</div>
            <div>
              <h2 className="font-bold text-gray-900 tracking-tight">Electronics Deal Group</h2>
              <span className="text-xs text-green-500 font-medium">12 active participants</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-secondary transition-colors rounded-full p-2 hover:bg-blue-50">
            <MoreVertical size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth bg-white space-y-6">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                initial={{ opacity: 0, x: msg.senderId === user?.id ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={index}
                className={`flex flex-col max-w-[80%] md:max-w-[70%] ${msg.senderId === user?.id ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <span className="text-xs text-gray-500 mb-1 ml-1 px-1">{msg.senderName}</span>
                <div 
                  className={`px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                    msg.senderId === user?.id ? 'bg-secondary text-white rounded-tr-none' : 'bg-gray-100 text-gray-900 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        <footer className="h-24 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 md:p-6 flex items-center gap-4 z-10 sticky bottom-0">
          <button className="text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-50">
            <Image size={24} />
          </button>
          <form className="flex-1 relative flex items-center" onSubmit={handleSend}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-gray-50 px-6 py-4 rounded-full border-none focus:ring-2 focus:ring-black outline-none transition-all pr-16 font-medium text-gray-900"
              placeholder="Send a message to the group..."
            />
            <button 
              className={`absolute right-2 p-3 rounded-full transition-all ${input.trim() ? 'bg-secondary text-white' : 'text-gray-400'}`}
              type="submit"
              disabled={!input.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default GroupChat;
