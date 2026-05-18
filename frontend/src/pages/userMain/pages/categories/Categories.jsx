import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// Category sub-components
import CategoryHeader from './components/CategoryHeader';
import MyCategoriesCarousel from './components/MyCategoriesCarousel';
import SubcategoriesCarousel from './components/SubcategoriesCarousel';
import SortTabs from './components/SortTabs';
import CategoryProductsList from './components/CategoryProductsList';
import BottomCTA from './components/BottomCTA';

const Categories = () => {
  const location = useLocation();

  // 1. STATE MANAGEMENT
  const [selectedCategory, setSelectedCategory] = useState('smartphones');
  const [selectedSub, setSelectedSub] = useState('all');
  const [activeSort, setActiveSort] = useState('trending');

  // Sync state when location.state changes
  useEffect(() => {
    if (location.state?.categoryId) {
      setSelectedCategory(location.state.categoryId);
    }
  }, [location.state]);

  // 2. MOCK CATEGORIES META DATA
  const categoryMeta = {
    smartphones: {
      title: 'Smartphones',
      groups: 128,
      buyers: '2.4K+',
      desc: 'Find people who want to buy the same smartphone and get the best deals together.'
    },
    laptops: {
      title: 'Laptops',
      groups: 64,
      buyers: '1.2K+',
      desc: 'Get bulk discount on pro-laptops, gaming hubs, and sleek workbooks together.'
    },
    appliances: {
      title: 'Appliances',
      groups: 92,
      buyers: '1.8K+',
      desc: 'Form active groups to lower costs on premium washing machines, fridges, and home hubs.'
    },
    electronics: {
      title: 'Electronics',
      groups: 110,
      buyers: '2.0K+',
      desc: 'Secure minimum pricing on trending audio hubs, active noise cancellation headsets, and accessories.'
    },
    fashion: {
      title: 'Fashion Hubs',
      groups: 45,
      buyers: '800+',
      desc: 'Join seasonal active buyers to unlock special offers on curated jackets and apparel.'
    },
    'home-living': {
      title: 'Home & Living',
      groups: 38,
      buyers: '600+',
      desc: 'Collaborate to buy modern minimalist sofas, home tables, and design items.'
    }
  };

  // 3. FULL DATASETS MAP FOR ALL CATEGORIES
  const productsData = {
    smartphones: [
      {
        id: 'phone-g1',
        title: 'iPhone 15 Pro Deal',
        status: 'active',
        brand: 'Apple',
        location: 'Mumbai, MH',
        slogan: "Let's buy iPhone 15 Pro together and get the best possible deal from verified sellers.",
        image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80',
        spotsJoined: 324,
        spotsTotal: 500,
        creatorName: 'Rohit Sharma',
        creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#iPhone15Pro', '#Apple', '#Deal'],
        badgeType: 'hot',
        badgeLabel: 'HOT',
        daysLeft: '176 more needed',
        targetPrice: 'Under ₹72,000',
        bestOffer: '₹69,999 (8% OFF)',
        myInterest: '2 Units'
      },
      {
        id: 'phone-g2',
        title: 'Galaxy S24 Ultra Deal',
        status: 'active',
        brand: 'Samsung',
        location: 'Pune, MH',
        slogan: 'Planning to buy S24 Ultra. Join to get maximum bulk discount from official retail hubs.',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=150&q=80',
        spotsJoined: 612,
        spotsTotal: 1000,
        creatorName: 'Neha Joshi',
        creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#S24Ultra', '#Samsung', '#Deal'],
        badgeType: 'rising',
        badgeLabel: 'RISING',
        daysLeft: '388 more needed',
        targetPrice: 'Under ₹85,000',
        bestOffer: '₹81,999 (7% OFF)',
        myInterest: '1 Unit'
      },
      {
        id: 'phone-g3',
        title: 'OnePlus 12 Deal',
        status: 'closing',
        brand: 'OnePlus',
        location: 'Bengaluru, KA',
        slogan: 'OnePlus 12 group deal. Limited slots! Hurry up and join now to lock final group price.',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=150&q=80',
        spotsJoined: 281,
        spotsTotal: 350,
        creatorName: 'Aman Verma',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#OnePlus12', '#Flagship', '#Deal'],
        badgeType: 'new',
        badgeLabel: 'NEW',
        daysLeft: '69 more needed',
        targetPrice: 'Under ₹55,000',
        bestOffer: '₹51,999 (6% OFF)',
        myInterest: '1 Unit'
      }
    ],
    laptops: [
      {
        id: 'laptop-g1',
        title: 'MacBook Air M3 Deal',
        status: 'active',
        brand: 'Apple',
        location: 'Mumbai, MH',
        slogan: 'Planning to buy MacBook Air M3. Join to get maximum discount with students benefit.',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80',
        spotsJoined: 119,
        spotsTotal: 200,
        creatorName: 'Kunal Singh',
        creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#MacBookM3', '#Apple', '#Indore'],
        badgeType: 'hot',
        badgeLabel: 'HOT',
        daysLeft: '81 more needed',
        targetPrice: 'Under ₹95,000',
        bestOffer: '₹88,900 (7% OFF)',
        myInterest: '1 Unit'
      }
    ],
    appliances: [
      {
        id: 'appliance-g1',
        title: 'Samsung Washer Deal',
        status: 'active',
        brand: 'Samsung',
        location: 'Indore, MP',
        slogan: "Let's buy Samsung Washer in bulk and save up to ₹5,000.",
        image: 'https://images.unsplash.com/photo-1610557892470-76d74cd120a8?auto=format&fit=crop&w=150&q=80',
        spotsJoined: 158,
        spotsTotal: 300,
        creatorName: 'Siddharth Yadav',
        creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#Samsung', '#HomeHub', '#Indore'],
        badgeType: 'rising',
        badgeLabel: 'RISING',
        daysLeft: '142 more needed',
        targetPrice: 'Under ₹25,000',
        bestOffer: '₹23,200 (7% OFF)',
        myInterest: '2 Units'
      }
    ],
    electronics: [
      {
        id: 'elect-g1',
        title: 'Sony WH-1000XM5 Deal',
        status: 'active',
        brand: 'Sony',
        location: 'Delhi, DL',
        slogan: 'Secure minimum pricing on trending active noise cancellation WH-1000XM5 headsets.',
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=150&q=80',
        spotsJoined: 281,
        spotsTotal: 350,
        creatorName: 'Aman Verma',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#Sony', '#ANC', '#Audio'],
        badgeType: 'new',
        badgeLabel: 'NEW',
        daysLeft: '69 more needed',
        targetPrice: 'Under ₹30,000',
        bestOffer: '₹26,999 (10% OFF)',
        myInterest: '1 Unit'
      }
    ],
    fashion: [],
    'home-living': []
  };

  // 4. DYNAMIC FILTER AND SORT LOGIC
  const activeProducts = useMemo(() => {
    const list = productsData[selectedCategory] || [];
    
    // Subcategory brand filter
    return list.filter((p) => {
      if (selectedSub === 'all') return true;
      return p.brand.toLowerCase() === selectedSub.toLowerCase();
    });
  }, [selectedCategory, selectedSub]);

  const currentMeta = categoryMeta[selectedCategory] || {
    title: 'Products',
    groups: 0,
    buyers: '0',
    desc: 'Explore active groups in this section.'
  };

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* 1. Custom Gorgeous Rounded Bottom Header */}
      <CategoryHeader
        categoryTitle={currentMeta.title}
        groupsCount={currentMeta.groups}
        buyersCount={currentMeta.buyers}
        description={currentMeta.desc}
      />

      {/* Dynamic Content Container */}
      <div className="flex flex-col gap-4 px-3.5 pb-24">
        {/* 2. My Categories carousel switcher */}
        <MyCategoriesCarousel
          selectedCategory={selectedCategory}
          onChange={(cat) => {
            setSelectedCategory(cat);
            setSelectedSub('all'); // Reset subcategory brand on main category change
          }}
        />

        {/* 3. Subcategories filters badges row */}
        <SubcategoriesCarousel
          selectedSub={selectedSub}
          onChange={setSelectedSub}
        />

        {/* 4. Active underline sorting headers row */}
        <SortTabs
          activeTab={activeSort}
          onChange={setActiveSort}
        />

        {/* 5. Custom Categories product cards row */}
        {activeProducts.length > 0 ? (
          <CategoryProductsList products={activeProducts} />
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 text-xs font-semibold shadow-sm my-2">
            No active group deals found under this filter. Create one below!
          </div>
        )}

        {/* 6. Can't find what you are looking for box row */}
        <BottomCTA />
      </div>
    </div>
  );
};

export default Categories;
