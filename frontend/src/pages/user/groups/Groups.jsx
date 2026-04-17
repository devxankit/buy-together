import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, Plus, MapPin, Users,
  Zap, ShieldCheck, ChevronRight, TrendingUp, Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Mock Data ──────────────────────────────────────────────────── */
const GROUPS = [
  {
    id: '1',
    name: 'iPhone 16 Pro Max — Bulk Buy',
    category: 'Electronics',
    location: 'Delhi NCR',
    joined: 18, total: 20,
    status: 'near_completion',
    isVendor: true,
    price: '₹99,000',
    originalPrice: '₹1,19,990',
    lastActivity: '2m ago',
    unread: 3,
    avatarColor: 'bg-orange-500',
  },
  {
    id: '2',
    name: 'Maruti Baleno — Group Deal',
    category: 'Cars',
    location: 'Mumbai',
    joined: 7, total: 10,
    status: 'active',
    isVendor: false,
    price: null,
    lastActivity: '15m ago',
    unread: 0,
    avatarColor: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'Sony OLED 55" 4K TV',
    category: 'Appliances',
    location: 'Bangalore',
    joined: 10, total: 10,
    status: 'locked',
    isVendor: true,
    price: '₹89,999',
    originalPrice: '₹1,19,999',
    lastActivity: '1h ago',
    unread: 1,
    avatarColor: 'bg-purple-500',
  },
  {
    id: '4',
    name: 'MacBook Pro M3 — 14 Inch',
    category: 'Electronics',
    location: 'Pune',
    joined: 4, total: 15,
    status: 'active',
    isVendor: false,
    price: null,
    lastActivity: '3h ago',
    unread: 0,
    avatarColor: 'bg-green-500',
  },
  {
    id: '5',
    name: 'Royal Enfield Bullet 350',
    category: 'Bikes',
    location: 'Hyderabad',
    joined: 6, total: 8,
    status: 'active',
    isVendor: true,
    price: '₹1,82,000',
    originalPrice: '₹1,95,000',
    lastActivity: '5h ago',
    unread: 0,
    avatarColor: 'bg-red-500',
  },
  {
    id: '6',
    name: 'Dyson V15 Detect Vacuum',
    category: 'Appliances',
    location: 'Chennai',
    joined: 3, total: 6,
    status: 'active',
    isVendor: false,
    price: null,
    lastActivity: '1d ago',
    unread: 0,
    avatarColor: 'bg-yellow-500',
  },
];

const TABS = ['All', 'Active', 'Near Full', 'My Groups'];

const STATUS_META = {
  active:          { dot: 'bg-green-400',  label: 'Active' },
  near_completion: { dot: 'bg-primary',    label: 'Almost Full' },
  locked:          { dot: 'bg-secondary',  label: 'Deal Stage' },
  completed:       { dot: 'bg-gray-300',   label: 'Done' },
};

/* ─── Group Row ──────────────────────────────────────────────────── */
const GroupRow = ({ group, index }) => {
  const pct = Math.round((group.joined / group.total) * 100);
  const spotsLeft = group.total - group.joined;
  const meta = STATUS_META[group.status] || STATUS_META.active;
  const initials = group.name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
    >
      <Link to={`/groups/${group.id}`}>
        <div className="flex items-center gap-3.5 px-5 py-3.5 active:bg-gray-50 transition-colors cursor-pointer">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className={`w-14 h-14 rounded-full ${group.avatarColor} flex items-center justify-center shadow-sm`}>
              <span className="text-white font-black text-base tracking-tight">{initials}</span>
            </div>
            {/* Status dot */}
            <div className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white ${meta.dot}`} />
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0">
            {/* Row 1 */}
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-[15px] text-gray-900 leading-snug truncate">
                  {group.name}
                </span>
                {group.isVendor && (
                  <ShieldCheck size={13} className="text-secondary shrink-0" />
                )}
              </div>
              <span className="text-[11px] font-medium text-gray-400 shrink-0 mt-0.5">
                {group.lastActivity}
              </span>
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin size={11} className="text-gray-300 shrink-0" />
                <span className="text-[12px] text-gray-400 truncate">
                  {group.location} · {group.category}
                </span>
              </div>
              {group.unread > 0 ? (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-white">{group.unread}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 shrink-0">
                  <Users size={11} className="text-gray-300" />
                  <span className="text-[11px] font-bold text-gray-400">
                    {group.joined}/{group.total}
                  </span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: index * 0.05 }}
                  className={`h-full rounded-full ${
                    pct >= 90 ? 'bg-primary' : pct >= 60 ? 'bg-secondary' : 'bg-gray-300'
                  }`}
                />
              </div>
              {spotsLeft > 0 && spotsLeft <= 3 ? (
                <span className="text-[10px] font-black text-primary whitespace-nowrap flex items-center gap-0.5">
                  <Zap size={9} className="fill-primary" />
                  {spotsLeft} left
                </span>
              ) : (
                <span className="text-[10px] font-medium text-gray-300 whitespace-nowrap">
                  {pct}%
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Divider — indented like WhatsApp */}
        <div className="ml-[82px] h-px bg-gray-100" />
      </Link>
    </motion.div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const Groups = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [searchOpen, setSearchOpen] = useState(false);

  const filtered = GROUPS.filter(g => {
    const q = search.toLowerCase();
    const matchesSearch = !q || g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q) || g.location.toLowerCase().includes(q);
    const matchesTab =
      activeTab === 'All' ? true :
      activeTab === 'Active' ? g.status === 'active' :
      activeTab === 'Near Full' ? g.status === 'near_completion' :
      activeTab === 'My Groups' ? [1, 2, 4].includes(Number(g.id)) :
      true;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col pb-24 min-h-screen bg-white">

      {/* ── Header ── */}
      <div className="sticky top-0 z-20 bg-white">
        {/* Title row */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h1 className="text-[22px] font-black text-gray-900 tracking-tight leading-tight">Groups</h1>
            <p className="text-[12px] text-gray-400 font-medium mt-0.5">{filtered.length} groups available</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(v => !v)}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <Search size={17} className="text-gray-500" />
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <SlidersHorizontal size={17} className="text-gray-500" />
            </button>
            <Link
              to="/groups/create"
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-orange-500/30"
            >
              <Plus size={18} className="text-white" />
            </Link>
          </div>
        </div>

        {/* Search bar — slides in */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-5 pb-3"
            >
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search groups, products..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl text-[14px] font-medium text-gray-800 outline-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab pills */}
        <div className="flex gap-2 px-5 pb-3 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Live ticker */}
        <div className="mx-5 mb-3 flex items-center gap-2 bg-secondary/5 border border-secondary/10 rounded-xl px-3.5 py-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <TrendingUp size={13} className="text-secondary" />
          <span className="text-[12px] font-bold text-secondary flex-1 truncate">
            42 people joined groups in the last hour
          </span>
          <span className="text-[10px] font-black text-secondary/40 uppercase tracking-wider">Live</span>
        </div>

        <div className="h-px bg-gray-100 mx-0" />
      </div>

      {/* ── Group List ── */}
      <div className="flex-1">
        <AnimatePresence>
          {filtered.length > 0 ? (
            filtered.map((group, i) => (
              <GroupRow key={group.id} group={group} index={i} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 px-8 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users size={26} className="text-gray-300" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">No groups found</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Try a different search term or be the first to create a group.
              </p>
              <Link
                to="/groups/create"
                className="bg-primary text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-orange-500/20"
              >
                Create Group
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Groups;
