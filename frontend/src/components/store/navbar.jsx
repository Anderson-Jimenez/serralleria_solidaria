import { useEffect, useState } from "react";
import { Search, User, ShoppingCart, ChevronDown, KeyRound, LogIn } from 'lucide-react';
import LogInView from "../logIn";
import { apiFetch } from '../../hooks/apiUtils';
import CartSidebar from './cartSidebar';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState(() => {
    // Inicialitza llegint el localStorage al carregar
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;  // JSON.parse per convertir a objecte
  });

  const [open, setOpen] = useState(false);

  const logOut = async (e) => {
    e.preventDefault();

    try {
      const res = await apiFetch('/logout', {
        method: 'POST',
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || 'Error al tancar sessió');
        return;
      }

      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('user');

      window.dispatchEvent(new Event('storage'));

      navigate("/");

    } catch (err) {
      setError('Error de connexió amb el servidor');
      console.error(err);
    }
  };


  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('http://localhost:8000/api/categories');
        if (!response.ok) throw new Error('Error al traer categorías');
        const data = await response.json();
        setCategories(data);
      }
      catch (error) {
        console.error("Error:", error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchCategories();

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
        <div className="navbar-brand">
          <KeyRound size={24} color="#ff6b35" />
          <span className="brand-name">Serralleria Solidaria</span>
        </div>

        <ul className="nav-links">
          <li><a href="/">Inici</a></li>

          <li className="dropdown">
            <a href="#">Productes <ChevronDown size={14} /></a>
            <ul className="dropdown-menu">
              {categories.map(category => (
                <li key={category.id}>
                  <a onClick={() => navigate(`/products/${category.name}`)}>{category.name}</a>
                </li>
              ))}
            </ul>
          </li>
          <li><a href="/solucions_personalitzades">Solucions Personalitzades</a></li>
        </ul>

        {/* LADO DERECHO: ICONOS */}
        <div className="navbar-icons">
          <button><Search size={20} /></button>

          <div className="cart-container" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={20} />
            <span className="badge">3</span>
          </div>

          {loggedUser ? (
            <div className="dropdown" onMouseLeave={() => setOpen(false)}>
              <button onClick={() => setOpen(!open)}>
                  Benvingut, {loggedUser.username} ▾
              </button>
              {open && (
                  <ul className="dropdown-menu">
                      <li><a href="/perfil">Perfil</a></li>
                      <li><button onClick={logOut}>Tancar Sessió</button></li>
                  </ul>
              )}
            </div>
          ) : (<LogInView />)}
        </div>
      </nav>
      
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default Navbar;