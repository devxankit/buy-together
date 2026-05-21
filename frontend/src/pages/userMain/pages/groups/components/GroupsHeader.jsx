import React from 'react';
import { useNavigate } from 'react-router-dom';

const GroupsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-2 mt-2 select-none">
      <h1 className="text-[26px] font-extrabold tracking-tight text-ink">
        Groups
      </h1>
      <button
        onClick={() => navigate('/groups/create')}
        className="flex items-center gap-1 bg-primary/10 hover:bg-primary/15 text-primary px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Create Group</span>
      </button>
    </div>
  );
};

export default GroupsHeader;
