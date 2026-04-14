import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar glass">
      <div className="navbar-container container">
        {/* Left: Logos */}
        <div className="navbar-logos">
          <Link to="/">
            <img src="/static/logo1.jpg" alt="Logo 1" className="nav-logo" onError={(e) => { e.target.style.display = 'none'; }} />
            <img src="/static/logo2.png" alt="Logo 2" className="nav-logo" onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="logo-text">CAMP 2026</span>
          </Link>
        </div>

        {/* Center: Links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/results" className="nav-link">Result</Link>
        </div>

        {/* Right: Login Button */}
        <div className="navbar-actions">
          <button onClick={() => navigate('/login')} className="btn-login">
            <LogIn size={18} /> Admin Login
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          z-index: 1000;
          display: flex;
          align-items: center;
          background: var(--primary); /* Solid color for brand presence */
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          transition: var(--transition);
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
          height: 45px;
          width: auto;
          object-fit: contain;
          border-radius: 4px;
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
          gap: 40px;
        }
        .nav-link {
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          font-size: 1.05rem;
          position: relative;
          padding: 5px 0;
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
          .logo-text { display: none; }
          .btn-login { padding: 8px 12px; font-size: 0.8rem; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
