import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Assign role based on email address
    let role = "Logger"; // Default role
    
    if (email === 'logger@gmail.com') {
      role = "Logger";
    } else if (email === 'resolver@gmail.com') {
      role = "Resolver";
    } else if (email === 'admin@gmail.com') {
      role = "Admin";
    }
    
    setUser({ email, role });
    sessionStorage.setItem('user', JSON.stringify({ email, role }));
    // Also set userData for compatibility with ProtectedRoute
    sessionStorage.setItem('userData', JSON.stringify({ ADID: email, role, token: 'dummy-token', allow_login: true }));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 