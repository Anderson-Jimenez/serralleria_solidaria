import React from 'react';
import { Search, User, ShoppingCart, ChevronDown, KeyRound } from 'lucide-react';

function Navbar() {
  return (
    <nav className="navbar">
      {/* LADO IZQUIERDO: LOGO */}
      <div className="navbar-brand">
        <KeyRound size={24} color="#ff6b35" />
        <span className="brand-name">Serralleria Solidaria</span>
      </div>

      {/* CENTRO: LINKS */}
      <ul className="nav-links">
        <li><a href="/">Inici</a></li>
        
        <li className="dropdown">
          <a href="#">Panys <ChevronDown size={14} /></a>
          <ul className="dropdown-menu">
            <li><a href="/segon-pany">Segon pany</a></li>
            <li><a href="/bombins">Bombins</a></li>
          </ul>
        </li>

        <li className="dropdown">
          <a href="#">Claus <ChevronDown size={14} /></a>
          <ul className="dropdown-menu">
            <li><a href="/clauers">Clauers</a></li>
            <li><a href="/copies">Còpies</a></li>
          </ul>
        </li>

        <li><a href="/ferramentes">Ferramentes</a></li>
        <li><a href="/contacte">Contacte</a></li>
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