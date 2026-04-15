import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Bell, Search, MessageCircle } from 'lucide-react';
import { useSelector } from '../../hooks/useSelector';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <nav className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-12">
        <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-1.5 md:gap-2">
          <ShoppingCart size={24} className="text-secondary" />
          <span className="text-secondary">Buy</span>
          <span className="text-primary">together</span>
        </Link>
        <div className="hidden lg:flex items-center gap-8 font-bold text-sm tracking-tight text-gray-400 uppercase">
          <Link to="/" className="text-primary font-black border-b-2 border-primary">Groups</Link>
          <Link to="/deals" className="hover:text-primary transition-colors">Deals</Link>
          <Link to="/vendors" className="hover:text-primary transition-colors">Vendors</Link>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Desktop Search */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-gray-50 rounded-full border border-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-48 transition-all"
            />
          </div>
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-2 md:gap-3">
            <button className="hidden sm:block p-2.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full relative transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link to="/profile" className="flex items-center gap-2 md:p-1.5 md:pr-4 rounded-full border border-orange-100 bg-orange-50/30 hover:bg-orange-50 transition-all font-bold text-sm text-gray-900">
              <div className="w-8 h-8 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs shadow-md shadow-orange-500/20">A</div>
              <span className="hidden md:block">{user?.name || 'Profile'}</span>
            </Link>
          </div>
        ) : (
          <Link to="/login" className="btn-primary py-1.5 px-6 text-xs md:text-sm">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
