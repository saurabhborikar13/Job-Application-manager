import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddJob = () => {
  const navigate = useNavigate();
  
  // Get token (Needed to prove who is adding the job)
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'pending',
    jobType: 'full-time',
    jobLocation: '',
    resumeLink: '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send Token in Headers
      await axios.post('https://job-appliaction-manager.onrender.com/api/Job', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/'); // Redirect to Dashboard after success
    } catch (error) {
      console.error(error);
      alert('Error adding job. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ marginBottom: '20px' }}>Add New Application</h2>
      <form onSubmit={handleSubmit} className="job-form">
        
        {/* Company & Position */}
        <div className="form-row">
          <input 
            type="text" name="company" placeholder="Company (e.g. Google)" 
            value={formData.company} onChange={handleChange} required 
          />
          <input 
            type="text" name="position" placeholder="Position (e.g. Frontend Intern)" 
            value={formData.position} onChange={handleChange} required 
          />
        </div>

        {/* Status & Type */}
        <div className="form-row">
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="declined">Declined</option>
          </select>

          <select name="jobType" value={formData.jobType} onChange={handleChange}>
            <option value="full-time">Full-Time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        {/* Location & Resume Link */}
        <div className="form-row">
           <input 
            type="text" name="jobLocation" placeholder="Location (e.g. Bangalore)" 
            value={formData.jobLocation} onChange={handleChange} required 
          />
          <input 
            type="text" name="resumeLink" placeholder="Resume Link (Google Drive/Notion)" 
            value={formData.resumeLink} onChange={handleChange} 
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button type="button" onClick={() => navigate('/')} className="btn" style={{backgroundColor: '#333', color: 'white'}}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Application</button>
        </div>
      </form>
    </div>
  );
};

export default AddJob;