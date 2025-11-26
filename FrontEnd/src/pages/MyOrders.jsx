import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../components/OrderCard';
import { orders } from '../utils/api';

function MyOrders() {
  const navigate = useNavigate();
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'customer') {
      navigate('/dashboard');
      return;
    }
    fetchOrders();
  }, [navigate, user.role]);

  const fetchOrders = async () => {
    try {
      const response = await orders.getAll();
      setOrdersList(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
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
      <div className="page-header">
        <h1>My Orders</h1>
      </div>

      {ordersList.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
          <p>You haven't placed any orders yet</p>
          <button 
            onClick={() => navigate('/menu')} 
            className="btn btn-primary"
            style={{width: 'auto', padding: '10px 20px', marginTop: '20px'}}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div>
          {ordersList.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isAdmin={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;