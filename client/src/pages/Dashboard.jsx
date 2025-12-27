import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/register');
    } else {
      fetchJobs();
    }
  }, [token, navigate]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('https://job-appliaction-manager.onrender.com/api/Job', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
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
        fetchJobs(); // Refresh list
      } catch (error) {
        alert('Failed to delete job');
      }
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