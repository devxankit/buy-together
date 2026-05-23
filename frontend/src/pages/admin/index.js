// Buy Together — Admin module public surface.
// Single import point so routing stays clean:  import { AdminLayout, Dashboard } from '../pages/admin';

export { default as AdminLayout } from './layout/AdminLayout';
export { default as AdminLogin } from './auth/AdminLogin';

export { default as Dashboard } from './pages/Dashboard';
export { default as Users }     from './pages/Users';
export { default as Groups }    from './pages/Groups';
export { default as Vendors }   from './pages/Vendors';
export { default as Deals }     from './pages/Deals';
export { default as Analytics } from './pages/Analytics';
export { default as Fraud }     from './pages/Fraud';
export { default as Revenue }   from './pages/Revenue';
export { default as Settings }  from './pages/Settings';
