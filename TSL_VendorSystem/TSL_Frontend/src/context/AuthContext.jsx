import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tsl_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (_) {
      // ignore storage errors
    }
  }, []);

  const login = (email, _password) => {
    let role = 'Resolver';
    if (email === 'logger@gmail.com') role = 'Logger';
    else if (email === 'resolver@gmail.com') role = 'Resolver';
    else if (email === 'admin@gmail.com') role = 'Admin';
    else if (email === 'both@gmail.com') role = 'Logger+Resolver';

    const nextUser = { email, role };
    setUser(nextUser);
    try {
      localStorage.setItem('tsl_user', JSON.stringify(nextUser));
    } catch (_) {
      // ignore storage errors
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('tsl_user');
    } catch (_) {
      // ignore storage errors
    }
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};


