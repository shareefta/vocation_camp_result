import React, { useState, useRef } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { Search, Loader2, CheckCircle2, XCircle, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Footer from '../components/Footer';

const ResultPage = () => {
  const [regNo, setRegNo] = useState('');
  const [dob, setDob] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef(null);

  const RESULT_CONFIG = {
    'Pass': {
      header: "PASSED",
      color: "#27ae60",
      bg: "#d4f8e3",
      icon: <CheckCircle2 size={50} color="#27ae60" />,
      message: <strong>20-04-2026 തിങ്കളാഴ്ചക്ക് മുമ്പായി അഡ്മിഷൻ എടുക്കുക</strong>,
      footer: "അഡ്മിഷൻ വിവരങ്ങൾക്ക് 9744216001എന്ന നമ്പറിൽ വാട്സ്ആപ്പ് മെസ്സേജ് അയക്കുക."
    },
    'Pass - off Campus': {
      header: "PASSED",
      color: "#1976d2",
      bg: "#e3f2fd",
      icon: <CheckCircle2 size={50} color="#1976d2" />,
      message: <strong>മസ്‌‌ദറിൻ്റെ ഓഫ് ക്യാമ്പസ്സായ മർകസുൽ ഉലൂം വിളത്തൂർ എന്ന സ്ഥാപനത്തിലേക്കാണ് അഡ്മിഷൻ ലഭിച്ചിട്ടുള്ളത്</strong>,
      footer: "കൂടുതൽ വിവരങ്ങൾക്ക് 9744216001 എന്ന നമ്പറിൽ വാട്സ്ആപ്പ് മെസ്സേജ് അയക്കുക."
    },
    'Fail': {
      header: "FAILED",
      color: "#e74c3c",
      bg: "#fdeaea",
      icon: <XCircle size={50} color="#e74c3c" />,
      message: "തോൽവി വിജയത്തിലേക്കുള്ള ചവിട്ടുപടിയാണ്. ആത്മവിശ്വാസം കൈവിടാതെ പരിശ്രമിക്കുക.",
      footer: ""
    },
    'Soft Fail': {
      header: "FAILED",
      color: "#f57c00",
      bg: "#fff3e0",
      icon: <XCircle size={50} color="#f57c00" />,
      message: <strong>അഡ്മിഷൻ ലഭിച്ച 25 വിദ്യാർത്ഥികളിൽ ഉൾപ്പെട്ടിട്ടില്ല</strong>,
      footer: "കഴിവുള്ള വിദ്യാർത്ഥിയാണ്, മസ്‌‌ദർ \"വേര് \"സമ്മർ ക്യാമ്പ് അനുഭവങ്ങൾ വരാനിരിക്കുന്ന വലിയ വിജയങ്ങളിലേക്ക് ഒരു ചവിട്ടുപടിയാവട്ടെ."
    },
    'Deep Fail': {
      header: "FAILED",
      color: "#c62828",
      bg: "#ffebee",
      icon: <XCircle size={50} color="#c62828" />,
      message: <strong>വിദ്യാർത്ഥി മസ്‌‌ദറിൽ പഠിക്കാൻ താല്പര്യം ഇല്ലെന്ന് അറിയിച്ചു</strong>,
      footer: ""
    }
  };

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
                    <div className="header-logos" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                      <img src="/static/logo.png" alt="" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
                    </div>
                    <p style={{ color: '#666', fontSize: '1rem', fontWeight: '700', margin: '5px 0 0' }}>OFFICIAL PERFORMANCE RECORD</p>
                  </div>

                  <div className={`result-display-card`} style={{ border: '2px solid #eee', borderRadius: '15px', padding: '20px', textAlign: 'center' }}>
                    <div className="result-icon">
                      {RESULT_CONFIG[result.result]?.icon || <Search size={50} />}
                    </div>
                    <div className="student-info" style={{ marginTop: '10px' }}>
                      <h3 style={{ fontSize: '1.6rem', margin: '0' }}>{result.name}</h3>
                      <p className="reg-val">Reg No: {result.reg_no}</p>
                    </div>
                    <motion.div
                      className="result-badge-pdf"
                      animate={{
                        opacity: [1, 0.8, 1],
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          `0 0 0px ${RESULT_CONFIG[result.result]?.color}00`,
                          `0 0 20px ${RESULT_CONFIG[result.result]?.color}44`,
                          `0 0 0px ${RESULT_CONFIG[result.result]?.color}00`
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        fontSize: '2rem', fontWeight: '900', display: 'inline-block',
                        padding: '5px 40px', borderRadius: '40px', margin: '15px 0',
                        backgroundColor: RESULT_CONFIG[result.result]?.bg || '#f0f0f0',
                        color: RESULT_CONFIG[result.result]?.color || '#666',
                        border: `2px solid ${RESULT_CONFIG[result.result]?.color}22`
                      }}>
                      {RESULT_CONFIG[result.result]?.header || 'RESULT'}
                    </motion.div>
                    <div className="result-notice" style={{ fontSize: '1rem', color: '#333', maxWidth: '450px', margin: '0 auto', lineHeight: '1.6' }}>
                      <div style={{ marginBottom: '10px' }}>
                        {RESULT_CONFIG[result.result]?.message}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: '700' }}>
                        {RESULT_CONFIG[result.result]?.footer}
                      </div>
                    </div>
                    <div className="print-footer" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '0.7rem', color: '#999' }}>
                      Certificate issued on {new Date().toLocaleDateString('en-GB')} • Camp Authority
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

      <Footer />

      <style>{`
        .page-wrapper {
          min-height: 100vh;
          background: linear-gradient(180deg, #fdfbf7 0%, #f4f7f2 100%);
          padding-top: 110px;
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
