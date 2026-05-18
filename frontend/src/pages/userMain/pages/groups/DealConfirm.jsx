import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DealConfirm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 bg-[#0D9488]/10 text-[#0D9488] rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-[#111112] mb-1">Deal Confirmation</h2>
      <p className="text-sm text-[#6B6B72] mb-4">The confirmation screen for Group #{groupId} will be rebuilt soon.</p>
      <button 
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-[#0D9488] text-white text-sm font-medium rounded-xl shadow-md hover:bg-[#0B7A70] transition-all"
      >
        Go to Home
      </button>
    </div>
  );
};

export default DealConfirm;
