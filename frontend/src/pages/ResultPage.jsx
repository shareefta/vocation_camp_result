import React, { useState, useRef } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { Search, Loader2, CheckCircle2, XCircle, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResultPage = () => {
  const [regNo, setRegNo] = useState('');
  const [dob, setDob] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('check-result/', { reg_no: regNo, dob });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Results not yet published or invalid details.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, {
        scale: 3, // Higher scale for better quality on A5
        backgroundColor: '#ffffff',
        useCORS: true // for logos
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a5');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate aspect ratio to fit on A5
    const imgProps = pdf.getImageProperties(imgData);
    const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
    const finalWidth = imgProps.width * ratio;
    const finalHeight = imgProps.height * ratio;
    
    // Center it
    const x = (pdfWidth - finalWidth) / 2;
    const y = 10;
    
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
    pdf.save(`Result_${result.reg_no}.pdf`);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="result-container container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="search-card glass"
        >
          <div className="card-header">
            <h2>{result ? "Exam Result" : "Student Result Search"}</h2>
            {!result && <p>Access your vocational training camp performance record.</p>}
          </div>

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.form 
                key="search-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSearch} 
                className="search-form"
              >
                <div className="input-group">
                  <label>Registration Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CAMP001" 
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Date of Birth</label>
                  <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-secondary" disabled={loading}>
                  {loading ? <Loader2 className="spinner" /> : <><Search size={18} /> Get Result</>}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="result-display"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="result-wrapper"
              >
                {/* This div is what gets captured for PDF */}
                <div className="result-display-printable" ref={resultRef} style={{ background: 'white', padding: '20px' }}>
                    <div className="printable-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div className="header-logos" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
                            <img src="/static/logo1.jpg" alt="" style={{ height: '50px' }} />
                            <img src="/static/logo2.png" alt="" style={{ height: '50px' }} />
                        </div>
                        <p style={{ color: '#666', fontSize: '1rem', fontWeight: '700', margin: '5px 0 0' }}>OFFICIAL PERFORMANCE RECORD</p>
                    </div>

                    <div className={`result-display-card ${result.result.toLowerCase()}`} style={{ border: '2px solid #eee', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
                        <div className="result-icon">
                        {result.result === 'Pass' ? <CheckCircle2 size={50} color="#27ae60" /> : <XCircle size={50} color="#e74c3c" />}
                        </div>
                        <div className="student-info" style={{ marginTop: '10px' }}>
                        <h3 style={{ fontSize: '1.6rem', margin: '0' }}>{result.name}</h3>
                        <p className="reg-val">Reg No: {result.reg_no}</p>
                        </div>
                        <div className="result-badge-pdf" style={{ 
                            fontSize: '2rem', fontWeight: '900', display: 'inline-block',
                            padding: '5px 30px', borderRadius: '30px', margin: '15px 0',
                            backgroundColor: result.result === 'Pass' ? '#d4f8e3' : '#fdeaea',
                            color: result.result === 'Pass' ? '#27ae60' : '#e74c3c'
                        }}>
                            {result.result === 'Pass' ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                        </div>
                        <div className="result-notice" style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic', maxWidth: '350px', margin: '0 auto', lineHeight: '1.4' }}>
                        {result.result === 'Pass' ? 
                            <>
                                Please contact the office on or before 16-04-2026 for admission procedures. <br />
                                <span style={{ fontStyle: 'normal', display: 'block', marginTop: '5px' }}>
                                    അഡ്മിഷൻ നടപടികൾക്കായി 16-04-2026-നോ അതിനുമുമ്പോ ഓഫീസുമായി ബന്ധപ്പെടുക.
                                </span>
                            </> : 
                            "Every expert was once a beginner. Don't let this result define your future—your hard work will eventually pay off!"}
                        </div>
                        <div className="print-footer" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '0.7rem', color: '#999' }}>
                            Certificate issued on {new Date().toLocaleDateString()} • Camp Authority
                        </div>
                    </div>
                </div>
                
                <div className="result-actions">
                    <button onClick={downloadPDF} className="btn-primary">
                        <Download size={18} /> Download
                    </button>
                    <button 
                        onClick={() => { setResult(null); setRegNo(''); setDob(''); }} 
                        className="btn-outline-dark"
                    >
                        Check Another Result
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && <div className="message error animate-fade-in"><XCircle size={18} /> {error}</div>}
        </motion.div>
      </main>

      <style>{`
        .page-wrapper {
          min-height: 100vh;
          background: linear-gradient(180deg, #fdfbf7 0%, #f4f7f2 100%);
          padding-top: 100px;
          padding-bottom: 40px;
        }
        .result-container { display: flex; justify-content: center; }
        .search-card {
          width: 100%;
          max-width: 600px;
          padding: 30px 40px;
          border-radius: 25px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
          text-align: center;
        }
        .header-logos { display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; }
        .header-logos img { height: 40px; width: auto; object-fit: contain; }
        .card-header h2 { font-size: 1.8rem; font-weight: 700; color: var(--primary); margin-bottom: 5px; }
        .card-header p { color: var(--text-light); font-size: 0.95rem; margin-bottom: 25px; }
        
        .search-form { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; }
        .search-form .btn-secondary { grid-column: span 2; padding: 15px; font-size: 1.1rem; }
        .input-group label { font-size: 0.9rem; font-weight: 600; color: var(--primary); margin-bottom: 8px; display: block; }

        .result-wrapper { margin-top: 20px; }
        .result-display-card {
          padding: 30px;
          border-radius: 20px;
          background: #fff;
          border: 1px solid #eee;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .result-display-card .student-info h3 { font-size: 1.6rem; color: var(--primary); margin: 0; }
        .reg-val { font-size: 0.9rem; color: var(--text-light); }
        .result-badge {
          font-size: 2.2rem;
          font-weight: 900;
          padding: 8px 35px;
          border-radius: 50px;
        }
        .pass .result-badge-pdf { background: #d4f8e3; color: #27ae60; }
        .fail .result-badge-pdf { background: #fdeaea; color: #e74c3c; }
        .result-notice { font-size: 0.9rem; color: var(--text-light); font-style: italic; }
        .print-footer { margin-top: 15px; font-size: 0.75rem; color: #ccc; }

        .result-actions { display: flex; flex-direction: column; gap: 12px; margin-top: 25px; }
        .result-actions button { padding: 12px; border-radius: 12px; font-weight: 600; font-size: 1rem; }
        .btn-outline-dark { border: 1px solid #ddd; background: transparent; color: var(--text); }

        @media (max-width: 600px) {
          .page-wrapper { padding-top: 80px; }
          .search-form { grid-template-columns: 1fr; gap: 15px; }
          .search-form .btn-secondary { grid-column: span 1; padding: 12px; font-size: 1rem; }
          .search-card { padding: 20px 15px; border-radius: 20px; }
          .card-header h2 { font-size: 1.5rem; }
          .input-group input { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ResultPage;
