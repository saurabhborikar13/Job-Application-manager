import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  // 1. Get the token from browser storage
  const token = localStorage.getItem('token');

  // Fetch jobs when component loads
  useEffect(() => {
    if (!token) {
      navigate('/register'); // Redirect if not logged in
    } else {
      fetchJobs();
    }
  }, [token, navigate]);

  const fetchJobs = async () => {
    try {
      // 2. Attach the token to the request "Header"
      const res = await axios.get('https://job-appliaction-manager.onrender.com/api/Job', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(res.data);
    } catch (error) {
      console.error(error);
      // If token is expired (401), force logout
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/register');
      }
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        // 3. Attach token here too!
        await axios.delete(`https://job-appliaction-manager.onrender.com/api/Job/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchJobs(); // Refresh list immediately
      } catch (error) {
        console.error(error);
        alert('Failed to delete job');
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header: Title + New Button */}
      <div className="header-section">
        <h2>Applications History</h2>
        <Link to="/add-job" className="btn btn-primary">+ New</Link>
      </div>

      {/* The Notion-Style Table */}
      <div className="table-wrapper">
        <table className="job-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>🏢 Company</th>
              <th style={{ width: '20%' }}>💼 Position</th>
              <th style={{ width: '15%' }}>📍 Location</th>
              <th style={{ width: '15%' }}>📊 Status</th>
              <th style={{ width: '15%' }}>📅 Date</th>
              <th style={{ width: '10%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  No jobs found. Click "+ New" to add one!
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job._id}>
                  {/* Company Name with Icon */}
                  <td className="company-cell">
                     <span className="icon">📄</span> 
                     {job.company}
                  </td>
                  
                  {/* Position */}
                  <td>{job.position}</td>
                  
                  {/* Location */}
                  <td className="text-muted">{job.jobLocation}</td>
                  
                  {/* Status Pills */}
                  <td>
                    <span className={`status-tag ${job.status}`}>
                      {job.status}
                    </span>
                  </td>
                  
                  {/* Date */}
                  <td className="text-muted">
                      {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  
                  {/* Links / Actions */}
                  <td>
                    {job.resumeLink && (
                      <a href={job.resumeLink} target="_blank" className="link-text" rel="noreferrer">
                        Link ↗
                      </a>
                    )}
                    <button onClick={() => deleteJob(job._id)} className="btn-icon">🗑</button>
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