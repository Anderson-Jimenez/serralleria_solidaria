import React from 'react';
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Tags, Boxes, Settings2 } from "lucide-react";
import '../scss/app.scss';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Serralleria Solidària</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}
              end //'end' evita que coincida con sub-rutas si solo quieres el dashboard exacto (no entendi, pero noma funciona con esto, si no, le pone active tambien)
              
            >
              <LayoutDashboard size={20} />
              <span className="text">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "active" : "")}>
              <Package size={20} />
              <span className="text">Productes</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories" className={({ isActive }) => (isActive ? "active" : "")}>
              <Tags size={20} />
              <span className="text">Categories</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/packs" className={({ isActive }) => (isActive ? "active" : "")}>
              <Boxes size={20} />
              <span className="text">Packs</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/characteristics" className={({ isActive }) => (isActive ? "active" : "")}>
              <Settings2 size={20} />
              <span className="text">Característiques</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;