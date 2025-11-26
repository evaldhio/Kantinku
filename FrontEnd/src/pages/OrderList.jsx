import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../components/OrderCard';
import { orders } from '../utils/api';

function OrderList() {
  const navigate = useNavigate();
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin') {
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orders.update(orderId, { status: newStatus });
      fetchOrders();
      alert('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const filteredOrders = filter === 'all' 
    ? ordersList 
    : ordersList.filter(order => order.status === filter);

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
        <h1>All Orders</h1>
      </div>

      <div style={{marginBottom: '20px'}}>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
          <p>No orders found</p>
        </div>
      ) : (
        <div>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isAdmin={true}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderList;