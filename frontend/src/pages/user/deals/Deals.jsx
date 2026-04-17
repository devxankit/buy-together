import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Clock, ShieldCheck, Star, Zap, CheckCircle2, ChevronRight, TrendingUp } from 'lucide-react';

const TABS = [
  { id: 'active', label: 'Active Deals' },
  { id: 'mine', label: 'My Deals' },
  { id: 'past', label: 'Completed' },
];

const ACTIVE_DEALS = [
  {
    id: '1',
    product: 'iPhone 16 Pro Max — 256GB Natural Titanium',
    vendor: 'Certified Apple Partner',
    vendorRating: 4.9,
    vendorReviews: 238,
    price: '₹99,000',
    originalPrice: '₹1,19,990',
    savings: '₹20,990',
    savingsPercent: '17%',
    deadline: '48h left',
    confirmedCount: 16,
    totalCount: 20,
    group: 'iPhone 16 Pro Bulk Buy',
    urgent: true,
  },
  {
    id: '2',
    product: 'Sony Bravia OLED 55" 4K Google TV',
    vendor: 'Sony Official Partner',
    vendorRating: 4.8,
    vendorReviews: 102,
    price: '₹89,999',
    originalPrice: '₹1,19,999',
    savings: '₹30,000',
    savingsPercent: '25%',
    deadline: '24h left',
    confirmedCount: 9,
    totalCount: 10,
    group: 'Sony OLED TV Group',
    urgent: true,
  },
  {
    id: '3',
    product: 'Royal Enfield Bullet 350 — Redditch Red',
    vendor: 'RE Authorised Dealer',
    vendorRating: 4.6,
    vendorReviews: 87,
    price: '₹1,82,000',
    originalPrice: '₹1,95,000',
    savings: '₹13,000',
    savingsPercent: '7%',
    deadline: '5 days left',
    confirmedCount: 5,
    totalCount: 8,
    group: 'Royal Enfield Bullet 350',
    urgent: false,
  },
];

const MY_DEALS = [
  {
    id: '4',
    product: 'Samsung Galaxy S23 FE — 128GB',
    vendor: 'Samsung Authorised Dealer',
    price: '₹34,000',
    savings: '₹8,000',
    status: 'confirmed',
    group: 'Samsung S23 Group',
    date: 'Apr 10, 2026',
  },
];

const DealCard = ({ deal, index }) => {
  const progress = (deal.confirmedCount / deal.totalCount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/5 overflow-hidden"
    >
      {/* Card Top Bar */}
      <div className={`px-6 py-3 flex items-center justify-between ${deal.urgent ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <span className={`text-[10px] font-black uppercase tracking-widest ${deal.urgent ? 'text-white/50' : 'text-gray-500'}`}>
          Deal Stage
        </span>
        <span className={`flex items-center gap-1.5 text-[11px] font-black ${deal.urgent ? 'text-primary' : 'text-gray-600'}`}>
          <Clock size={11} />
          {deal.deadline}
        </span>
      </div>

      <div className="p-5">
        {/* Product */}
        <h3 className="font-black text-gray-900 text-[15px] leading-tight mb-1">{deal.product}</h3>
        <p className="text-[11px] text-gray-400 font-bold mb-4">Group: {deal.group}</p>

        {/* Vendor */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 mb-4">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20 text-sm">
            {deal.vendor[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-gray-900 truncate">{deal.vendor}</span>
              <ShieldCheck size={13} className="text-secondary shrink-0" />
            </div>
            <div className="flex items-center gap-1">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[11px] font-bold text-gray-400">{deal.vendorRating} · {deal.vendorReviews} reviews</span>
            </div>
          </div>
        </div>

        {/* Price + Savings */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight">{deal.price}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-gray-300 line-through font-bold">{deal.originalPrice}</span>
              <span className="text-[11px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                Save {deal.savings} ({deal.savingsPercent})
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold text-gray-400 mb-1">{deal.confirmedCount}/{deal.totalCount} confirmed</div>
            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.9 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-all active:scale-95">
          Confirm Interest →
        </button>
      </div>
    </motion.div>
  );
};

const Deals = () => {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="flex flex-col pb-28">
      {/* Header */}
      <div className="px-5 pt-7 pb-4 bg-white sticky top-0 z-20 border-b border-gray-50">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-0.5">Deals</h1>
        <p className="text-xs text-gray-400 font-bold mb-4">Locked group offers waiting for your confirmation</p>
        <div className="flex gap-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-[11px] font-black transition-all ${
                activeTab === tab.id ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'active' && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Urgency Banner */}
            <div className="mx-5 mt-4 bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center gap-3">
              <Zap size={17} className="text-primary fill-primary shrink-0" />
              <p className="text-[12px] font-bold text-gray-800 leading-tight">
                2 deals closing in 48h —{' '}
                <span className="text-primary">confirm now to lock in your price</span>
              </p>
            </div>

            {/* Stats Row */}
            <div className="px-5 mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'Active Deals', value: '3', color: 'text-primary' },
                { label: 'Total Savings', value: '₹63K+', color: 'text-green-600' },
                { label: 'Vendors', value: '3', color: 'text-secondary' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm text-center">
                  <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] font-bold text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Deal Cards */}
            <div className="px-5 mt-5 flex flex-col gap-5">
              {ACTIVE_DEALS.map((deal, i) => (
                <DealCard key={deal.id} deal={deal} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'mine' && (
          <motion.div key="mine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="px-5 mt-5 flex flex-col gap-4">
              {MY_DEALS.map((deal, i) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                      <CheckCircle2 size={22} className="text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-gray-900 text-sm leading-tight">{deal.product}</h4>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">{deal.vendor}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-gray-900">{deal.price}</span>
                        <span className="text-[11px] font-bold text-green-600">Saved {deal.savings}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 uppercase">
                        Confirmed
                      </span>
                      <p className="text-[10px] text-gray-400 font-bold mt-2">{deal.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'past' && (
          <motion.div key="past" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mb-4">
                <Tag size={24} className="text-gray-300" />
              </div>
              <h3 className="font-black text-gray-900 mb-1">No completed deals yet</h3>
              <p className="text-sm text-gray-400 font-medium">
                Your completed group deals will show up here once they're done.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Deals;
