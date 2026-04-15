import React from 'react';
import { motion } from 'framer-motion';
import { Tag, TrendingUp, Users, DollarSign, Plus } from 'lucide-react';

const VendorDashboard = () => {
  const stats = [
    { label: 'Live Offers', value: '12', icon: Tag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Conversions', value: '84%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Reach', value: '1.2k', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Revenue Generated', value: '$8.4k', icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Vendor Dashboard</h1>
          <p className="text-gray-500 font-medium">Manage your offers and group engagement</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/10">
          <Plus size={20} />
          Launch New Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-gray-900">Current Offers</h2>
          <span className="text-sm text-secondary cursor-pointer hover:text-primary font-medium">View All</span>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-xl"></div>
                <div>
                  <h4 className="font-bold text-gray-900">MacBook Pro M2 - Bulk Discount</h4>
                  <p className="text-sm text-gray-500 font-medium">Electronics Category · 4 days remaining</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900">$1,899 / unit</p>
                <span className="text-xs px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full font-bold uppercase tracking-wider">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
