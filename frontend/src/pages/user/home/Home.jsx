import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, Car, Tv, Bike, 
  Flame, MapPin, Users, ArrowRight, 
  TrendingUp, Award, ShieldCheck, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import topImage from '../../../assets/top image.png';
import banner1 from '../../../assets/banner1.png';
import banner2 from '../../../assets/banner2.png';
import banner3 from '../../../assets/banner3.png';

const Home = () => {
  const banners = [
    { id: 1, image: banner1 },
    { id: 2, image: banner2 },
    { id: 3, image: banner3 }
  ];

  const categories = [
    { name: 'Electronics', icon: Smartphone, color: 'text-orange-500 bg-orange-50' },
    { name: 'Cars', icon: Car, color: 'text-blue-500 bg-blue-50' },
    { name: 'Appliances', icon: Tv, color: 'text-purple-500 bg-purple-50' },
    { name: 'Bikes', icon: Bike, color: 'text-green-500 bg-green-50' },
    { name: 'Laptops', icon: Smartphone, color: 'text-red-500 bg-red-50' },
  ];

  const activities = [
    "Rahul joined iPhone 16 Pro deal",
    "Sonia unlocked 20% discount on MacBooks",
    "5 new spots opened in Tesla Group",
    "Priya just created a group for Sony PS5"
  ];

  const [[page, direction], setPage] = useState([0, 0]);
  const [activityIndex, setActivityIndex] = useState(0);
  const currentBanner = Math.abs(page % banners.length);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      paginate(1);
    }, 6000); // 6s for a more premium pace
    
    const activityTimer = setInterval(() => {
      setActivityIndex(prev => (prev + 1) % activities.length);
    }, 3000);

    return () => {
      clearInterval(bannerTimer);
      clearInterval(activityTimer);
    };
  }, [page]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1,
      filter: 'blur(10px)',
      zIndex: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.5, ease: "easeOut" }
      }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.85,
      filter: 'blur(15px)',
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      
      {/* 1. TOP HERO IMAGE */}
      <section className="w-full relative group">
        <img 
          src={topImage} 
          alt="Featured Deal" 
          className="w-full object-cover"
        />
        {/* Bottom Fade Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#fafafa] to-transparent" />
      </section>

      {/* 2. QUICK ACTION / CATEGORY SECTION */}
      <section className="-mt-6">
        <div className="flex items-center justify-between px-6 mb-4">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            Categories
          </h2>
          <button className="text-primary font-bold text-xs uppercase tracking-widest opacity-50">View All</button>
        </div>
        <div className="flex overflow-x-auto px-6 gap-4 no-scrollbar pb-2">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[70px]">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-black/5 ${cat.color} transition-all active:scale-90 cursor-pointer hover:rotate-2 hover:shadow-xl`}>
                <cat.icon size={26} />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter text-center">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ELITE CAROUSEL */}
      <section className="px-4">
        <div className="relative h-56 md:h-72 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/10 bg-white group">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) > 50;
                if (swipe) {
                  paginate(offset.x > 0 ? -1 : 1);
                }
              }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
            >
              {/* Parallax Image Content */}
              <motion.img
                src={banners[currentBanner].image}
                initial={{ scale: 1.2, x: direction > 0 ? 50 : -50 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-full object-cover pointer-events-none"
                alt=""
              />
              
              {/* Shimmer / Glint Effect */}
              <motion.div 
                initial={{ x: '-150%' }}
                animate={{ x: '150%' }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />

              {/* Quality Border overlay */}
              <div className="absolute inset-0 border-[8px] border-white/10 rounded-[2.5rem] pointer-events-none" />
            </motion.div>
          </AnimatePresence>
          
          {/* Elite Progress Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10 px-4 py-2 bg-black/10 backdrop-blur-md rounded-full border border-white/10">
            {banners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => {
                  const newDir = i > currentBanner ? 1 : -1;
                  setPage([i, newDir]);
                }}
                className="relative h-1 w-10 bg-white/20 rounded-full overflow-hidden transition-all overflow-hidden"
              >
                {currentBanner === i && (
                  <motion.div 
                    layoutId="progress"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="absolute inset-0 bg-white"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SOCIAL PROOF / ACTIVITY */}
      <section className="px-6">
        <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-3 flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <TrendingUp size={16} className="text-white" />
          </div>
          <div className="flex-1 relative h-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={activityIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
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
      <section className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Flame className="text-orange-500 fill-orange-500" size={20} />
            Trending Groups
          </h2>
          <ArrowRight size={20} className="text-gray-300" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GroupCard 
            title="Realme Pad X" 
            price="₹15,499"
            originalPrice="₹19,999"
            joined={8}
            total={10}
            image="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop"
            tag="Hurry! 2 Left"
          />
          <GroupCard 
            title="Samsung S23 FE" 
            price="₹34,000"
            originalPrice="₹42,000"
            joined={15}
            total={20}
            image="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=400&auto=format&fit=crop"
            tag="Hot Product"
          />
        </div>
      </section>

      {/* 5. NEARBY GROUPS SECTION */}
      <section className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 text-left">
            <MapPin className="text-blue-500 fill-blue-500" size={20} />
            Near You
          </h2>
          <span className="text-xs font-bold text-gray-400">Lajpat Nagar, Delhi</span>
        </div>

        <div className="flex overflow-x-auto gap-4 no-scrollbar pb-6 px-1">
          <NearbyCard 
            title="Grocery Haul" 
            vendor="Big Store" 
            distance="0.8 km"
            joined={4}
            total={5}
          />
          <NearbyCard 
            title="Home Cleaning Kit" 
            vendor="Essentials Hub" 
            distance="1.2 km"
            joined={2}
            total={8}
          />
        </div>
      </section>

      {/* 6. VENDOR OFFERS */}
      <section className="px-6 mb-12">
        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2 flex items-center gap-2 shrink-0">
               <Award className="text-primary" />
               Vendor Exclusive
            </h2>
            <p className="text-white/60 text-sm font-medium mb-6">Verified partners with guaranteed lowest prices.</p>
            <button className="bg-white text-black px-8 py-3 rounded-full font-black text-sm hover:bg-gray-200 transition-colors">
              Explore Offers
            </button>
          </div>
          <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-primary/20 blur-[60px] rounded-full" />
        </div>
      </section>

    </div>
  );
};

const GroupCard = ({ title, price, originalPrice, joined, total, image, tag }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/5 overflow-hidden group"
  >
    <div className="h-40 overflow-hidden relative">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary shadow-sm">
        {tag}
      </div>
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-black text-gray-900 tracking-tight text-lg mb-1">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-secondary font-black">{price}</span>
            <span className="text-gray-300 line-through text-xs font-bold">{originalPrice}</span>
          </div>
        </div>
        <div className="bg-blue-50 text-secondary px-3 py-1.5 rounded-xl flex items-center gap-1">
          <Star size={12} className="fill-blue-500" />
          <span className="text-[10px] font-black tracking-tighter">4.8</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1.5 px-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{joined}/{total} Joined</span>
        </div>
        <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(joined / total) * 100}%` }}
            className={`h-full ${joined > total * 0.7 ? 'bg-secondary' : 'bg-primary'} rounded-full`}
          />
        </div>
      </div>

      <button className="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all transform active:scale-95 shadow-lg shadow-black/10">
        Join Group <Users size={18} />
      </button>
    </div>
  </motion.div>
);

const NearbyCard = ({ title, vendor, distance, joined, total }) => (
  <div className="min-w-[260px] bg-white rounded-3xl p-5 border border-gray-100 shadow-lg shadow-black/5 relative overflow-hidden group">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-500">
        <MapPin size={24} />
      </div>
      <div>
        <h3 className="font-black text-gray-900 tracking-tight text-sm line-clamp-1">{title}</h3>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-gray-400">{vendor}</span>
          <span className="w-1 h-1 bg-gray-200 rounded-full" />
          <span className="text-[10px] font-black text-blue-500">{distance}</span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center justify-between gap-4">
       <div className="flex -space-x-2">
         {[1,2,3].map(i => (
           <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black">U{i}</div>
         ))}
       </div>
       <button className="bg-blue-50 text-secondary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">
         Join {joined}/{total}
       </button>
    </div>
  </div>
);

export default Home;
