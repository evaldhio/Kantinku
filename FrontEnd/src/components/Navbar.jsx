import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!localStorage.getItem('token');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close menu when resizing to desktop
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo} onClick={handleNavClick}>
          KantinKu
        </Link>
        
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          style={styles.menuToggle}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          ☰
        </button>

        <div className="navLinks" style={styles.navLinks}>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              <Link to="/menu" style={styles.link}>Menu</Link>
              {user.role === 'admin' && (
                <Link to="/orders" style={styles.link}>All Orders</Link>
              )}
              {user.role === 'customer' && (
                <Link to="/my-orders" style={styles.link}>My Orders</Link>
              )}
              <span style={styles.username}>{user.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="navbar-mobile-menu open">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="navbar-mobile-link" onClick={handleNavClick}>Dashboard</Link>
                <Link to="/menu" className="navbar-mobile-link" onClick={handleNavClick}>Menu</Link>
                {user.role === 'admin' && (
                  <Link to="/orders" className="navbar-mobile-link" onClick={handleNavClick}>All Orders</Link>
                )}
                {user.role === 'customer' && (
                  <Link to="/my-orders" className="navbar-mobile-link" onClick={handleNavClick}>My Orders</Link>
                )}
                <div className="navbar-mobile-username">{user.name}</div>
                <button onClick={handleLogout} className="navbar-mobile-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-mobile-link" onClick={handleNavClick}>Login</Link>
                <Link to="/register" className="navbar-mobile-link" onClick={handleNavClick}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: '#007bff',
    padding: '15px 0',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  logo: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'opacity 0.3s',
  },
  username: {
    color: 'white',
    fontSize: '14px',
    padding: '5px 15px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
  },
  logoutBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.3s',
  },
  menuToggle: {
    display: 'none',
  },
};

export default Navbar;