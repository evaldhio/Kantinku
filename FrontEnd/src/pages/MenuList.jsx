import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuCard from '../components/MenuCard';
import { menu, orders } from '../utils/api';

function MenuList() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderNotes, setOrderNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await menu.getAll();
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (menuItem) => {
    const existingItem = cart.find(item => item.menu._id === menuItem._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.menu._id === menuItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { menu: menuItem, quantity: 1, price: menuItem.price }]);
    }
  };

  const handleUpdateQuantity = (menuId, change) => {
    setCart(cart.map(item => {
      if (item.menu._id === menuId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const handleRemoveFromCart = (menuId) => {
    setCart(cart.filter(item => item.menu._id !== menuId));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          menu: item.menu._id,
          quantity: item.quantity,
          price: item.price,
        })),
        notes: orderNotes,
      };

      await orders.create(orderData);
      alert('Order placed successfully!');
      setCart([]);
      setOrderNotes('');
      setShowCart(false);
      navigate('/my-orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order');
    }
  };

  const handleEdit = (menuItem) => {
    navigate(`/menu/edit/${menuItem._id}`);
  };

  const handleDelete = async (menuId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await menu.delete(menuId);
        fetchMenus();
        alert('Menu deleted successfully');
      } catch (error) {
        console.error('Error deleting menu:', error);
        alert('Failed to delete menu');
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(menus.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedMenus = menus.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="container dashboard">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container dashboard" style={{marginTop: '100px'}}>
      <div className="page-header">
        <h1>Menu</h1>
        {isAdmin && (
          <button 
            onClick={() => navigate('/menu/new')} 
            className="btn btn-primary"
            style={{width: 'auto', padding: '10px 20px'}}
          >
            Add New Menu
          </button>
        )}
      </div>

      <div className="menu-grid">
        {paginatedMenus.map((menuItem) => (
          <MenuCard
            key={menuItem._id}
            menu={menuItem}
            onAddToCart={handleAddToCart}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
            style={styles.paginationBtn}
          >
            First
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
            disabled={currentPage === 1}
            style={styles.paginationBtn}
          >
            Previous
          </button>
          
          <div style={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  ...styles.pageButton,
                  ...(currentPage === page ? styles.activePageButton : {})
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
            disabled={currentPage === totalPages}
            style={styles.paginationBtn}
          >
            Next
          </button>
          <button 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages}
            style={styles.paginationBtn}
          >
            Last
          </button>
        </div>
      )}

      {!isAdmin && cart.length > 0 && (
        <button 
          className="cart-button" 
          onClick={() => setShowCart(true)}
        >
          🛒
          <span className="cart-badge">{cart.length}</span>
        </button>
      )}

      {showCart && (
        <div className="cart-modal" onClick={() => setShowCart(false)}>
          <div className="cart-content" onClick={(e) => e.stopPropagation()}>
            <h2>Your Cart</h2>
            {cart.map((item) => (
              <div key={item.menu._id} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.menu.name}</h4>
                  <p>Rp {item.price.toLocaleString()} x {item.quantity}</p>
                </div>
                <div className="cart-item-actions">
                  <button onClick={() => handleUpdateQuantity(item.menu._id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.menu._id, 1)}>+</button>
                  <button 
                    onClick={() => handleRemoveFromCart(item.menu._id)}
                    style={{background: '#dc3545'}}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            
            <div className="form-group" style={{marginTop: '20px'}}>
              <label>Order Notes (Optional)</label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special requests?"
              />
            </div>

            <div className="cart-total">
              <h3>Total: Rp {getTotalPrice().toLocaleString()}</h3>
            </div>

            <div className="form-actions">
              <button onClick={handleCheckout} className="btn btn-success">
                Place Order
              </button>
              <button onClick={() => setShowCart(false)} className="btn btn-secondary">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '40px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  paginationBtn: {
    padding: '10px 15px',
    border: '1px solid #4A5F75',
    background: 'white',
    color: '#4A5F75',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  pageNumbers: {
    display: 'flex',
    gap: '5px',
  },
  pageButton: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    background: 'white',
    color: '#333',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  activePageButton: {
    background: '#4A5F75',
    color: 'white',
    border: '1px solid #4A5F75',
  },
};

export default MenuList;