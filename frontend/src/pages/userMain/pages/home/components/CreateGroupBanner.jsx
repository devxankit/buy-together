import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGroupBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gradient-to-r from-indigo-100 to-orange-50 rounded-2xl overflow-hidden relative shadow-sm mt-2 flex items-center p-4 min-h-[90px]">
      
      {/* Decorative characters on the left */}
      <div className="absolute left-0 bottom-0 w-[120px] h-full flex items-end justify-center">
        <img 
          src="https://img.freepik.com/free-vector/team-goals-concept-illustration_114360-5175.jpg?w=360" 
          alt="Team" 
          className="absolute -bottom-4 -left-4 w-[140px]  opacity-90"
        />
      </div>

      <div className="ml-[110px] flex-1 flex flex-col justify-center py-1">
        <h3 className="text-[11px] font-bold text-ink leading-tight mb-2">
          Deals are better<br />when we do it together! <span className="text-primary">💜</span>
        </h3>
        
        <button 
          onClick={() => navigate('/groups/create')}
          className="bg-primary text-white text-[10px] font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all shadow-md shadow-primary/20 max-w-fit"
        >
          Create Group
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CreateGroupBanner;
