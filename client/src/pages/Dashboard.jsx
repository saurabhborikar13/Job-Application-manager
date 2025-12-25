import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
        await axios.delete(`https://job-appliaction-manager.onrender.com/api/Job/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchJobs();
      } catch (error) {
        console.error(error);
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
            {filteredJobs.length.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  No jobs found. Click "+ New" to add one!
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job._id}>
                  {/* 1. Company Name */}
                  <td className="company-cell">
                     <span className="icon">📄</span> 
                     {job.company}
                  </td>
                  
                  {/* 2. Position */}
                  <td>{job.position}</td>
                  
                  {/* 3. Location */}
                  <td className="text-muted">{job.jobLocation}</td>
                  
                  {/* 4. Status */}
                  <td>
                    <span className={`status-tag ${job.status}`}>
                      {job.status}
                    </span>
                  </td>
                  
                  {/* 5. Date */}
                  <td className="text-muted">
                      {new Date(job.createdAt).toLocaleDateString()}
                  </td>

                  {/* 6. Resume Used (New Column) */}
                  <td>
                    {job.resumeLink ? (
                      <a href={job.resumeLink} target="_blank" className="link-text" rel="noreferrer">
                        View Resume ↗
                      </a>
                    ) : (
                      <span className="text-muted" style={{fontSize: '0.85rem'}}>—</span>
                    )}
                  </td>
                  
                  {/* 7. Actions (Update & Delete) */}
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {/* Update Button - Links to an edit page */}
                      <Link to={`/edit-job/${job._id}`} className="btn-icon" title="Edit">
                        U
                      </Link>
                      
                      {/* Delete Button */}
                      <button onClick={() => deleteJob(job._id)} className="btn-icon" title="Delete">
                        D
                      </button>
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