import { useNavigate } from 'react-router-dom';

function MenuCard({ menu, onAddToCart, isAdmin, onEdit, onDelete }) {
  const navigate = useNavigate();
  const imageUrl = menu.image 
    ? `http://localhost:5000${menu.image}` 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div style={styles.card}>
      <img src={imageUrl} alt={menu.name} style={styles.image} />
      <div style={styles.content}>
        <div style={styles.category}>{menu.category}</div>
        <h3 style={styles.title}>{menu.name}</h3>
        <p style={styles.description}>{menu.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>Rp {menu.price.toLocaleString()}</span>
          {!menu.available && <span style={styles.unavailable}>Tidak Tersedia</span>}
        </div>
        <div style={styles.actions}>
          {isAdmin ? (
            <>
              <button onClick={() => onEdit(menu)} style={{...styles.btn, ...styles.btnEdit}}>
                Edit
              </button>
              <button onClick={() => onDelete(menu._id)} style={{...styles.btn, ...styles.btnDelete}}>
                Delete
              </button>
            </>
          ) : (
            <button 
              onClick={() => onAddToCart(menu)} 
              style={{...styles.btn, ...styles.btnAdd}}
              disabled={!menu.available}
            >
              {menu.available ? 'Add to Cart' : 'Unavailable'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '20px',
  },
  category: {
    display: 'inline-block',
    background: '#e3f2fd',
    color: '#1976d2',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '10px',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  description: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  price: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
  },
  unavailable: {
    color: '#dc3545',
    fontSize: '12px',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  btn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  btnAdd: {
    background: '#007bff',
    color: 'white',
  },
  btnEdit: {
    background: '#ffc107',
    color: '#333',
  },
  btnDelete: {
    background: '#dc3545',
    color: 'white',
  },
};

export default MenuCard;