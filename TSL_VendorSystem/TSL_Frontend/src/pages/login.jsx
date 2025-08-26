import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);

    // Conditional redirection based on email
    if (email === 'logger@gmail.com') {
      navigate('/dashboard_logger', { replace: true });
    } else if (email === 'resolver@gmail.com') {
      navigate('/dashboard_resolver', { replace: true });
    } else if (email === 'admin@gmail.com') {
      navigate('/user-management', { replace: true });
    } else {
      // Default fallback
      navigate('/dashboard_resolver', { replace: true });
    }
  };

  return (
    <div className="screen overflow-hidden" style={{ background: '#ffffff' }}>
      <div className="flex justify-center items-start p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full" style={{ maxWidth: 420 }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-bold mb-1 text-black">E-mail Id:</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-bold mb-1 text-black">Password:</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-blue w-full py-2 font-semibold">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;