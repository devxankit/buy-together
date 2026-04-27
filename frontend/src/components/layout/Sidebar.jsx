import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Bell, Search, MessageCircle, LogOut, Heart, Settings, ShoppingBag, Users, Tag, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, user, isAuthenticated }) => {
  const sidebarVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 left-0 bottom-0 w-[280px] md:w-[350px] bg-white z-[70] shadow-2xl overflow-y-auto"
          >
            {/* Header / Profile Section */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-primary/20">
                     {user?.name?.[0] || 'A'}
                   </div>
                   <div>
                     <h3 className="font-black text-gray-900 leading-tight">
                       {isAuthenticated ? user?.name : 'Guest User'}
                     </h3>
                     <p className="text-xs font-bold text-gray-400">
                       {isAuthenticated ? user?.email : 'Login to join groups'}
                     </p>
                   </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {isAuthenticated ? (
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <span className="text-xs font-black text-primary">12</span>
                    <span className="text-[8px] font-black uppercase text-gray-400">Groups</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <span className="text-xs font-black text-secondary">₹2k</span>
                    <span className="text-[8px] font-black uppercase text-gray-400">Saved</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <span className="text-xs font-black text-orange-500">4.9</span>
                    <span className="text-[8px] font-black uppercase text-gray-400">Rating</span>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  onClick={onClose}
                  className="w-full py-3 bg-primary text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Login / Register
                </Link>
              )}
            </div>

            {/* Navigation Links */}
            <div className="p-6 flex flex-col gap-1">
              <SidebarLink icon={Home} label="Home" to="/" onClick={onClose} active />
              <SidebarLink icon={Users} label="My Groups" to="/my-groups" onClick={onClose} />
              <SidebarLink icon={ShoppingBag} label="Deals" to="/deals" onClick={onClose} />
              <SidebarLink icon={Tag} label="Vendors" to="/vendors" onClick={onClose} />
              
              <div className="h-px bg-gray-100 my-4" />
              
              <SidebarLink icon={Bell} label="Notifications" to="/notifications" onClick={onClose} />
              <SidebarLink icon={Heart} label="Wishlist" to="/wishlist" onClick={onClose} />
              <SidebarLink icon={Settings} label="Settings" to="/settings" onClick={onClose} />
            </div>

            {/* Footer */}
            {isAuthenticated && (
              <div className="p-6 mt-auto">
                <button className="w-full p-4 flex items-center gap-3 text-red-500 font-bold bg-red-50 rounded-2xl hover:bg-red-100 transition-colors">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SidebarLink = ({ icon: Icon, label, to, onClick, active }) => (
  <Link 
    to={to}
    onClick={onClick}
    className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all ${
      active ? 'bg-primary/5 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon size={20} weight={active ? 'bold' : 'regular'} />
    <span className="text-sm font-bold">{label}</span>
  </Link>
);

export default Sidebar;
