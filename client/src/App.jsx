import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'; // Added Navigate
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import Register from './pages/Register'; // Import Register
import './App.css';
import EditJob from './pages/EditJob';

function App() {
  // Check if user is logged in
  const user = localStorage.getItem('user');

  return (
    <BrowserRouter>
      {/* Only show Navbar if user is logged in */}
      {user && (
        <nav className="navbar">
          <div className="container nav-content">
             <div className="nav-left">
              <h1 className="logo">JobTracker 🚀</h1>
              <div className="nav-links">
                <Link to="/" className="nav-link">Dashboard</Link>
                <Link to="/add-job" className="nav-link">Add Job</Link>
              </div>
            </div>
            <div className="nav-right">
              <div className="profile-badge">
                <span className="profile-name">{user}</span>
                <div className="avatar">{user.charAt(0)}</div>
                {/* Logout Button */}
                <button 
                  onClick={() => { localStorage.clear(); window.location.reload(); }}
                  className="btn-icon" style={{marginLeft: '10px'}}
                >
                  🚪
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <div className={user ? "container page-content" : ""}>
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/register" />} />
          <Route path="/add-job" element={user ? <AddJob /> : <Navigate to="/register" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/edit-job/:id" element={user ? <EditJob /> : <Navigate to="/register" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;