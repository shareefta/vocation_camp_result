import React from 'react';
import { Mail, Globe, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content container">
        <div className="footer-info">
          <div className="footer-link-group">
            <Globe size={18} className="footer-icon" />
            <span>for more details - </span>
            <a href="https://www.masdar.in" target="_blank" rel="noopener noreferrer" className="highlight-link">
              www.masdar.in
            </a>
          </div>
        </div>
        
        <div className="footer-credit">
          <p>
            Developed by: <span className="dev-name">Webbyz Solutions</span>, Malappuram
          </p>
          <div className="footer-sub">
            Made with <Heart size={14} className="heart-icon" /> for Camp 2026 Learners
          </div>
        </div>
      </div>

      <style>{`
        .main-footer {
          background: #ffffff;
          padding: 40px 20px;
          border-top: 1px solid #eee;
          margin-top: auto;
          color: var(--text);
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 30px;
        }
        .footer-info {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .footer-link-group {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
          font-weight: 500;
        }
        .footer-icon {
          color: var(--primary);
        }
        .highlight-link {
          color: var(--secondary);
          text-decoration: none;
          font-weight: 700;
          transition: var(--transition);
          border-bottom: 2px solid transparent;
        }
        .highlight-link:hover {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        .footer-credit {
          text-align: right;
        }
        .footer-credit p {
          font-size: 1rem;
          margin-bottom: 5px;
          color: var(--text-light);
        }
        .dev-name {
          color: var(--primary);
          font-weight: 700;
        }
        .footer-sub {
          font-size: 0.85rem;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
        }
        .heart-icon {
          color: #e74c3c;
          fill: #e74c3c;
        }

        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            text-align: center;
            align-items: center;
            gap: 20px;
          }
          .footer-credit {
            text-align: center;
          }
          .footer-sub {
            justify-content: center;
          }
          .footer-link-group {
            font-size: 1rem;
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
