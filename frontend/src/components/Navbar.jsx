import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar shadow-soft">
      <div className="navbar-container container">
        {/* Left: Logo */}
        <div className="navbar-logos">
          <Link to="/">
            <img src="/static/logo.png" alt="Logo" className="nav-logo" />
          </Link>
        </div>

        {/* Center: Links */}
        <div className="navbar-links">
          <motion.div
            animate={{ opacity: [1, 0.7, 1], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Link to="/results" className="nav-link result-nav-btn">Result</Link>
          </motion.div>
        </div>

        {/* Right: Login Button */}
        <div className="navbar-actions">
          <button onClick={() => navigate('/login')} className="btn-login">
            <LogIn size={18} /> <span className="login-text">Admin Login</span>
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 115px;
          z-index: 1000;
          display: flex;
          align-items: center;
          background: #fafafa; /* Premium Ivory background */
          box-shadow: 0 4px 15px rgba(0,0,0,0.04);
          transition: var(--transition);
          border-bottom: 1px solid #eeeeee;
        }
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .navbar-logos {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .navbar-logos a {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-logo {
          height: 100px; 
          width: auto;
          object-fit: contain;
        }
        .logo-text {
          font-weight: 800;
          font-size: 1.25rem;
          color: white;
          letter-spacing: -0.5px;
        }
        .navbar-links {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 60px;
        }
        .nav-link {
          font-weight: 600;
          color: var(--primary);
          font-size: 1.05rem;
          position: relative;
          padding: 5px 0;
          opacity: 0.9;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent); /* Gold accent for the links */
          transition: var(--transition);
        }
        .nav-link:hover {
          color: white;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .result-nav-btn {
          background: #ffffff;
          border: 2px solid var(--accent);
          padding: 8px 25px !important;
          border-radius: 30px;
          color: var(--primary) !important;
          box-shadow: 0 4px 12px rgba(241, 196, 15, 0.2);
          transition: all 0.3s ease;
        }
        .result-nav-btn:hover {
          background: var(--accent);
          color: var(--primary) !important;
          box-shadow: 0 0 25px rgba(241, 196, 15, 0.6);
          transform: translateY(-2px);
        }
        .result-nav-btn::after {
          display: none;
        }
        .btn-login {
          background: var(--secondary); /* Contrast button */
          color: white;
          padding: 10px 20px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.95rem;
        }
        .btn-login:hover {
          background: #d35400;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(230, 126, 34, 0.3);
        }
        @media (max-width: 768px) {
          .navbar-links { position: static; transform: none; gap: 15px; }
          .navbar-actions { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
