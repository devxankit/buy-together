import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, MapPin, Users, ArrowRight,
  TrendingUp, Award, Star, Search, Sliders, Heart, ChevronRight
} from 'lucide-react';

import { useSelector } from '../../../hooks/useSelector';
import { Link } from 'react-router-dom';

import banner1 from '../../../assets/banner1.png';
import banner2 from '../../../assets/banner2.png';
import banner3 from '../../../assets/banner3.png';
import appliancesImg from '../../../assets/Appliances.png';
import bikeImg from '../../../assets/bike.png';
import carImg from '../../../assets/car.png';
import itImg from '../../../assets/IT.png';
import laptopImg from '../../../assets/laptop.png';
import phoneImg from '../../../assets/phone.png';
import realEstateImg from '../../../assets/real state.png';
import viewAllImg from '../../../assets/view all.png';



const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);






  /* ─── Existing home state ─────────────────────────────────── */
  const banners = [
    { id: 1, image: banner1 },
    { id: 2, image: banner2 },
    { id: 3, image: banner3 }
  ];

  const categories = [
    { name: 'Phone', image: phoneImg },
    { name: 'Car', image: carImg },
    { name: 'Appliances', image: appliancesImg },
    { name: 'Bike', image: bikeImg },
    { name: 'Laptop', image: laptopImg },
    { name: 'IT', image: itImg },
    { name: 'Real Estate', image: realEstateImg },
    { name: 'View All', image: viewAllImg },
  ];

  const activities = [
    "Rahul joined iPhone 16 Pro deal",
    "Sonia unlocked 20% discount on MacBooks",
    "5 new spots opened in Tesla Group",
    "Priya just created a group for Sony PS5"
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [[page, direction], setPage] = useState([0, 0]);
  const [activityIndex, setActivityIndex] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const searchPlaceholders = [
    "Search for iPhone 16 Pro Deals...",
    "Search for gym partners nearby...",
    "Search for bulk grocery groups...",
    "Search for split billing deals..."
  ];

  const currentBanner = Math.abs(page % banners.length);

  const paginate = (dir) => setPage([page + dir, dir]);

  useEffect(() => {
    const t1 = setInterval(() => paginate(1), 6000);
    const t2 = setInterval(() => setActivityIndex(p => (p + 1) % activities.length), 3000);
    const t3 = setInterval(() => setPlaceholderIndex(p => (p + 1) % searchPlaceholders.length), 3000);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); };
  }, [page]);

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0, scale: 1.08, filter: 'blur(8px)', zIndex: 0 }),
    center: {
      zIndex: 1, x: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
      transition: { x: { type: 'spring', stiffness: 280, damping: 28 }, opacity: { duration: 0.35 }, scale: { duration: 0.5 } }
    },
    exit: (d) => ({
      zIndex: 0, x: d < 0 ? '100%' : '-100%', opacity: 0, scale: 0.88, filter: 'blur(12px)',
      transition: { x: { type: 'spring', stiffness: 280, damping: 28 }, opacity: { duration: 0.28 } }
    })
  };

  /* ─────────────────────────────────────────────────────────── */
  return (
    <>
      <div className="flex flex-col pb-0">
        <div
          className="relative z-10 bg-[#fafafa] flex flex-col gap-2 pt-2"
        >

          {/* 0. GREETING */}
          <section className="px-6 pt-1 pb-1">
            <h1 className="text-[26px] font-bold text-[#1a2b4b] leading-tight tracking-tight">
              Good morning, {isAuthenticated ? user?.name?.split(' ')[0] : 'Alex'}
            </h1>
            <p className="text-gray-400 text-[15px] font-medium mt-0.5">
              Find our best deals. Save together.
            </p>
          </section>

          {/* 1. SEARCH - Updated to match new unified style */}
          <section
            className="px-6 pt-2 pb-3 bg-[#fafafa]"
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-20">
                <Search className="text-gray-400 group-focus-within:text-[#0052cc] transition-colors" size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[54px] pl-14 pr-14 bg-gray-100 rounded-2xl outline-none transition-all text-gray-900 font-medium text-[14px]"
              />
              <AnimatePresence mode="wait">
                {!searchQuery && (
                  <div className="absolute inset-0 left-14 flex items-center pointer-events-none z-10">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 0.45 }}
                      exit={{ y: -18, opacity: 0 }}
                      transition={{ duration: 0.45, ease: 'circOut' }}
                      className="text-gray-900 font-medium text-[14px] absolute"
                    >
                      {searchPlaceholders[placeholderIndex]}
                    </motion.span>
                  </div>
                )}
              </AnimatePresence>

              {/* Filter button inside search bar - Icon only */}
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors active:scale-90 p-1">
                <Sliders size={18} strokeWidth={2.5} />
              </button>
            </div>
          </section>

          {/* 1. HERO CAROUSEL */}
          <section className="px-4 mt-1">
            <div className="relative h-44 md:h-[350px] rounded-2xl overflow-hidden shadow-xl shadow-black/5 bg-white group">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={page}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(_, { offset }) => {
                    if (Math.abs(offset.x) > 50) paginate(offset.x > 0 ? -1 : 1);
                  }}
                  className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
                >
                  <motion.img
                    src={banners[currentBanner].image}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="w-full h-full object-cover pointer-events-none"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
                  <motion.div
                    initial={{ x: '-150%' }}
                    animate={{ x: '150%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* 2. CATEGORIES */}
          <section className="mt-4">
            <div className="flex items-center justify-between px-4 mb-5">
              <h2 className="text-lg font-black text-gray-900">Categories</h2>
            </div>
            <div className="grid grid-cols-4 gap-y-3 gap-x-2 px-4 pb-2 text-center">
              {categories.map((cat, i) => (
                <Link 
                  key={i} 
                  to={cat.name === 'View All' ? '/categories' : `/groups?category=${cat.name.toLowerCase()}`}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-black/5 bg-white transition-all active:scale-95 cursor-pointer hover:shadow-xl overflow-hidden border border-gray-50">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter w-full line-clamp-1">{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* 3. LIVE ACTIVITY */}
          <section className="px-4 mt-4">
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-3 flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div className="flex-1 relative h-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activityIndex}
                    initial={{ y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -18, opacity: 0 }}
                    className="text-xs font-bold text-secondary absolute inset-0 line-clamp-1"
                  >
                    {activities[activityIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <span className="text-[10px] font-black text-secondary/50 uppercase">Live</span>
            </div>
          </section>

          {/* 4. TRENDING GROUPS */}
          <section className="px-4 mt-6">
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-xl font-bold text-[#1a2b4b] flex items-center gap-2">
                <Flame className="text-orange-500 fill-orange-500" size={24} />
                Trending Groups
              </h2>
              <Link to="/groups" className="text-[#0052cc] text-sm font-bold flex items-center gap-0.5 hover:underline">
                View all <ChevronRight size={16} />
              </Link>
            </div>

            <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4 px-1">
              <GroupCard
                title="iPhone 16 Pro"
                price="₹1,19,900"
                originalPrice="₹1,29,900"
                joined={7}
                total={10}
                rating="4.9"
                image="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop"
                tag="MOST POPULAR"
              />
              <GroupCard
                title="Sony PlayStation 5"
                price="₹44,990"
                originalPrice="₹54,990"
                joined={4}
                total={6}
                rating="4.9"
                image="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=400&auto=format&fit=crop"
                tag="LIMITED STOCK"
              />
              <GroupCard
                title="Realme Pad X"
                price="₹15,499"
                originalPrice="₹19,999"
                joined={8}
                total={10}
                rating="4.8"
                image="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop"
                tag="HURRY! 2 LEFT"
              />
              <GroupCard
                title="Samsung Galaxy S24 Ultra"
                price="₹1,09,999"
                originalPrice="₹1,29,999"
                joined={3}
                total={5}
                rating="4.7"
                image="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=400&auto=format&fit=crop"
                tag="NEW ARRIVAL"
              />
              <GroupCard
                title="BoAt Airdopes 161"
                price="₹1,299"
                originalPrice="₹2,499"
                joined={6}
                total={10}
                rating="4.6"
                image="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop"
                tag="HOT PRODUCT"
              />
            </div>

            {/* Start your own group banner */}
            <div className="mt-4 bg-[#f8faff] rounded-2xl p-4 border border-blue-50 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4f46e5] rounded-xl flex items-center justify-center text-white">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a2b4b] text-sm">Start your own group</h3>
                  <p className="text-gray-400 text-[11px] font-medium">Invite friends & save together</p>
                </div>
              </div>
              <button className="bg-[#eff2ff] text-[#4f46e5] px-4 py-2 rounded-lg font-bold text-[13px] hover:bg-blue-100 transition-colors">
                Create Group
              </button>
            </div>
          </section>

          {/* 5. NEARBY GROUPS */}
          <section className="px-4 mt-8">
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <MapPin className="text-[#0052cc]" size={20} fill="#0052cc" fillOpacity={0.1} />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[19px] font-black text-[#1a2b4b] tracking-tight leading-none">Near You</h2>
                  <span className="text-[10px] font-bold text-gray-400 mt-0.5">Lajpat Nagar, Delhi</span>
                </div>
              </div>
              <Link to="/groups" className="text-[11px] font-black text-[#0052cc] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                See All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex overflow-x-auto gap-5 no-scrollbar pb-2 px-1">
              <NearbyCard
                title="Grocery Haul"
                vendor="Big Store"
                distance="0.8 km"
                joined={4}
                total={5}
                tag="🔥 Trending"
              />
              <NearbyCard
                title="Home Cleaning Kit"
                vendor="Essentials Hub"
                distance="1.2 km"
                joined={2}
                total={8}
                tag="⏳ 2 spots left"
                tagColor="bg-orange-50 text-orange-500"
              />
            </div>
          </section>



          {/* 7. APP INFO / FOOTER */}
          <section className="px-8 pt-8 pb-6 bg-gray-50/50 mt-0 rounded-t-[3rem] border-t border-gray-100">
            <h2 className="text-[52px] font-black text-gray-300 leading-[1.1] tracking-wide mb-12 select-none uppercase">
              TRULY <br /> INDIAN <br /> APP
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Made with
                </span>
                <Heart size={16} className="fill-red-500 text-red-500" />
                <span className="text-[13px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  in Appzeto
                </span>
              </div>
              <p className="text-[10px] font-medium text-gray-400/60 uppercase tracking-[0.3em]">
                App Version 23.41.1
              </p>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

/* ─── Tiny stat block ─────────────────────────────────────────── */
const Stat = ({ value, label }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-white font-black text-[15px] leading-none">{value}</span>
    <span className="text-white/40 text-[10px] font-bold leading-none">{label}</span>
  </div>
);

/* ─── Group card ─────────────────────────────────────────────── */
const GroupCard = ({ title, price, originalPrice, joined, total, image, tag, rating }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="min-w-[240px] bg-white rounded-[2.5rem] p-3 border border-gray-100 shadow-2xl shadow-black/[0.03] overflow-hidden group flex flex-col gap-3"
  >
    {/* Image container */}
    <div className="h-40 rounded-[1.75rem] overflow-hidden relative shrink-0">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

      {/* Floating Tag */}
      {tag && (
        <div className="absolute top-3 left-3 bg-[#ff7a00] text-white px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase shadow-lg shadow-orange-500/20">
          {tag}
        </div>
      )}

      {/* Rating Badge */}
      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-white/20">
        <Star size={10} className="fill-[#ff7a00] text-[#ff7a00]" />
        <span className="text-[10px] font-black text-[#1a2b4b]">{rating || '4.8'}</span>
      </div>
    </div>

    {/* Content Section */}
    <div className="px-1.5 pb-2 flex flex-col gap-3">
      <div>
        <h3 className="font-bold text-[#1a2b4b] tracking-tight text-[16px] line-clamp-1 mb-1">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-[#0052cc] font-black text-lg leading-none">{price}</span>
          <span className="text-gray-300 line-through text-[11px] font-bold">{originalPrice}</span>
        </div>
      </div>

      {/* Progress & Social Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <img
                key={i}
                src={`https://i.pravatar.cc/100?u=${i + title.length + (Math.random() * 100)}`}
                className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 shadow-sm"
                alt=""
              />
            ))}
          </div>
          <span className="text-[10px] font-black text-[#1a2b4b] uppercase tracking-tighter">{joined}/{total} Joined</span>
        </div>

        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(joined / total) * 100}%` }}
            className="h-full bg-gradient-to-r from-[#0052cc] to-[#3b82f6] rounded-full"
          />
        </div>
      </div>
    </div>
  </motion.div>
);

/* ─── Nearby card ─────────────────────────────────────────────── */
const NearbyCard = ({ title, vendor, distance, joined, total, tag }) => (
  <motion.div
    whileHover={{ y: -2, scale: 0.99 }}
    whileTap={{ scale: 0.97 }}
    className="min-w-[240px] bg-white rounded-[1.75rem] p-4 border border-gray-100 shadow-xl shadow-black/[0.02] flex flex-col gap-3"
  >
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-[#f0f7ff] rounded-2xl flex items-center justify-center shrink-0 border border-blue-50">
        <MapPin size={22} className="text-[#0052cc]" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-black text-[#0052cc] uppercase tracking-tighter">{distance}</span>
          {tag && <span className="text-[8px] font-black bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Hot</span>}
        </div>
        <h3 className="font-bold text-[#1a2b4b] text-sm truncate leading-tight">{title}</h3>
        <p className="text-[10px] font-medium text-gray-400 truncate">{vendor}</p>
      </div>
    </div>

    <div className="flex items-center justify-between pt-1 border-t border-gray-50/50">
      <div className="flex -space-x-1.5">
        {[1, 2, 3].map(i => (
          <img
            key={i}
            src={`https://i.pravatar.cc/100?u=${i + title.length}`}
            className="w-6 h-6 rounded-full border border-white shadow-sm"
            alt=""
          />
        ))}
        {total > 3 && (
          <div className="w-6 h-6 rounded-full bg-gray-50 border border-white flex items-center justify-center text-[8px] font-bold text-gray-400">
            +{total - 3}
          </div>
        )}
      </div>

      <button className="bg-[#0052cc] text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase shadow-lg shadow-blue-500/10 active:scale-95 transition-all">
        Join {joined}/{total}
      </button>
    </div>
  </motion.div>
);
export default Home;
