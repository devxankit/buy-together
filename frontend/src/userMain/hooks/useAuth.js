import { useState, useCallback } from 'react';

/**
 * Custom scalable hook managing authentication states and profile workflows.
 * Fully isolates session tokens, user structures, and async lifecycle triggers.
 */
export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('user_main_session');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (phone) => {
    setLoading(true);
    setError(null);
    try {
      // Mock API latency
      await new Promise(resolve => setTimeout(resolve, 800));
      // Setup mock user
      const mockUser = {
        id: 'usr-901',
        phone,
        name: 'Hritik',
        email: 'hritik@example.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
        joinedAt: new Date().toISOString()
      };
      setUser(mockUser);
      localStorage.setItem('user_main_session', JSON.stringify(mockUser));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Login failed. Please retry.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (otp) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      if (otp === '123456' || otp.length === 6) {
        return { success: true };
      }
      throw new Error('Invalid OTP code. Try again.');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user_main_session');
  }, []);

  return {
    user,
    loading,
    error,
    login,
    verifyOTP,
    logout,
    isAuthenticated: !!user
  };
};

export default useAuth;
