import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { menu } from '../utils/api';

function MenuForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'makanan',
    available: true,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchMenu();
    }
  }, [id]);

  const fetchMenu = async () => {
    try {
      const response = await menu.getById(id);
      const menuData = response.data;
      setFormData({
        name: menuData.name,
        description: menuData.description,
        price: menuData.price,
        category: menuData.category,
        available: menuData.available,
      });
      if (menuData.image) {
        setPreview(`http://localhost:5000${menuData.image}`);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      setError('Failed to load menu data');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('available', formData.available);
      
      if (image) {
        formDataToSend.append('image', image);
      }

      if (isEdit) {
        await menu.update(id, formDataToSend);
        alert('Menu updated successfully');
      } else {
        await menu.create(formDataToSend);
        alert('Menu created successfully');
      }
      
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save menu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-form-container">
      <h2>{isEdit ? 'Edit Menu' : 'Add New Menu'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price (Rp)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              style={{width: 'auto', marginRight: '10px'}}
            />
            Available
          </label>
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Menu' : 'Create Menu')}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/menu')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default MenuForm;