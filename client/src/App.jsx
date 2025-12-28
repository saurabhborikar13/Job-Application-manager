import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import Register from './pages/Register';
import EditJob from './pages/EditJob';
import Profile from './pages/Profile';
import './App.css';
import Stats from './pages/Stats';

function App() {
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [userEmail, setUserEmail] = useState(""); 
  const [showDropdown, setShowDropdown] = useState(false); 

  useEffect(() => {
    const fetchUserEmail = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await axios.get('https://job-appliaction-manager.onrender.com/api/auth/getUser', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserEmail(data.user.email);
          setUser(data.user.name);
        } catch (error) {
          console.error("Could not fetch user details");
        }
      }
    };
    fetchUserEmail();
  }, []);

  const logout = () => {
    localStorage.clear();
    setShowDropdown(false);
    setUser(null);
    window.location.href = "/register"; 
  };

  return (
    <BrowserRouter>
      {user && (
        <nav className="navbar" style={{ zIndex: 100 }}> {}
          <div className="container nav-content">
             <div className="nav-left">
              <h1 className="logo">JobSync</h1>
              <div className="nav-links">
                <Link to="/" className="nav-link">Dashboard</Link>
                {/* <Link to="/add-job" className="nav-link">Add Job</Link> */}
                <Link to="/profile" className="nav-link">Data</Link>
                <Link to="/stats" className="nav-link">Stats</Link>
              </div>
            </div>

            {/* RIGHT SIDE - PROFILE DROPDOWN */}
            <div className="nav-right">
              
              {/* Profile Badge (Added cursor: pointer here manually) */}
              <div 
                className="profile-badge" 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ cursor: 'pointer' }} 
              >
                <span className="profile-name">{user}</span>
                <div className="avatar">{user ? user.charAt(0).toUpperCase() : 'U'}</div>
                <span style={{fontSize: '0.8rem', marginLeft: '5px', opacity: 0.6}}>▼</span>
              </div>

              {/* The Dropdown Menu */}
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user}</strong>
                    <span className="user-email-display">{userEmail || "Loading..."}</span>
                  </div>

                  <button onClick={logout} className="dropdown-item logout">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
                    Logout
                  </button>
                </div>
              )}

            </div>
          </div>
        </nav>
      )}

      <div className={user ? "container page-content" : ""}>
        
        {}
        {showDropdown && (
          <div 
            style={{position: 'fixed', top:0, left:0, width:'100%', height:'100%', zIndex: 90}} 
            onClick={() => setShowDropdown(false)}
          ></div>
        )}

        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/register" />} />
          <Route path="/add-job" element={user ? <AddJob /> : <Navigate to="/register" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/edit-job/:id" element={user ? <EditJob /> : <Navigate to="/register" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/register" />} />
          <Route path="/stats" element={user ? <Stats /> : <Navigate to="/stats" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;