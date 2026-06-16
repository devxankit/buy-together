import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { registerWebPush, listenForegroundPush } from './services/push';

function App() {
  useEffect(() => {
    // Surface foreground push notifications, and (re)register this browser if a
    // session already exists (e.g. returning user with a stored token).
    listenForegroundPush();
    if (localStorage.getItem('token')) {
      registerWebPush();
    }
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
