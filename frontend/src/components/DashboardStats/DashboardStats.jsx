import { useEffect, useState } from 'react';
import { fetchUserStats } from '../../api/userApi';
import './DashboardStats.css';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchUserStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="stat-card skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-value"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="stats-grid animate-slide-up">
      <div className="stat-card stat-total">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <h3 className="stat-title">Total Users</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
      </div>
      <div className="stat-card stat-active">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <h3 className="stat-title">Active Users</h3>
          <p className="stat-value">{stats.active}</p>
        </div>
      </div>
      <div className="stat-card stat-inactive">
        <div className="stat-icon">⏸️</div>
        <div className="stat-content">
          <h3 className="stat-title">Inactive Users</h3>
          <p className="stat-value">{stats.inactive}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
