import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditJob = () => {
  const { id } = useParams(); // Get the Job ID from the URL
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'pending',
    jobType: 'full-time',
    jobLocation: '',
    resumeLink: ''
  });

  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch the existing job details when page loads
  useEffect(() => {
    const getJob = async () => {
      try {
        const res = await axios.get(`https://job-appliaction-manager.onrender.com/api/Job/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Populate the form with data from backend
        setFormData({
          company: res.data.company,
          position: res.data.position,
          status: res.data.status,
          jobType: res.data.jobType,
          jobLocation: res.data.jobLocation,
          resumeLink: res.data.resumeLink || ''
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        alert('Error loading job details');
        navigate('/'); // Go back if error
      }
    };

    getJob();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Send the UPDATE (PATCH) request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`https://job-appliaction-manager.onrender.com/api/Job/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/'); // Redirect to Dashboard after success
    } catch (error) {
      console.error(error);
      alert('Error updating job. Please try again.');
    }
  };

  if (isLoading) return <div className="form-container"><h2>Loading...</h2></div>;

  return (
    <div className="form-container">
      <h2 style={{ marginBottom: '20px' }}>Edit Application</h2>
      <form onSubmit={handleSubmit} className="job-form">
        
        {/* Company & Position */}
        <div className="form-row">
          <input 
            type="text" name="company" placeholder="Company" 
            value={formData.company} onChange={handleChange} required 
          />
          <input 
            type="text" name="position" placeholder="Position" 
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
            type="text" name="jobLocation" placeholder="Location" 
            value={formData.jobLocation} onChange={handleChange} required 
          />
          <input 
            type="text" name="resumeLink" placeholder="Resume Link" 
            value={formData.resumeLink} onChange={handleChange} 
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button type="button" onClick={() => navigate('/')} className="btn" style={{backgroundColor: '#333', color: 'white'}}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;