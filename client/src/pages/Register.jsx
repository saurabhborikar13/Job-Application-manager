import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  
  // Toggle between "Login" and "Register" mode
  const [isMember, setIsMember] = useState(true);
  
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = values;
    
    // Choose the right endpoint
    const endpoint = isMember ? 'login' : 'register';
    
    try {
      const { data } = await axios.post(
        `https://job-appliaction-manager.onrender.com/${endpoint}`, 
        isMember ? { email, password } : values
      );
      
      // Save the token in local storage (Browser Memory)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', data.user.name);
      
      alert(`Welcome ${data.user.name}! 🚀`);
      navigate('/'); // Go to Dashboard
      window.location.reload(); // Force refresh to update Navbar
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const toggleMember = () => {
    setIsMember(!isMember);
    setValues({ ...values, isMember: !isMember });
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE: The Form */}
      <div className="login-container">
        <div className="form-content">
          <h1 className="brand-logo">JobTracker 🚀</h1>
          <h2>{isMember ? 'Welcome Back!' : 'Create Account'}</h2>
          <p className="subtitle">
            {isMember 
              ? 'Enter your details to access your dashboard.' 
              : 'Start organizing your job search today.'}
          </p>

          <form onSubmit={onSubmit}>
            {!isMember && (
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" name="name" 
                  value={values.name} onChange={handleChange} 
                  required={!isMember}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" name="email" 
                value={values.email} onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" name="password" 
                value={values.password} onChange={handleChange} 
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              {isMember ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <p className="toggle-text">
            {isMember ? 'Not a member yet?' : 'Already have an account?'}
            <button type="button" onClick={toggleMember} className="btn-link">
              {isMember ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: The AI Image */}
      <div className="image-container">
        <div className="glass-overlay">
          <h3>Your Dream Job Awaits.</h3>
          <p>Track, Organize, Succeed.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;