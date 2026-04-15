import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, AlertCircle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Groups', value: '342', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Approvals', value: '12', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Success Rate', value: '94%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Shield size={32} className="text-secondary" />
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent italic">Admin</span> Control Center
          </h1>
          <p className="text-gray-500 font-medium">Platform overview and management dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center font-bold text-sm">U{item}</div>
                <div>
                  <p className="text-gray-900 font-bold text-sm">New Group Created: "Tech Bulk Deals"</p>
                  <p className="text-gray-500 text-xs mt-1">2 minutes ago by User {item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Health</h2>
          <div className="h-64 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center flex-col gap-2">
            <TrendingUp size={48} className="text-gray-300" />
            <p className="text-gray-400 font-medium">Visual metrics would be rendered here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
