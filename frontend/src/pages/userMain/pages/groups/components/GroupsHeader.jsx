import React from 'react';
import { useNavigate } from 'react-router-dom';

const GroupsHeader = ({ selectedLocation, onLocationClick }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-2 mt-2 select-none">
      <div className="flex flex-col">
        <h1 className="text-[26px] font-extrabold tracking-tight text-ink leading-none">
          Groups
        </h1>
        <button
          onClick={onLocationClick}
          className="flex items-center gap-0.5 text-[10.5px] font-extrabold text-primary active:scale-95 transition-all w-fit mt-1.5 hover:opacity-90"
        >
          <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate max-w-[120px]">{selectedLocation ? selectedLocation.split(',')[0] : 'Mumbai'}</span>
          <svg className="w-2.5 h-2.5 text-primary stroke-[3.5] ml-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
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
