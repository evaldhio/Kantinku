import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { menu, orders } from '../utils/api';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMenus: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const [menuRes, ordersRes] = await Promise.all([
        menu.getAll(),
        orders.getAll(),
      ]);

      const ordersList = ordersRes.data;
      
      setStats({
        totalMenus: menuRes.data.length,
        totalOrders: ordersList.length,
        pendingOrders: ordersList.filter(o => o.status === 'pending').length,
        completedOrders: ordersList.filter(o => o.status === 'completed').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container dashboard">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <div>
          {user.role === 'admin' && (
            <button 
              onClick={() => navigate('/menu/new')} 
              className="btn btn-primary"
              style={{width: 'auto', padding: '10px 20px'}}
            >
              Add New Menu
            </button>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Menu Items</h3>
          <p>{stats.totalMenus}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>{stats.pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Orders</h3>
          <p>{stats.completedOrders}</p>
        </div>
      </div>

      <div style={{marginTop: '30px'}}>
        <h2>Quick Actions</h2>
        <div style={{display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap'}}>
          <button 
            onClick={() => navigate('/menu')} 
            className="btn btn-primary"
            style={{width: 'auto', padding: '12px 24px'}}
          >
            Browse Menu
          </button>
          {user.role === 'admin' ? (
            <button 
              onClick={() => navigate('/orders')} 
              className="btn btn-success"
              style={{width: 'auto', padding: '12px 24px'}}
            >
              View All Orders
            </button>
          ) : (
            <button 
              onClick={() => navigate('/my-orders')} 
              className="btn btn-success"
              style={{width: 'auto', padding: '12px 24px'}}
            >
              My Orders
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;