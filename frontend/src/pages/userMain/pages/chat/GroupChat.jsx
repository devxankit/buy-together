import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const GroupChat = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 bg-[#0D9488]/10 text-[#0D9488] rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-[#111112] mb-1">Group Chat</h2>
      <p className="text-sm text-[#6B6B72] mb-4">The chat screen for Group #{groupId} will be rebuilt soon.</p>
      <button 
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-[#0D9488] text-white text-sm font-medium rounded-xl shadow-md hover:bg-[#0B7A70] transition-all"
      >
        Go to Home
      </button>
    </div>
  );
};

export default GroupChat;
