import React from 'react';
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Tags, Boxes, Settings2, NotebookText, Menu, Users, Mails, Truck } from "lucide-react";
import '../scss/app.scss';

const Sidebar = () => {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside 
      className={`sidebar ${isOpen ? 'open' : 'closed'}`}
      aria-label="Menú de navegació principal"
      aria-expanded={isOpen}
    >
      <div className="sidebar-header">
        <button 
          onClick={toggleSidebar}
          aria-label={isOpen ? "Tancar menú lateral" : "Obrir menú lateral"}
          aria-expanded={isOpen}
        >
          <Menu size={20} color='white' aria-hidden="true" />
          <span className="sr-only">{isOpen ? "Tancar" : "Obrir"} menú de navegació</span>
        </button>
        <h2 id="sidebar-title">Serralleria Solidària</h2>
      </div>
      <nav 
        className="sidebar-nav" 
        aria-label="Navegació d'administració"
        aria-labelledby="sidebar-title"
      >
        <ul role="list">
          <li role="listitem">
            <NavLink 
              to="/admin" 
              className={({ isActive }) => (isActive ? "active" : "")}
              end //'end' evita que coincida amb sub-rutas si solo quieres el dashboard exacto (no entendi, pero noma funciona con esto, si no, le pone active tambien)
              aria-current={({ isActive }) => isActive ? "page" : undefined}
            >
              <LayoutDashboard size={20} aria-hidden="true" />
              <span className="text">Dashboard</span>
            </NavLink>
          </li>
          <li role="listitem">
            <NavLink 
              to="/admin/products" 
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-current={({ isActive }) => isActive ? "page" : undefined}
            >
              <Package size={20} aria-hidden="true" />
              <span className="text">Productes</span>
            </NavLink>
          </li>
          <li role="listitem">
            <NavLink 
              to="/admin/categories" 
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-current={({ isActive }) => isActive ? "page" : undefined}
            >
              <Tags size={20} aria-hidden="true" />
              <span className="text">Categories</span>
            </NavLink>
          </li>
          <li role="listitem">
            <NavLink 
              to="/admin/packs" 
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-current={({ isActive }) => isActive ? "page" : undefined}
            >
              <Boxes size={20} aria-hidden="true" />
              <span className="text">Packs</span>
            </NavLink>
          </li>
          <li role="listitem">
            <NavLink 
              to="/admin/characteristics" 
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-current={({ isActive }) => isActive ? "page" : undefined}
            >
              <Settings2 size={20} aria-hidden="true" />
              <span className="text">Característiques</span>
            </NavLink>
          </li>
          <li role="listitem">
            <NavLink 
              to="/admin/types" 
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-current={({ isActive }) => isActive ? "page" : undefined}
            >
              <NotebookText size={20} aria-hidden="true" />
              <span className="text">Tipus de Caracteristiques</span>
            </NavLink>
          </li>
          <li role="listitem">
            <NavLink 
              to="/admin/orders" 
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-current={({ isActive }) => isActive ? "page" : undefined}
            >
              <Truck size={20} aria-hidden="true" />
              <span className="text">Comandes</span>
            </NavLink>
          </li>
          <li role="listitem">
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-current={({ isActive }) => isActive ? "page" : undefined}
            >
              <Users size={20} aria-hidden="true" />
              <span className="text">Usuaris</span>
            </NavLink>
          </li>
          <li role="listitem">
            <NavLink 
              to="/admin/solucionsPersonalitzades" 
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-current={({ isActive }) => isActive ? "page" : undefined}
            >
              <Mails size={20} aria-hidden="true" />
              <span className="text">Peticions</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;