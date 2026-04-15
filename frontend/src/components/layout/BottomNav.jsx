import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Plus, Tag, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Groups', icon: Users, path: '/groups' },
    { name: 'Create', icon: Plus, path: '/groups/create', isAction: true },
    { name: 'Deals', icon: Tag, path: '/deals' },
    { name: 'Profile', icon: UserCircle, path: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-2 pb-6 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] backdrop-blur-lg lg:bg-white/90">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = path === tab.path;
          
          return (
            <Link 
              key={tab.name}
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                isActive ? 'text-primary scale-105' : 'text-gray-400'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-all ${
                tab.isAction ? 'bg-secondary/5 text-secondary' : ''
              } ${isActive && !tab.isAction ? 'bg-primary/5' : ''}`}>
                <tab.icon 
                  size={tab.isAction ? 24 : 22} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-transform duration-300"
                />
              </div>
              <span className={`text-[10px] font-bold tracking-tight ${
                isActive ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
