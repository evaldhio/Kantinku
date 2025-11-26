import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MenuList from './pages/MenuList';
import MenuForm from './pages/MenuForm';
import OrderList from './pages/OrderList';
import MyOrders from './pages/MyOrders';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="app-background">
        <video autoPlay muted loop playsinline>
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <Navbar />
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        } />
        <Route path="/menu" element={
          isAuthenticated ? <MenuList /> : <Navigate to="/login" />
        } />
        <Route path="/menu/new" element={
          isAuthenticated ? <MenuForm /> : <Navigate to="/login" />
        } />
        <Route path="/menu/edit/:id" element={
          isAuthenticated ? <MenuForm /> : <Navigate to="/login" />
        } />
        <Route path="/orders" element={
          isAuthenticated ? <OrderList /> : <Navigate to="/login" />
        } />
        <Route path="/my-orders" element={
          isAuthenticated ? <MyOrders /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;