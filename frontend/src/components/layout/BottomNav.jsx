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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-2 pb-5 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] backdrop-blur-lg lg:bg-white/90">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = path === tab.path;
          const Icon = tab.icon;
          
          return (
            <Link 
              key={tab.name}
              to={tab.path}
              className="flex-1 relative flex flex-col items-center justify-center gap-0.5 group py-0.5"
            >
              {/* Active Background Indicator (Sliding) */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-2 inset-y-1 bg-[#ff7a00]/5 rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon Container */}
              <motion.div
                animate={{ 
                  scale: isActive ? 1.12 : 1,
                  y: isActive ? -1 : 0
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative p-1.5 rounded-xl transition-colors ${
                  isActive ? 'text-[#ff7a00]' : 'text-gray-400'
                }`}
              >
                <Icon 
                  size={isActive ? 24 : 22} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>

              <motion.span 
                animate={{ 
                  opacity: isActive ? 1 : 0.6,
                }}
                className={`text-[9px] font-black tracking-widest uppercase ${
                  isActive ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {tab.name}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
