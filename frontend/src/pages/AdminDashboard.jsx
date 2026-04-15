import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Users, Image as ImageIcon, Settings, LogOut, 
  Plus, Upload, Trash2, Edit, Save, X, Download,
  Search as SearchIcon, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [images, setImages] = useState([]);
  const [config, setConfig] = useState({ result_publish_at: '', is_published: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'students') {
        const res = await api.get('students/');
        setStudents(res.data);
      } else if (activeTab === 'images') {
        const res = await api.get('hero-images/');
        setImages(res.data);
      } else if (activeTab === 'settings') {
        const res = await api.get('config/');
        if (res.data) setConfig(res.data);
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="sidebar-header">
          <div className="logo">Camp Admin</div>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <Users size={20} /> Students
          </button>
          <button 
            className={`nav-item ${activeTab === 'images' ? 'active' : ''}`}
            onClick={() => setActiveTab('images')}
          >
            <ImageIcon size={20} /> Hero Images
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content">
        <header className="content-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
          <div className="user-info">Admin Account</div>
        </header>

        <section className="tab-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'students' && <StudentManager students={students} refresh={fetchData} />}
              {activeTab === 'images' && <ImageManager images={images} refresh={fetchData} />}
              {activeTab === 'settings' && <SettingsManager config={config} refresh={fetchData} />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f0f4f8;
        }
        .sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 30px 15px;
          border-right: 1px solid rgba(0,0,0,0.05);
          z-index: 100;
        }
        .sidebar-header { margin-bottom: 50px; text-align: center; }
        .logo { font-size: 1.5rem; font-weight: 800; color: var(--primary); }
        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          text-align: left;
          border-radius: 12px;
          font-weight: 600;
          color: var(--text-light);
          background: transparent;
        }
        .nav-item:hover { background: rgba(0,0,0,0.05); color: var(--primary); }
        .nav-item.active { background: var(--primary); color: white; }
        .nav-item.logout { margin-top: auto; color: #e74c3c; }
        .nav-item.logout:hover { background: #feeaea; }
        
        .content { margin-left: 260px; flex: 1; padding: 40px; }
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .tab-content { background: white; border-radius: 20px; padding: 30px; box-shadow: var(--shadow); }
        
        /* Utility styles for managers */
        .manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .actions { display: flex; gap: 10px; }
        .btn-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 10px; }
        .table-container { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { text-align: left; padding: 15px; border-bottom: 2px solid #f0f0f0; color: var(--text-light); font-weight: 600; }
        td { padding: 15px; border-bottom: 1px solid #f0f0f0; }
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
        .badge-pass { background: #d4f8e3; color: #27ae60; }
        .badge-fail { background: #fdeaea; color: #e74c3c; }
      `}</style>
    </div>
  );
};

/* Sub-components (could be in separate files for larger projects) */

const StudentManager = ({ students, refresh }) => {
  const [showImport, setShowImport] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    reg_no: '',
    name: '',
    dob: '',
    result: 'Pass'
  });

  // Filter students based on search query
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.reg_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Student Records - Camp 2026", 14, 15);
    
    const tableColumn = ["Reg. No.", "Name", "Date of Birth", "Result"];
    const tableRows = filteredStudents.map(s => [
      s.reg_no,
      s.name,
      s.dob,
      s.result === 'Pass' ? 'PASSED' : 'NEEDS IMPROVEMENT'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [45, 90, 39] } // Custom primary color
    });

    doc.save(`Students_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleExportExcel = () => {
    const data = filteredStudents.map(s => ({
      "Registration Number": s.reg_no,
      "Full Name": s.name,
      "Date of Birth": s.dob,
      "Result Status": s.result === 'Pass' ? 'PASSED' : 'NEEDS IMPROVEMENT'
    }));

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Students");
    writeFile(workbook, `Students_Data_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('bulk-upload/', formData);
      alert("Students imported successfully!");
      setShowImport(false);
      refresh();
    } catch (err) {
      console.error("Import Error:", err);
      const msg = err.response?.data?.error || err.response?.data?.detail || "Ensure Excel format is correct and you are logged in.";
      alert(`Error: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      if (editingId) {
        await api.patch(`students/${editingId}/`, formData);
      } else {
        await api.post('students/', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ reg_no: '', name: '', dob: '', result: 'Pass' });
      refresh();
    } catch (err) {
      alert("Error saving student record.");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      reg_no: student.reg_no,
      name: student.name,
      dob: student.dob,
      result: student.result
    });
    setShowForm(true);
    setShowImport(false);
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student record?")) return;
    try {
      await api.delete(`students/${id}/`);
      refresh();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="manager-header" style={{ marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h3>Student Records ({filteredStudents.length})</h3>
          <div className="search-bar" style={{ position: 'relative', marginTop: '10px' }}>
            <SearchIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
               type="text" 
               placeholder="Search by name or registration number..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               style={{ paddingLeft: '40px', width: '100%', borderRadius: '10px', fontSize: '0.9rem' }}
            />
          </div>
        </div>
        <div className="actions" style={{ marginLeft: 'auto' }}>
          <button className="btn-secondary" onClick={handleExportExcel} title="Export Filtered List to Excel">
            <Download size={18} /> Excel
          </button>
          <button className="btn-secondary" onClick={handleExportPDF} title="Export Filtered List to PDF">
            <FileText size={18} /> PDF
          </button>
          <button className="btn-secondary" onClick={() => { setShowImport(!showImport); setShowForm(false); }}>
            <Upload size={18} /> Import
          </button>
          <button className="btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ reg_no: '', name: '', dob: '', result: 'Pass' }); setShowImport(false); }}>
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      {showImport && (
        <div className="import-box glass" style={{ padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
          <h4>Import from Excel</h4>
          <p>Columns: RegNo, Name, DOB (DD-MM-YYYY), Result (Pass/Fail)</p>
          <form onSubmit={handleImport} style={{ marginTop: '15px', display: 'flex', gap: '15px' }}>
            <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} required />
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading ? "Uploading..." : "Start Import"}
            </button>
            <button type="button" onClick={() => setShowImport(false)}>Cancel</button>
          </form>
        </div>
      )}

      {showForm && (
        <div className="form-box glass" style={{ padding: '20px', border: '1px solid var(--primary)', borderRadius: '15px', marginBottom: '20px', textAlign: 'left' }}>
          <h4>{editingId ? "Edit Student" : "Add New Student"}</h4>
          <form onSubmit={handleSaveStudent} style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="input-group">
                <label>Reg No</label>
                <input type="text" placeholder="Registration No" required value={formData.reg_no} onChange={(e) => setFormData({...formData, reg_no: e.target.value})} />
            </div>
            <div className="input-group">
                <label>Full Name</label>
                <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="input-group">
                <label>Date of Birth</label>
                <input type="date" required value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
            </div>
            <div className="input-group">
                <label>Result Status</label>
                <select value={formData.result} onChange={(e) => setFormData({...formData, result: e.target.value})} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }}>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? "Saving..." : editingId ? "Update Student" : "Create Student"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Reg. No.</th>
              <th>Name</th>
              <th>DOB</th>
              <th>Result</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(s => (
              <tr key={s.id}>
                <td>{s.reg_no}</td>
                <td>{s.name}</td>
                <td>{s.dob}</td>
                <td>
                  <span className={`badge ${s.result === 'Pass' ? 'badge-pass' : 'badge-fail'}`}>
                    {s.result === 'Pass' ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="btn-icon" onClick={() => startEdit(s)}>
                      <Edit size={16} color="var(--primary)" />
                    </button>
                    <button className="btn-icon" onClick={() => deleteStudent(s.id)}>
                      <Trash2 size={16} color="#e74c3c" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ImageManager = ({ images, refresh }) => {
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [editData, setEditData] = useState({ title: '', subtitle: '', image: null });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!editData.image && !editingImage) {
      alert("Please select an image file");
      return;
    }
    
    setUploading(true);
    const formData = new FormData();
    if (editData.image) formData.append('image', editData.image);
    formData.append('title', editData.title);
    formData.append('subtitle', editData.subtitle);
    
    try {
      if (editingImage) {
        await api.patch(`hero-images/${editingImage}/`, formData);
      } else {
        await api.post('hero-images/', formData);
      }
      setShowForm(false);
      setEditingImage(null);
      setEditData({ title: '', subtitle: '', image: null });
      refresh();
    } catch (err) { 
        console.error("Upload error:", err);
        alert("Failed to save hero image."); 
    }
    finally { setUploading(false); }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await api.delete(`hero-images/${id}/`);
      refresh();
    } catch (err) { console.error(err); }
  };

  const startEdit = (img) => {
    setEditingImage(img.id);
    setEditData({ title: img.title, subtitle: img.subtitle, image: null });
    setShowForm(true);
  };

  return (
    <div>
      <div className="manager-header">
        <h3>Landing Page Photos</h3>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditingImage(null); setEditData({ title: '', subtitle: '', image: null }); }}>
          <Plus size={18} /> Add Photo
        </button>
      </div>

      {showForm && (
        <div className="form-box glass" style={{ padding: '20px', border: '1px solid var(--primary)', borderRadius: '15px', marginBottom: '20px', textAlign: 'left' }}>
          <h4>{editingImage ? "Edit Image Details" : "Upload New Hero Image"}</h4>
          <form onSubmit={handleUpload} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {!editingImage && (
               <div className="input-group">
                 <label>Select Image File</label>
                 <input type="file" accept="image/*" required onChange={(e) => setEditData({...editData, image: e.target.files[0]})} />
               </div>
             )}
             <div className="input-group">
                <label>Title (Main Header)</label>
                <input 
                  type="text" placeholder="e.g. Welcome to Camp" 
                  value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} 
                />
             </div>
             <div className="input-group">
                <label>Subtitle (Description)</label>
                <textarea 
                  placeholder="e.g. Exploring nature together..." 
                  value={editData.subtitle} onChange={(e) => setEditData({...editData, subtitle: e.target.value})}
                  style={{ padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }}
                />
             </div>
             <div style={{ display: 'flex', gap: '10px' }}>
               <button type="submit" className="btn-primary" disabled={uploading}>
                 {uploading ? "Saving..." : editingImage ? "Save Changes" : "Upload Photo"}
               </button>
               <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
             </div>
          </form>
        </div>
      )}

      <div className="image-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {images.map(img => (
          <div key={img.id} className="image-card" style={{ position: 'relative', background: '#f9f9f9', borderRadius: '12px', padding: '10px' }}>
            <img src={img.image} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
            <div style={{ padding: '10px 0' }}>
               <strong style={{ display: 'block' }}>{img.title}</strong>
               <small style={{ color: '#666' }}>{img.subtitle}</small>
            </div>
            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '5px' }}>
              <button 
                className="btn-icon" 
                style={{ background: 'white' }}
                onClick={() => startEdit(img)}
              >
                <Edit size={16} color="var(--primary)" />
              </button>
              <button 
                className="btn-icon" 
                style={{ background: 'white' }}
                onClick={() => deleteImage(img.id)}
              >
                <Trash2 size={16} color="#e74c3c" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsManager = ({ config, refresh }) => {
  const [publishAt, setPublishAt] = useState(config.result_publish_at || '');
  const [isPublished, setIsPublished] = useState(config.is_published || false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config.result_publish_at) {
        // Format to YYYY-MM-DDThh:mm for datetime-local input
        setPublishAt(new Date(config.result_publish_at).toISOString().slice(0, 16));
        setIsPublished(config.is_published);
    }
  }, [config]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = config.id ? 'put' : 'post';
      const url = config.id ? `config/${config.id}/` : 'config/';
      await api[method](url, { result_publish_at: publishAt, is_published: isPublished });
      alert("Settings saved!");
      refresh();
    } catch (err) { alert("Failed to save settings"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <h3>Publishing Settings</h3>
      <form onSubmit={handleSave} style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <div className="input-group">
          <label>Results Publishing Time</label>
          <input 
            type="datetime-local" 
            value={publishAt}
            onChange={(e) => setPublishAt(e.target.value)}
            required
          />
        </div>
        <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '15px' }}>
          <input 
            type="checkbox" 
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            style={{ width: '20px', height: '20px' }}
          />
          <label htmlFor="isPublished">Publish Immediately (Overrides time)</label>
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Configuration"}
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
