import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FoodSlideshow({ foodItems = [] }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (foodItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % foodItems.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [foodItems.length]);

  if (foodItems.length === 0) {
    return (
      <div style={styles.emptySlideshow}>
        <p>No food items to display</p>
      </div>
    );
  }

  const currentFood = foodItems[currentSlide];
  const imageUrl = currentFood.image 
    ? `http://localhost:5000${currentFood.image}` 
    : 'https://via.placeholder.com/800x400?text=No+Image';

  return (
    <div style={styles.slideshowContainer}>
      <div style={styles.slideWrapper}>
        <img 
          src={imageUrl} 
          alt={currentFood.name} 
          style={styles.slideImage}
        />
        
        <div style={styles.slideContent}>
          <h2 style={styles.foodName}>{currentFood.name}</h2>
          <p style={styles.foodDescription}>{currentFood.description}</p>
          
          <button 
            onClick={() => navigate('/menu')}
            style={styles.viewMenuBtn}
          >
            Lihat Menu Lengkap →
          </button>
        </div>
      </div>


    </div>
  );
}

const styles = {
  slideshowContainer: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: '15px',
    overflow: 'hidden',
    marginBottom: '40px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  slideWrapper: {
    position: 'relative',
    width: '100%',
    paddingBottom: '35%', // Reduced from 50%
    overflow: 'hidden',
  },
  slideImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  slideContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    color: 'white',
    padding: '40px 30px',
    transform: 'translateY(20px)',
    transition: 'transform 0.3s ease',
  },
  foodName: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    marginBottom: '15px',
  },
  foodDescription: {
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '20px',
    opacity: 0.95,
  },
  priceTag: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4A5F75',
    marginBottom: '20px',
  },
  viewMenuBtn: {
    background: '#4A5F75',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(74, 95, 117, 0.3)',
  },
  navButton: {
    display: 'none', // Hide navigation buttons
  },
  indicators: {
    display: 'none', // Hide indicators
  },
  indicator: {
    display: 'none', // Hide indicator buttons
  },
  activeIndicator: {
    display: 'none', // Hide active indicator
  },
  slideCounter: {
    display: 'none', // Hide counter
  },
  emptySlideshow: {
    width: '100%',
    height: '400px',
    backgroundColor: '#f0f0f0',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    marginBottom: '40px',
  },
};

export default FoodSlideshow;
