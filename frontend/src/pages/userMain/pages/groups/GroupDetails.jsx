import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 bg-[#0D9488]/10 text-[#0D9488] rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-[#111112] mb-1">Group Details</h2>
      <p className="text-sm text-[#6B6B72] mb-4">Group #{groupId} details will be rebuilt soon.</p>
      <button 
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-[#0D9488] text-white text-sm font-medium rounded-xl shadow-md hover:bg-[#0B7A70] transition-all"
      >
        Go to Home
      </button>
    </div>
  );
};

export default GroupDetails;
