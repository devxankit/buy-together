import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

const Layout = () => (
  <div style={{ minHeight: '100vh', minHeight: '100dvh', background: '#F6F6F8' }}>
    <Navbar />
    {/* bottom offset = nav content (~72px) + iOS home bar */}
    <main style={{ paddingBottom: 'calc(72px + max(16px, env(safe-area-inset-bottom, 0px)))' }}>
      <Outlet />
    </main>
    <BottomNav />
  </div>
);

export default Layout;
