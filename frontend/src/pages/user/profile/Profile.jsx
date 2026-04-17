import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Settings, Shield, Bell, LogOut, ChevronRight,
  Trophy, Star, Zap, Users, Tag, Activity,
  CheckCircle2, TrendingUp, MapPin, Award
} from 'lucide-react';
import { useSelector } from '../../../hooks/useSelector';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'groups', label: 'My Groups' },
  { id: 'activity', label: 'Activity' },
];

const BADGES = [
  { id: 1, icon: '🔥', label: 'Early Adopter', desc: 'Among first 1000 users', earned: true },
  { id: 2, icon: '⚡', label: 'Deal Hunter', desc: 'Joined 5+ deal groups', earned: true },
  { id: 3, icon: '🏆', label: 'Group Leader', desc: 'Created a successful group', earned: false },
  { id: 4, icon: '💎', label: 'Top Contributor', desc: 'Top 10 chat participation', earned: false },
];

const MY_GROUPS = [
  { id: '1', name: 'iPhone 16 Pro Max', category: 'Electronics', status: 'near_completion', joined: 18, total: 20 },
  { id: '2', name: 'Maruti Baleno Deal', category: 'Cars', status: 'active', joined: 7, total: 10 },
  { id: '4', name: 'MacBook Pro M3', category: 'Electronics', status: 'active', joined: 4, total: 15 },
];

const ACTIVITY = [
  { icon: Users, label: 'Joined iPhone 16 Pro Max group', time: 'Today, 10:22 AM', color: 'text-primary bg-orange-50' },
  { icon: Tag, label: 'Confirmed interest in Sony TV deal', time: 'Yesterday, 3:45 PM', color: 'text-green-600 bg-green-50' },
  { icon: CheckCircle2, label: 'Voted in MacBook group poll', time: 'Apr 15, 11:00 AM', color: 'text-secondary bg-blue-50' },
  { icon: TrendingUp, label: 'Created Baleno group', time: 'Apr 12, 9:30 AM', color: 'text-purple-600 bg-purple-50' },
];

const STATUS_COLORS = {
  active: 'text-green-600 bg-green-50',
  near_completion: 'text-primary bg-orange-50',
  locked: 'text-secondary bg-blue-50',
};
const STATUS_LABELS = {
  active: 'Active', near_completion: 'Almost Full', locked: 'Locked',
};

const MENU_ITEMS = [
  { icon: Settings, label: 'Account Settings', desc: 'Personal info, preferences' },
  { icon: Bell, label: 'Notifications', desc: 'Manage alerts & updates' },
  { icon: Shield, label: 'Security', desc: 'OTP, device sessions' },
  { icon: MapPin, label: 'Location', desc: 'Saved areas and radius' },
];

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Groups', value: '3', icon: Users, color: 'text-primary' },
    { label: 'Deals', value: '1', icon: Tag, color: 'text-green-600' },
    { label: 'Intent Score', value: '80', icon: Zap, color: 'text-secondary' },
  ];

  return (
    <div className="flex flex-col pb-28 bg-[#fafafa]">
      {/* Profile Hero */}
      <div className="bg-white px-5 pt-8 pb-5 border-b border-gray-50">
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/25 shrink-0"
          >
            <span className="text-3xl font-black text-white">
              {(user?.name || 'Ankit')[0]}
            </span>
          </motion.div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
              {user?.name || 'Ankit Ahirwar'}
            </h1>
            <p className="text-[12px] font-bold text-gray-400 mt-0.5">
              Member since April 2026
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-black text-secondary bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase">
                {user?.role || 'Buyer'}
              </span>
              <span className="text-[10px] font-black text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                ✓ Verified
              </span>
            </div>
          </div>
          <button className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
            <Settings size={17} className="text-gray-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100"
            >
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-[10px] font-bold text-gray-400 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4 pb-2 flex gap-2 bg-white border-b border-gray-50 sticky top-0 z-10">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-[11px] font-black transition-all ${
              activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Intent Score Card */}
            <div className="mx-5 mt-5">
              <div className="bg-gray-900 rounded-3xl p-5 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity size={14} className="text-primary" />
                    <span className="text-[11px] font-black text-white/50 uppercase tracking-wider">Intent Score</span>
                  </div>
                  <div className="text-5xl font-black text-white tracking-tight mb-1">80</div>
                  <div className="text-[12px] font-bold text-white/50">
                    +20 from polls · +20 from chats · +40 from confirmations
                  </div>
                  <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '80%' }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
                <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-primary/20 blur-[50px] rounded-full" />
              </div>
            </div>

            {/* Badges */}
            <div className="mx-5 mt-4">
              <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                <Award size={15} className="text-primary" />
                Badges
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {BADGES.map((badge, i) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className={`rounded-3xl p-4 border flex items-center gap-3 ${
                      badge.earned
                        ? 'bg-white border-gray-100 shadow-sm'
                        : 'bg-gray-50 border-dashed border-gray-200'
                    }`}
                  >
                    <div className={`text-2xl ${!badge.earned && 'grayscale opacity-40'}`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-black truncate ${badge.earned ? 'text-gray-900' : 'text-gray-400'}`}>
                        {badge.label}
                      </div>
                      <div className="text-[10px] font-medium text-gray-400 line-clamp-1">{badge.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Settings Menu */}
            <div className="mx-5 mt-5">
              <h3 className="text-sm font-black text-gray-900 mb-3">Settings</h3>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {MENU_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`flex items-center gap-4 p-4 cursor-pointer active:bg-gray-50 transition-colors ${
                      i < MENU_ITEMS.length - 1 ? 'border-b border-gray-50' : ''
                    }`}
                  >
                    <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                      <item.icon size={17} className="text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-black text-gray-900">{item.label}</div>
                      <div className="text-[11px] font-medium text-gray-400">{item.desc}</div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sign Out */}
            <div className="mx-5 mt-4">
              <button className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-sm border border-red-100 hover:bg-red-100 transition-colors active:scale-[0.98]">
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}

        {/* My Groups Tab */}
        {activeTab === 'groups' && (
          <motion.div key="groups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="px-5 mt-5 flex flex-col gap-3">
              {MY_GROUPS.map((group, i) => {
                const progress = (group.joined / group.total) * 100;
                const statusCls = STATUS_COLORS[group.status] || STATUS_COLORS.active;
                const statusLabel = STATUS_LABELS[group.status] || 'Active';
                return (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-black text-gray-900 text-sm leading-tight">{group.name}</h4>
                        <p className="text-[11px] font-bold text-gray-400 mt-0.5">{group.category}</p>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${statusCls}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-gray-400">{group.joined}/{group.total} joined</span>
                        <span className="text-[11px] font-black text-gray-500">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${progress >= 80 ? 'bg-primary' : 'bg-secondary'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="px-5 mt-5 flex flex-col gap-3">
              {ACTIVITY.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 leading-tight">{item.label}</div>
                    <div className="text-[11px] font-medium text-gray-400 mt-0.5">{item.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
