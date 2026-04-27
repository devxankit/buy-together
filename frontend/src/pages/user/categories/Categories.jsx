import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ChevronRight, LayoutGrid, Sliders
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

import appliancesImg from '../../../assets/Appliances.png';
import bikeImg from '../../../assets/bike.png';
import carImg from '../../../assets/car.png';
import itImg from '../../../assets/IT.png';
import laptopImg from '../../../assets/laptop.png';
import phoneImg from '../../../assets/phone.png';
import realEstateImg from '../../../assets/real state.png';
import viewAllImg from '../../../assets/view all.png';

const CATEGORIES = [
  { id: 'phone', name: 'Phone', image: phoneImg },
  { id: 'car', name: 'Car', image: carImg },
  { id: 'appliances', name: 'Appliances', image: appliancesImg },
  { id: 'bike', name: 'Bike', image: bikeImg },
  { id: 'laptop', name: 'Laptop', image: laptopImg },
  { id: 'it', name: 'IT', image: itImg },
  { id: 'realestate', name: 'Real Estate', image: realEstateImg },
  { id: 'home', name: 'Home & Living', image: appliancesImg },
  { id: 'fitness', name: 'Fitness', image: phoneImg },
  { id: 'fashion', name: 'Fashion', image: laptopImg },
  { id: 'beauty', name: 'Beauty', image: itImg },
  { id: 'more', name: 'Others', image: viewAllImg },
];

const CHIPS = ['All', 'Electronics', 'Vehicles', 'Home', 'Services', 'Property'];

const Categories = () => {
  const navigate = useNavigate();
  const [activeChip, setActiveChip] = useState('All');
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col min-h-screen w-full bg-white pb-32">
      {/* Top Search Bar - No Header as requested */}
      <section className="px-5 pt-6 pb-4 sticky top-0 z-30 bg-white/80 backdrop-blur-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-20">
            <Search className="text-gray-400 group-focus-within:text-[#0052cc] transition-colors" size={18} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full h-12 pl-12 pr-12 bg-gray-100 rounded-2xl outline-none transition-all text-gray-800 font-medium text-[14px]"
          />
          
          {/* Filter button inside search bar */}
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors active:scale-90 p-1">
            <Sliders size={18} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      {/* Filter Chips */}
      <div className="flex gap-2 px-5 mb-8 overflow-x-auto no-scrollbar">
        {CHIPS.map(chip => (
          <button
            key={chip}
            onClick={() => setActiveChip(chip)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              activeChip === chip 
                ? 'bg-gray-900 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Categories Grid - Matching Home Page Style */}
      <div className="flex-1 px-6">
        <div className="grid grid-cols-4 gap-y-6 gap-x-3">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Link 
                to={cat.id === 'more' ? '/categories' : `/groups?category=${cat.name.toLowerCase()}`}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-black/5 bg-white transition-all active:scale-95 cursor-pointer hover:shadow-xl overflow-hidden border border-gray-50">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter text-center w-full line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Banner - Matching Home Page Style */}
      <div className="px-6 mt-16 mb-10">
        <div className="bg-[#f8faff] border border-blue-50 p-6 rounded-[2rem] flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-[#1a2b4b] text-base mb-1">Start your own group</h3>
            <p className="text-gray-400 text-[11px] font-medium mb-4">Invite friends & save together</p>
            <button 
              onClick={() => navigate('/create-group')}
              className="bg-[#eff2ff] text-[#4f46e5] px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-blue-100 transition-colors"
            >
              Create Group
            </button>
          </div>
          <div className="w-16 h-16 bg-[#4f46e5]/10 rounded-2xl flex items-center justify-center text-[#4f46e5] rotate-12">
            <LayoutGrid size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
