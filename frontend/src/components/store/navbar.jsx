import { useEffect, useState } from "react";
import { Search, User, ShoppingCart, ChevronDown, KeyRound } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  return (
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
            { categories.map(category => (
              <li key={category.id}>
                <a onClick={() => navigate(`/products/${category.name}`)}>{category.name}</a>
              </li>
            ))

            }
          </ul>
        </li>
        <li><a href="/solucions_personalitzades">Solucions Personalitzades</a></li>
      </ul>

      {/* LADO DERECHO: ICONOS */}
      <div className="navbar-icons">
        <button><Search size={20} /></button>
        <button><User size={20} /></button>
        <div className="cart-container">
          <ShoppingCart size={20} />
          <span className="badge">3</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;