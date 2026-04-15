import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, Users, MessageSquare, ArrowLeft } from 'lucide-react';

const GroupDetail = () => {
  const { groupId } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/" className="flex items-center gap-2 text-gray-500 mb-8 hover:text-black transition-colors">
        <ArrowLeft size={18} />
        Back to Groups
      </Link>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-24 h-24 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 shadow-sm shadow-orange-500/10">
            <Users size={40} className="text-primary" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Exclusive Electronics Group</h1>
            <p className="text-gray-500 max-w-lg mb-4">A group dedicated to finding the best bulk deals on high-end laptops and mobile devices.</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <span className="px-4 py-1.5 bg-gray-50 rounded-full text-sm font-medium border border-gray-100">12 Members</span>
              <span className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">Active Deal</span>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto bg-primary text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-orange-500/20 transition-all"
          >
            Join Group
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
            <Info size={18} className="text-blue-500" />
            Group Information
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex justify-between"><span>Creator</span><span className="font-medium text-gray-900">Ankit Ahirwar</span></li>
            <li className="flex justify-between"><span>Created On</span><span className="font-medium text-gray-900">Apr 10, 2026</span></li>
            <li className="flex justify-between"><span>Category</span><span className="font-medium text-gray-900">Electronics</span></li>
          </ul>
        </div>
        <Link to={`/groups/${groupId}/chat`} className="bg-secondary p-6 rounded-2xl border border-secondary shadow-lg shadow-blue-500/10 group hover:opacity-90 transition-all">
          <h3 className="flex items-center gap-2 font-bold text-white mb-2">
            <MessageSquare size={18} className="text-white" />
            Group Chat
          </h3>
          <p className="text-gray-400 text-sm mb-4">Discuss products and deal terms with other members.</p>
          <span className="text-white text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Open Chat <ArrowLeft size={16} className="rotate-180" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default GroupDetail;
