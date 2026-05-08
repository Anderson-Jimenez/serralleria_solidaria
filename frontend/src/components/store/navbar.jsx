import { useState,useEffect } from "react";
import { Search, ShoppingCart, ChevronDown, KeyRound } from 'lucide-react';
import LogInView from "../logIn";
import { apiFetch } from '../../hooks/apiUtils';
import CartSidebar from './cartSidebar';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

function Navbar() {
  const navigate = useNavigate();
  const { cartCount, refreshCart } = useCart();

  const [categories, setCategories] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));

    const handleStorage = () => {
      const saved = localStorage.getItem('user');
      setLoggedUser(saved ? JSON.parse(saved) : null);
      refreshCart(); // El carrito puede cambiar al hacer login/logout
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshCart]);

  const logOut = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/logout', { method: 'POST' });
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('user');
      localStorage.removeItem('order_id'); // Limpiar el pedido actual
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        {/* LOGO */}
        <div
          className="navbar-brand"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <KeyRound size={24} color="#ff6b35" />
          <span className="brand-name">Serralleria Solidaria</span>
        </div>

        {/* LINKS */}
        <ul className="nav-links">
          <li><a href="/">Inici</a></li>
          <li className="dropdown">
            <a href="#">Productes <ChevronDown size={14} /></a>
            <ul className="dropdown-menu">
              {categories.map(category => (
                <li key={category.id}>
                  <a onClick={() => navigate(`/products/${category.name}`)}>
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="dropdown">
            <a href="/packs">Packs <ChevronDown size={14} /></a>
          </li>
          <li>
            <a href="/solucions_personalitzades">
              Solucions Personalitzades
            </a>
          </li>
        </ul>

        {/* ICONOS */}
        <div className="navbar-icons">
          <button>
            <Search size={20} />
          </button>

          {/* CARRITO */}
          <button
            className="cart-btn-nav"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>

          {/* USER */}
          {loggedUser ? (
            <div
              className="dropdown user-dropdown"
              onMouseLeave={() => setUserOpen(false)}
            >
              <button
                className="user-btn"
                onClick={() => setUserOpen(!userOpen)}
              >
                Benvingut, {loggedUser.username} <ChevronDown size={14} />
              </button>
              {userOpen && (
                <ul className="dropdown-menu">
                  <li><a href="/profile">Perfil</a></li>
                  <li><button onClick={logOut}>Tancar Sessió</button></li>
                </ul>
              )}
            </div>
          ) : (
            <LogInView />
          )}
        </div>
      </nav>

      {/* SIDEBAR */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
}

export default Navbar;