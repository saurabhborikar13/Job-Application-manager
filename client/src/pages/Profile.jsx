import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Core Data (Matches your User.js)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // 2. Dynamic Data (Matches your User.js customFields)
  const [customFields, setCustomFields] = useState([]);

  // 3. FETCH DATA FROM MONGODB
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('https://job-appliaction-manager.onrender.com/api/auth/getUser', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Populate state with DB data
        setFormData({
          name: data.user.name,
          email: data.user.email
        });
        // If user has saved fields, load them. Else start with an empty array.
        setCustomFields(data.user.customFields || []);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  // Handle Core Inputs (Name/Email)
  const handleCoreChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Dynamic Inputs (Label/Value)
  const handleCustomChange = (index, e) => {
    const list = [...customFields];
    list[index][e.target.name] = e.target.value;
    setCustomFields(list);
  };

  // Add a new empty row
  const addField = () => {
    setCustomFields([...customFields, { label: '', value: '' }]);
  };

  // Remove a row
  const removeField = (index) => {
    const list = [...customFields];
    list.splice(index, 1);
    setCustomFields(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send structure strictly matching User.js Schema
      const payload = {
        name: formData.name,
        email: formData.email,
        customFields: customFields // The array of objects {label, value}
      };

      const { data } = await axios.patch(
        'https://job-appliaction-manager.onrender.com/api/auth/updateUser', 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem('user', data.user.name);
      alert('Profile Saved Successfully! ✅');
      navigate('/'); 
    } catch (error) {
      console.error(error);
      alert('Error updating profile');
    }
  };

  if (isLoading) return <div className="dashboard-container"><h2>Loading...</h2></div>;

  return (
    <div className="form-container">
      <h2>👤 Dynamic Profile</h2>
      <p style={{color: '#888', marginBottom: '20px'}}>Add any info you need for applications (LinkedIn, Bio, etc).</p>
      
      <form onSubmit={handleSubmit} className="job-form">
        
        {/* Core Fields */}
        <h3>Basic Info</h3>
        <div className="form-row">
          <input 
            type="text" name="name" placeholder="Name" 
            value={formData.name} onChange={handleCoreChange} required 
          />
          <input 
            type="email" name="email" placeholder="Email" 
            value={formData.email} onChange={handleCoreChange} required 
          />
        </div>

        {/* Dynamic Fields Section */}
        <h3 style={{marginTop: '20px'}}>Custom Application Details</h3>
        
        {customFields.map((field, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            {/* LABEL Input (e.g. "LinkedIn") */}
            <input 
              type="text" 
              name="label" 
              placeholder="Label (e.g. LinkedIn)" 
              value={field.label} 
              onChange={(e) => handleCustomChange(index, e)}
              style={{ width: '35%', background: '#333' }} 
            />
            
            {/* VALUE Input (e.g. "linkedin.com/in/me") */}
            <input 
              type="text" 
              name="value" 
              placeholder="Value" 
              value={field.value} 
              onChange={(e) => handleCustomChange(index, e)}
              style={{ flex: 1 }} 
            />

            {/* Remove Button */}
            <button type="button" onClick={() => removeField(index)} className="btn" style={{background: '#ef4444', padding: '0 15px'}}>
              ✕
            </button>
          </div>
        ))}

        <button type="button" onClick={addField} className="btn" style={{background: '#333', width: '100%', marginBottom: '20px', border:'1px dashed #666'}}>
          + Add New Field
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
             <button type="button" onClick={() => navigate('/')} className="btn" style={{background: '#333'}}>Cancel</button>
             <button type="submit" className="btn btn-primary" style={{flex: 1}}>
                Save Profile
             </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;