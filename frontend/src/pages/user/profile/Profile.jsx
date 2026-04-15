import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Settings, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useSelector } from '../../../hooks/useSelector';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { label: 'Account Settings', icon: Settings, desc: 'Manage your personal info' },
    { label: 'Security', icon: Shield, desc: 'Passwords and 2FA' },
    { label: 'Notifications', icon: Mail, desc: 'Email and push preferences' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-10 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-orange-500/20"
        >
          <User size={48} className="text-white" />
        </motion.div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user?.name || 'Ankit Ahirwar'}</h1>
        <p className="text-gray-500 font-medium">Joined April 2026 · {user?.role || 'User'}</p>
      </div>

      <div className="space-y-4">
        {menuItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer group hover:bg-gray-50 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                <item.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{item.label}</h4>
                <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
          </motion.div>
        ))}

        <div className="mt-8 border-t border-gray-100 pt-8">
          <button className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
