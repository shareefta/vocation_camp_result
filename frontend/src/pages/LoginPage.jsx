import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { LogIn, Phone, Lock, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('login/', { mobile_number: mobileNumber, password });
      localStorage.setItem('token', res.data.access);
      localStorage.setItem('refreshToken', res.data.refresh);
      navigate('/admin');
    } catch (err) {
      setError("Invalid mobile number or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card glass"
      >
        <div className="login-header">
          <div className="logo-circle">
            <LogIn size={32} color="white" />
          </div>
          <h2>Admin Login</h2>
          <p>Access the results management system</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label><Phone size={16} /> Mobile Number</label>
            <input 
              type="text" 
              placeholder="Enter your mobile number" 
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label><Lock size={16} /> Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <div className="error-message"><AlertCircle size={18} /> {error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 className="spinner" /> : "Sign In"}
          </button>
        </form>
        
        <div className="login-footer">
          <a href="/">← Back to Student Portal</a>
        </div>
      </motion.div>

      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          padding: 20px;
        }
        .login-card {
          width: 100%;
          max-width: 450px;
          padding: 50px 40px;
          border-radius: 30px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.2);
          text-align: center;
        }
        .login-header {
          margin-bottom: 40px;
        }
        .logo-circle {
          width: 70px;
          height: 70px;
          background: var(--secondary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 10px 20px rgba(230, 126, 34, 0.3);
        }
        .login-header h2 {
          color: var(--primary);
          font-size: 2rem;
          margin-bottom: 5px;
        }
        .login-header p {
          color: var(--text-light);
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: left;
        }
        .input-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--primary);
          font-size: 0.95rem;
        }
        .btn-primary {
          padding: 15px;
          font-size: 1.1rem;
          margin-top: 10px;
        }
        .error-message {
          background: #fee2e2;
          color: #b91c1c;
          padding: 12px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
        }
        .login-footer {
          margin-top: 30px;
        }
        .login-footer a {
          color: var(--primary);
          font-weight: 600;
          opacity: 0.8;
          transition: var(--transition);
        }
        .login-footer a:hover {
          opacity: 1;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
