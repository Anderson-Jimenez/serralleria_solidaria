import { useEffect, useState } from "react";
import { Search, ShoppingCart, ChevronDown, KeyRound, LogIn } from 'lucide-react';
import LogInView from "../logIn";
import { apiFetch } from '../../hooks/apiUtils';
import CartSidebar from './cartSidebar';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate  = useNavigate();

  const [categories, setCategories] = useState([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [userOpen, setUserOpen]     = useState(false);

  // Cantidad de items en el carrito — se lee de localStorage
  const [cartCount, setCartCount] = useState(0);

  const [loggedUser, setLoggedUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Actualiza el badge del carrito leyendo los items guardados
  // Se llama al montar y cada vez que el sidebar se cierra
  function refreshCartCount() {
    const orderId = localStorage.getItem('order_id');
    if (!orderId) { setCartCount(0); return; }

    fetch(`http://localhost:8000/api/cart/${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const total = data.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(total);
        }
      })
      .catch(() => setCartCount(0));
  }

  const logOut = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/logout', { method: 'POST' });
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Categorías
    fetch('http://localhost:8000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error categorías:', err));

    // Badge del carrito al cargar
    refreshCartCount();

    // Escucha cambios de usuario (login/logout)
    const handleStorage = () => {
      const saved = localStorage.getItem('user');
      setLoggedUser(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="navbar-container">
      <nav className="navbar">

        {/* ── Logo ── */}
        <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <KeyRound size={24} color="#ff6b35" />
          <span className="brand-name">Serralleria Solidaria</span>
        </div>

        {/* ── Links ── */}
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

          <li><a href="/solucions_personalitzades">Solucions Personalitzades</a></li>
        </ul>

        {/* ── Iconos derecha ── */}
        <div className="navbar-icons">

          <button><Search size={20} /></button>

          {/* Carrito */}
          <button
            className="cart-btn-nav"
            onClick={() => {
              setCartOpen(true);
              refreshCartCount(); // refresca el badge al abrir
            }}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="badge">{cartCount}</span>
            )}
          </button>

          {/* Usuario */}
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

      {/* Sidebar — al cerrar refresca el badge */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => {
          setCartOpen(false);
          refreshCartCount();
        }}
      />
    </div>
  );
}

export default Navbar;