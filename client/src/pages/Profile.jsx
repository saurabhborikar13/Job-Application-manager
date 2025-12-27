import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);

  // Core Data
  const [formData, setFormData] = useState({ name: '', email: '' });
  // Dynamic Data
  const [customFields, setCustomFields] = useState([]);

  // Fetch Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('https://job-appliaction-manager.onrender.com/api/auth/getUser', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({ name: data.user.name, email: data.user.email });
        setCustomFields(data.user.customFields || []);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  // Handlers
  const handleCoreChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleCustomChange = (index, e) => {
    const list = [...customFields];
    list[index][e.target.name] = e.target.value;
    setCustomFields(list);
  };

  const addField = () => setCustomFields([...customFields, { label: '', value: '' }]);
  
  const removeField = (index) => {
    const list = [...customFields];
    list.splice(index, 1);
    setCustomFields(list);
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert("✅ Copied!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, customFields };
      const { data } = await axios.patch(
        'https://job-appliaction-manager.onrender.com/api/auth/updateUser', 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('user', data.user.name);
      alert('Profile Saved Successfully! ✅');
      navigate('/'); 
    } catch (error) {
      alert('Error updating profile');
    }
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;

  return (
    <div className="container" style={{maxWidth: '800px', paddingBottom: '50px'}}>
      
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h2>👤 Application Kit</h2>
        <button onClick={handleSubmit} className="btn btn-primary" style={{padding: '10px 25px'}}>
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        


        {/* SECTION 2: DYNAMIC CARDS (The Sketch Layout) */}
        <h3 style={{marginBottom: '15px', color: '#a0a0a0'}}>My Saved Details</h3>
        
        <div className="cards-grid">
          {customFields.map((field, index) => (
            <div key={index} className="info-card">
              
              {/* Header: Label + Delete */}
              <div className="card-header">
                <input 
                  type="text" 
                  name="label" 
                  placeholder="Title (e.g. LinkedIn)" 
                  value={field.label} 
                  onChange={(e) => handleCustomChange(index, e)}
                  className="card-input-label"
                />
                <button type="button" onClick={() => removeField(index)} className="btn-icon" title="Remove">
                  ✕
                </button>
              </div>

              {/* Body: Value */}
              <textarea 
                name="value" 
                placeholder="Paste info here..." 
                value={field.value} 
                onChange={(e) => handleCustomChange(index, e)}
                className="card-input-value"
                rows="2"
              />

              {/* Footer: Copy Button */}
              <button 
                type="button" 
                onClick={() => copyToClipboard(field.value)} 
                className="btn-copy"
              >
                📋 Copy Info
              </button>

            </div>
          ))}

          {/* THE BIG ADD BUTTON */}
          <button type="button" onClick={addField} className="add-card-btn">
            <span style={{fontSize: '2rem'}}>+</span>
            <span>Add New Info</span>
          </button>

        </div>

      </form>
    </div>
  );
};

export default Profile;