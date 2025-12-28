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
      alert('Profile Saved Successfully!');
      navigate('/'); 
    } catch (error) {
      alert('Error updating profile');
    }
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;

  return (
    <div className="container" style={{maxWidth: '800px', paddingBottom: '50px'}}>
      
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="100 -1225 960 960" width="24px" fill="#e3e3e3"><path d="M480-120q-151 0-255.5-46.5T120-280v-400q0-66 105.5-113T480-840q149 0 254.5 47T840-680v400q0 67-104.5 113.5T480-120Zm0-479q89 0 179-25.5T760-679q-11-29-100.5-55T480-760q-91 0-178.5 25.5T200-679q14 30 101.5 55T480-599Zm0 199q42 0 81-4t74.5-11.5q35.5-7.5 67-18.5t57.5-25v-120q-26 14-57.5 25t-67 18.5Q600-528 561-524t-81 4q-42 0-82-4t-75.5-11.5Q287-543 256-554t-56-25v120q25 14 56 25t66.5 18.5Q358-408 398-404t82 4Zm0 200q46 0 93.5-7t87.5-18.5q40-11.5 67-26t32-29.5v-98q-26 14-57.5 25t-67 18.5Q600-328 561-324t-81 4q-42 0-82-4t-75.5-11.5Q287-343 256-354t-56-25v99q5 15 31.5 29t66.5 25.5q40 11.5 88 18.5t94 7Z"/></svg>
          Application Kit
        </h2>
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
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg> 
          
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