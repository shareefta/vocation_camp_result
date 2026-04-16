import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const LandingPage = () => {
  const [heroes, setHeroes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const res = await api.get('hero-images/');
        setHeroes(res.data);
      } catch (err) {
        console.error("Failed to fetch hero images");
      }
    };
    fetchHeroes();
  }, []);

  useEffect(() => {
    if (heroes.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % heroes.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [heroes]);

  return (
    <div className="landing-wrapper">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-viewport">
        <AnimatePresence mode='wait'>
          {heroes.length > 0 ? (
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="hero-background"
              style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${heroes[currentIndex]?.image?.replace('http://', 'https://')})` 
              }}
            >
              <div className="hero-content">
                <motion.h1 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {heroes[currentIndex]?.title || "Camp 2026"}
                </motion.h1>
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {heroes[currentIndex]?.subtitle || "Unlock your potential at the Vocational Training Camp."}
                </motion.p>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="hero-buttons"
                >
                  <button onClick={() => navigate('/results')} className="btn-secondary pulse">
                     View My Result
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="hero-background default-bg" style={{ background: 'var(--primary)' }}>
               <div className="hero-content">
                  <h1>Welcome to Camp 2026</h1>
                  <p>Check your results using the link in the navbar.</p>
               </div>
            </div>
          )}
        </AnimatePresence>

        {/* Slide Indicators */}
        {heroes.length > 1 && (
          <div className="slider-dots">
            {heroes.map((_, idx) => (
              <div 
                key={idx} 
                className={`dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="welcome-section container">
        <div className="welcome-content">
          <div className="welcome-text">
            <h2>Welcome to Camp 2026</h2>
            <p>Our vocational training camp offers a unique blend of formal training and outdoor activities. We believe in learning by doing, and our stunning location provides the perfect backdrop for personal growth.</p>
            <ul className="camp-features">
              <li>✓ Professional Mentors</li>
              <li>✓ Nature Immersion</li>
              <li>✓ Advanced Skilling</li>
              <li>✓ Verified Certification</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .hero-viewport {
          height: calc(100vh - 115px);
          margin-top: 115px;
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #000;
        }
        .hero-background {
          height: 100%;
          width: 100%;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
        }
        .hero-content {
          text-align: center;
          color: white;
          max-width: 900px;
          padding: 0 40px;
          z-index: 2;
        }
        .hero-content h1 {
          font-size: 5rem;
          color: white;
          margin-bottom: 20px;
          font-weight: 800;
          letter-spacing: -2px;
          line-height: 1.1;
        }
        .hero-content p {
          font-size: 1.8rem;
          margin-bottom: 40px;
          opacity: 0.9;
          font-weight: 300;
        }
        .hero-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        
        .pulse {
          box-shadow: 0 0 0 0 rgba(230, 126, 34, 0.7);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(230, 126, 34, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(230, 126, 34, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(230, 126, 34, 0); }
        }

        .slider-dots {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
        }
        .dot {
          width: 12px;
          height: 12px;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          transition: var(--transition);
        }
        .dot.active { background: var(--secondary); border-color: var(--secondary); transform: scale(1.2); }

        .welcome-section { padding: 100px 20px; }
        .welcome-content { max-width: 800px; margin: 0 auto; text-align: center; }
        .welcome-text h2 { font-size: 2.8rem; margin-bottom: 20px; }
        .welcome-text p { font-size: 1.25rem; color: var(--text-light); margin-bottom: 30px; }
        .camp-features { list-style: none; display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
        .camp-features li { font-weight: 600; color: var(--primary); }

        @media (max-width: 768px) {
          .hero-viewport {
            height: 45vh;
            min-height: 300px;
          }
          .hero-background {
            background-size: cover;
            background-position: center;
          }
          .hero-content {
            padding: 20px;
            width: 90%;
          }
          .hero-content h1 {
            font-size: 2.2rem;
            margin-bottom: 10px;
          }
          .hero-content p {
            font-size: 1rem;
            margin-bottom: 20px;
          }
          .welcome-section { padding: 60px 20px; }
          .welcome-text h2 { font-size: 2rem; }
        }

        @media (max-width: 992px) {
          .welcome-text h2 { font-size: 2.2rem; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
