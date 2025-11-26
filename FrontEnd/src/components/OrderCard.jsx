function OrderCard({ order, isAdmin, onStatusChange }) {
  const statusColors = {
    pending: '#fff3cd',
    preparing: '#cce5ff',
    ready: '#d4edda',
    completed: '#d1ecf1',
    cancelled: '#f8d7da',
  };

  const statusTextColors = {
    pending: '#856404',
    preparing: '#004085',
    ready: '#155724',
    completed: '#0c5460',
    cancelled: '#721c24',
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.orderId}>Order #{order._id.slice(-6)}</div>
          <div style={styles.date}>
            {new Date(order.createdAt).toLocaleString('id-ID')}
          </div>
          {isAdmin && order.user && (
            <div style={styles.customer}>Customer: {order.user.name}</div>
          )}
        </div>
        <div style={{
          ...styles.status,
          background: statusColors[order.status],
          color: statusTextColors[order.status]
        }}>
          {order.status.toUpperCase()}
        </div>
      </div>
      
      <div style={styles.items}>
        {order.items.map((item, index) => (
          <div key={index} style={styles.item}>
            <span>{item.menu?.name || 'Menu not found'} x {item.quantity}</span>
            <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <div style={styles.notes}>
          <strong>Notes:</strong> {order.notes}
        </div>
      )}

      <div style={styles.total}>
        <strong>Total:</strong>
        <strong>Rp {order.totalPrice.toLocaleString()}</strong>
      </div>

      {isAdmin && order.status !== 'completed' && order.status !== 'cancelled' && (
        <div style={styles.actions}>
          {order.status === 'pending' && (
            <button 
              onClick={() => onStatusChange(order._id, 'preparing')}
              style={{...styles.btn, ...styles.btnPrimary}}
            >
              Start Preparing
            </button>
          )}
          {order.status === 'preparing' && (
            <button 
              onClick={() => onStatusChange(order._id, 'ready')}
              style={{...styles.btn, ...styles.btnSuccess}}
            >
              Mark as Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button 
              onClick={() => onStatusChange(order._id, 'completed')}
              style={{...styles.btn, ...styles.btnInfo}}
            >
              Complete Order
            </button>
          )}
          <button 
            onClick={() => onStatusChange(order._id, 'cancelled')}
            style={{...styles.btn, ...styles.btnDanger}}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#333',
  },
  date: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px',
  },
  customer: {
    fontSize: '14px',
    color: '#007bff',
    marginTop: '5px',
  },
  status: {
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  items: {
    marginBottom: '15px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  notes: {
    background: '#f8f9fa',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    fontSize: '14px',
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '18px',
    paddingTop: '15px',
    borderTop: '2px solid #333',
    marginBottom: '15px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  btn: {
    flex: 1,
    minWidth: '120px',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  btnPrimary: {
    background: '#007bff',
    color: 'white',
  },
  btnSuccess: {
    background: '#28a745',
    color: 'white',
  },
  btnInfo: {
    background: '#17a2b8',
    color: 'white',
  },
  btnDanger: {
    background: '#dc3545',
    color: 'white',
  },
};

export default OrderCard;