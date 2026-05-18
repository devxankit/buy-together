import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 bg-[#0D9488]/10 text-[#0D9488] rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-[#111112] mb-1">Create Group</h2>
      <p className="text-sm text-[#6B6B72] mb-4">The group creation screen will be rebuilt soon.</p>
      <button 
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-[#0D9488] text-white text-sm font-medium rounded-xl shadow-md hover:bg-[#0B7A70] transition-all"
      >
        Go to Home
      </button>
    </div>
  );
};

export default CreateGroup;
