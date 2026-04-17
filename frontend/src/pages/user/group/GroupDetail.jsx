import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Users, MapPin, ShieldCheck, MessageSquare,
  BarChart2, Zap, ChevronRight, Star, Clock, CheckCircle2,
  TrendingUp, Lock, AlertCircle, Info
} from 'lucide-react';

const MOCK_GROUP = {
  id: '1',
  name: 'iPhone 16 Pro Max — Bulk Buy',
  description: 'Group to negotiate the best bulk price on iPhone 16 Pro Max. We target 20 buyers to unlock the best discount from certified Apple resellers.',
  category: 'Electronics',
  location: 'Delhi NCR',
  joined: 18,
  total: 20,
  status: 'near_completion',
  isVendor: true,
  vendor: { name: 'Certified Apple Partner', rating: 4.9, reviews: 238, verified: true },
  price: '₹99,000',
  originalPrice: '₹1,19,990',
  savings: '₹20,990',
  creator: 'Ankit A.',
  createdAt: 'Apr 10, 2026',
  members: [
    { id: 1, name: 'Ankit A.', score: 100, isCreator: true },
    { id: 2, name: 'Rahul S.', score: 80 },
    { id: 3, name: 'Priya K.', score: 70 },
    { id: 4, name: 'Sonia M.', score: 50 },
    { id: 5, name: 'Vikram T.', score: 90 },
    { id: 6, name: 'Deepa R.', score: 60 },
  ],
  poll: {
    question: 'What is your max budget for iPhone 16 Pro Max?',
    options: [
      { label: 'Under ₹95,000', votes: 4 },
      { label: '₹95K – ₹1,05,000', votes: 9 },
      { label: '₹1,05K – ₹1,20,000', votes: 5 },
    ],
    totalVotes: 18,
  },
  tags: ['Bulk Deal', 'Electronics', 'Apple', 'Delhi'],
  joinedToday: 3,
};

const STATUS = {
  active: { label: 'Active', cls: 'text-green-600 bg-green-50', icon: TrendingUp },
  near_completion: { label: 'Almost Full', cls: 'text-primary bg-orange-50', icon: Zap },
  locked: { label: 'Deal Stage', cls: 'text-secondary bg-blue-50', icon: Lock },
  completed: { label: 'Completed', cls: 'text-gray-500 bg-gray-100', icon: CheckCircle2 },
};

const AVATAR_BG = ['bg-orange-100 text-orange-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-pink-100 text-pink-600', 'bg-yellow-100 text-yellow-600'];

const GroupDetail = () => {
  const { groupId } = useParams();
  const group = MOCK_GROUP;
  const [joined, setJoined] = useState(false);
  const [votedOption, setVotedOption] = useState(null);

  const progress = (group.joined / group.total) * 100;
  const spotsLeft = group.total - group.joined;
  const status = STATUS[group.status] || STATUS.active;
  const StatusIcon = status.icon;

  return (
    <div className="flex flex-col pb-28 bg-[#fafafa]">
      {/* Back Header */}
      <div className="px-5 pt-5 pb-4 bg-white border-b border-gray-50 flex items-center gap-3 sticky top-0 z-20">
        <Link to="/groups" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-gray-900 text-sm leading-tight truncate">{group.name}</h2>
          <p className="text-[11px] text-gray-400 font-bold">{group.category} · {group.location}</p>
        </div>
        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 ${status.cls}`}>
          <StatusIcon size={10} />
          {status.label}
        </span>
      </div>

      {/* Hero Info Card */}
      <div className="mx-5 mt-5 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/5 p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 border border-orange-100">
            <span className="text-2xl font-black text-primary">{group.name[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-gray-900 text-lg leading-tight mb-1">{group.name}</h1>
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={12} className="text-gray-300 shrink-0" />
              <span className="text-[12px] font-bold text-gray-400">{group.location}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {group.tags.map(tag => (
                <span key={tag} className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-5">{group.description}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-gray-400" />
              <span className="text-sm font-black text-gray-700">{group.joined} / {group.total} joined</span>
            </div>
            {spotsLeft > 0 ? (
              <span className="flex items-center gap-1 text-[12px] font-black text-primary">
                <Zap size={12} className="fill-primary" />
                Only {spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left!
              </span>
            ) : (
              <span className="text-[12px] font-black text-secondary flex items-center gap-1">
                <Lock size={12} />
                Group Full
              </span>
            )}
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${progress >= 90 ? 'bg-primary' : 'bg-secondary'}`}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] font-bold text-gray-400">0</span>
            <span className="text-[10px] font-bold text-gray-400">{group.total} target</span>
          </div>
        </div>

        {/* FOMO Signal */}
        {group.joinedToday > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-2xl px-3 py-2 mb-4">
            <TrendingUp size={14} className="text-primary shrink-0" />
            <span className="text-[12px] font-bold text-primary">{group.joinedToday} people joined today</span>
          </div>
        )}

        {/* Price Block */}
        {group.price && (
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 mb-5">
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Deal Price</div>
              <div className="text-2xl font-black text-gray-900 tracking-tight">{group.price}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-gray-300 line-through font-bold">{group.originalPrice}</span>
                <span className="text-[11px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Save {group.savings}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-bold text-gray-400">per person</div>
              <div className="text-[11px] font-black text-secondary mt-1">Bulk price</div>
            </div>
          </div>
        )}

        {/* Join CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setJoined(v => !v)}
          className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-lg ${
            joined
              ? 'bg-gray-100 text-gray-600 shadow-black/5'
              : 'bg-primary text-white shadow-orange-500/25 hover:bg-orange-600'
          }`}
        >
          {joined ? '✓ Joined — You\'re In' : `Join Group (${spotsLeft} spots left)`}
        </motion.button>
      </div>

      {/* Vendor Info */}
      {group.isVendor && (
        <div className="mx-5 mt-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
            <ShieldCheck size={15} className="text-secondary" />
            Verified Vendor
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">
              {group.vendor.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-gray-900 text-sm">{group.vendor.name}</span>
                <ShieldCheck size={14} className="text-secondary" />
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={11} className={s <= Math.floor(group.vendor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
                ))}
                <span className="text-[11px] font-bold text-gray-400 ml-1">{group.vendor.rating} · {group.vendor.reviews} reviews</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        </div>
      )}

      {/* Poll */}
      {group.poll && (
        <div className="mx-5 mt-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-black text-gray-900 mb-1 flex items-center gap-2">
            <BarChart2 size={15} className="text-primary" />
            Group Poll
          </h3>
          <p className="text-[12px] font-bold text-gray-500 mb-4">{group.poll.question}</p>
          <div className="flex flex-col gap-2">
            {group.poll.options.map((opt, i) => {
              const pct = Math.round((opt.votes / group.poll.totalVotes) * 100);
              const isVoted = votedOption === i;
              return (
                <button
                  key={i}
                  onClick={() => setVotedOption(i)}
                  className={`relative w-full text-left rounded-2xl overflow-hidden border transition-all ${
                    isVoted ? 'border-primary' : 'border-gray-100'
                  }`}
                >
                  <div
                    className={`absolute inset-y-0 left-0 transition-all ${isVoted ? 'bg-primary/10' : 'bg-gray-50'}`}
                    style={{ width: votedOption !== null ? `${pct}%` : '0%' }}
                  />
                  <div className="relative flex items-center justify-between px-4 py-3">
                    <span className={`text-sm font-bold ${isVoted ? 'text-primary' : 'text-gray-700'}`}>{opt.label}</span>
                    {votedOption !== null && (
                      <span className={`text-[11px] font-black ${isVoted ? 'text-primary' : 'text-gray-400'}`}>{pct}%</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] font-bold text-gray-400 mt-3">{group.poll.totalVotes} votes</p>
        </div>
      )}

      {/* Members */}
      <div className="mx-5 mt-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <Users size={15} className="text-gray-400" />
            Members ({group.members.length})
          </h3>
          <span className="text-[11px] font-bold text-gray-400">Intent Score</span>
        </div>
        <div className="flex flex-col gap-3">
          {group.members.map((m, i) => (
            <div key={m.id} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black ${AVATAR_BG[i % 6]}`}>
                {m.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-900 truncate">{m.name}</span>
                  {m.isCreator && (
                    <span className="text-[9px] font-black text-primary bg-orange-50 px-1.5 py-0.5 rounded-full uppercase">Creator</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: `${m.score}%` }} />
                </div>
                <span className="text-[11px] font-black text-gray-500 w-6 text-right">{m.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group Info */}
      <div className="mx-5 mt-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
          <Info size={15} className="text-gray-400" />
          Group Info
        </h3>
        <div className="space-y-2.5">
          {[
            { label: 'Creator', value: group.creator },
            { label: 'Created', value: group.createdAt },
            { label: 'Category', value: group.category },
            { label: 'Location', value: group.location },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-gray-400">{row.label}</span>
              <span className="text-[12px] font-black text-gray-800">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Open Chat CTA */}
      <div className="mx-5 mt-4">
        <Link to={`/groups/${groupId}/chat`}>
          <div className="bg-gray-900 rounded-3xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <MessageSquare size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-white text-sm">Open Group Chat</h4>
              <p className="text-[12px] text-white/50 font-medium mt-0.5">Discuss deal terms with 18 members</p>
            </div>
            <ChevronRight size={18} className="text-white/40" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default GroupDetail;
