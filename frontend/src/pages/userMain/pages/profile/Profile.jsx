import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../../../hooks/useDispatch';
import { logout } from '../../../../redux/slices/authSlice';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 bg-[#0D9488]/10 text-[#0D9488] rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-[#111112] mb-1">My Profile</h2>
      <p className="text-sm text-[#6B6B72] mb-6">This screen will be rebuilt soon.</p>
      <button 
        onClick={handleLogout}
        className="px-4 py-2 border border-red-500 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition-all"
      >
        Log out
      </button>
    </div>
  );
};

export default Profile;
