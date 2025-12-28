import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Stats = () => {
  const [stats, setStats] = useState({});
  const [monthlyApplications, setMonthlyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get('https://job-appliaction-manager.onrender.com/api/Job/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data.defaultStats);
        setMonthlyApplications(data.monthlyApplications);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="container"><h2>Loading Stats...</h2></div>;

  // Helper for the top cards
  const statItem = (count, title, color, bg) => (
    <div style={{ 
      background: bg, 
      borderBottom: `5px solid ${color}`, 
      padding: '2rem', 
      borderRadius: '8px', 
      flex: 1,
      minWidth: '200px'
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '3rem', fontWeight: 'bold', color: color }}>{count}</span>
        <span style={{ background: color, color: 'white', padding: '5px 10px', borderRadius: '4px' }}>
          {/* Simple Icon placeholder */}
          📊
        </span>
      </header>
      <h5 style={{ margin: '10px 0 0 0', fontSize: '1.2rem', color: '#ccc', textTransform: 'capitalize' }}>{title}</h5>
    </div>
  );

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px' }}>Application Statistics</h2>

      {/* 1. TOP CARDS: Status Summary */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {statItem(stats.pending, 'Pending Applications', '#e9b949', '#fcefc720')}
        {statItem(stats.interview, 'Interviews Scheduled', '#647acb', '#e0e8f920')}
        {statItem(stats.declined, 'Jobs Declined', '#d66a6a', '#ffeeee20')}
        {statItem(stats.offer, 'Job Offers', '#22c55e', '#e6fffa20')}
      </div>

      {/* 2. CHART: Monthly Applications */}
      <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '8px', border: '1px solid #333', height: '400px' }}>
        <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Monthly Applications</h3>
        
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyApplications} margin={{ top: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#a0a0a0" />
            <YAxis allowDecimals={false} stroke="#a0a0a0" />
            <Tooltip contentStyle={{ background: '#333', border: 'none', color: '#fff' }} />
            <Bar dataKey="count" fill="#3b82f6" barSize={75} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Stats;