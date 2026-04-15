import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="pb-32 md:pb-0 transition-all">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
