import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // 👈 Store User Info here
  const [searchTerm, setSearchTerm] = useState(""); 
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/register');
    } else {
      fetchData();
    }
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      // 1. Fetch Jobs
      const jobsRes = await axios.get('https://job-appliaction-manager.onrender.com/api/Job', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobsRes.data);

      // 2. Fetch User Profile (For the Quick Copy buttons)
      const userRes = await axios.get('https://job-appliaction-manager.onrender.com/api/auth/getUser', {
        headers: { Authorization: `Bearer ${token}` },
      });
      //  console.log("this point");
      setUserProfile(userRes.data.user);

    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/register');
      }
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        await axios.delete(`https://job-appliaction-manager.onrender.com/api/Job/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData(); // Refresh list
      } catch (error) {
        alert('Failed to delete job');
      }
    }
  };

  // 📋 Helper to Copy Text
  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    // Simple toast notification (using alert for now)
    // You can replace this with a nice "Copied!" tooltip later
    const button = document.getElementById(`btn-${label}`);
    if(button) {
       const originalText = button.innerText;
       button.innerText = "✅ Copied!";
       setTimeout(() => button.innerText = originalText, 1000);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.company.toLowerCase().includes(term) || 
      job.position.toLowerCase().includes(term) ||
      job.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="dashboard-container">
      
      {/* ⚡ NEW: Quick Application Kit (The "Fast Access" Bar) */}
      {userProfile && userProfile.customFields && userProfile.customFields.length > 0 && (
        <div style={{ marginBottom: '30px', background: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ Application Kit <span style={{fontSize: '0.8rem', opacity: 0.6}}>(Click to Copy)</span>
          </h3>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Always show Email if available */}
            <button 
              id="btn-email"
              onClick={() => copyToClipboard(userProfile.email, 'email')} 
              className="btn" 
              style={{ background: '#333', border: '1px solid #444', fontSize: '0.85rem' }}
            >
              ✉️ Email
            </button>

            {/* Loop through the Dynamic Custom Fields */}
            {userProfile.customFields.map((field, index) => (
              <button 
                key={index}
                id={`btn-${field.label}`}
                onClick={() => copyToClipboard(field.value, field.label)}
                className="btn"
                style={{ 
                  background: '#2563eb', // Blue background
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {field.label}
              </button>
            ))}
            
            {/* Link to Edit Profile */}
            <Link to="/profile" style={{ marginLeft: 'auto', color: '#666', fontSize: '0.8rem', textDecoration: 'underline' }}>
              Edit / Add More
            </Link>
          </div>
        </div>
      )}

      {/* Standard Header & Search */}
      <div className="header-section">
        <h2>Applications History</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Search jobs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #333',
              background: '#1e1e1e',
              color: 'white',
              width: '200px'
            }}
          />
          <Link to="/add-job" className="btn btn-primary">+ New</Link>
        </div>
      </div>

      {/* Job Table */}
      <div className="table-wrapper">
        <table className="job-table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>🏢 Company</th>
              <th style={{ width: '15%' }}>💼 Position</th>
              <th style={{ width: '15%' }}>📍 Location</th>
              <th style={{ width: '10%' }}>📊 Status</th>
              <th style={{ width: '15%' }}>📅 Date</th>
              <th style={{ width: '15%' }}>📅 Resume Used</th>
              <th style={{ width: '10%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  {searchTerm ? 'No matching jobs found.' : 'No jobs found. Click "+ New" to add one!'}
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job._id}>
                  <td className="company-cell"><span className="icon">📄</span> {job.company}</td>
                  <td>{job.position}</td>
                  <td className="text-muted">{job.jobLocation}</td>
                  <td><span className={`status-tag ${job.status}`}>{job.status}</span></td>
                  <td className="text-muted">{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td>
                    {job.resumeLink ? <a href={job.resumeLink} target="_blank" className="link-text" rel="noreferrer">View Resume ↗</a> : <span className="text-muted">—</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to={`/edit-job/${job._id}`} className="btn-icon" title="Edit">✏️</Link>
                      <button onClick={() => deleteJob(job._id)} className="btn-icon" title="Delete">🗑</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;