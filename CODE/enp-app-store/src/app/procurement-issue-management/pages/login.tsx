import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    
    // Conditional redirection based on email
    if (email === 'logger@gmail.com') {
      navigate('/procurement-issue-management/dashboard_logger', { replace: true });
    } else if (email === 'resolver@gmail.com') {
      navigate('/procurement-issue-management/dashboard_resolver', { replace: true });
    } else if (email === 'admin@gmail.com') {
      navigate('/procurement-issue-management/user-management', { replace: true });
    } else {
      // Default fallback
      navigate('/procurement-issue-management/dashboard_resolver', { replace: true });
    }
  };

  return (
    <div
      className="w-screen h-screen min-h-0 min-w-0 bg-white bg-cover bg-center relative overflow-hidden px-4 sm:px-6"
      style={{ backgroundImage: "url('/images/tata-bg.jpg')" }}
    >
      {/* Background Logo */}
      <img
  src="/EnP-AppStore/images/bg Logo.png"
  alt="Background Logo"
  className="absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-[20%] max-w-full max-h-full object-contain opacity-50 z-0 pointer-events-none"
/>


{/* Login Box - Shifted Vertically */}
<div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-[30%] bg-[#5CB3FF] bg-opacity-80 p-6 sm:p-8 rounded-2xl w-full max-w-sm sm:max-w-md shadow-xl z-10">
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label className="block text-lg font-bold text-black mb-1">E-mail Id:</label>
      <input
        type="email"
        className="w-full px-3 py-2 rounded bg-white bg-opacity-60 border-none outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>

    <div>
      <label className="block text-lg font-bold text-black mb-1">Password:</label>
      <input
        type="password"
        className="w-full px-3 py-2 rounded bg-white bg-opacity-60 border-none outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    <button
      type="submit"
      className="w-full bg-[#000C6D] text-white py-2 font-semibold rounded hover:bg-blue-900 transition"
    >
      Login
    </button>
  </form>
</div>

    </div>
  );
};

export default Login;
