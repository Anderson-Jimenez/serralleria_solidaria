import React from 'react';
import '../scss/app.scss';
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Serralleria Solidària</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="active">
            <Link to="/admin"><span className="text">dashboard</span></Link>
          </li>
          <li>
            <Link to="/admin/products"><span className="text">productes</span></Link>
          </li>
          <li>
            <Link to="/admin/categories"><span className="text">categories</span></Link>
          </li>
          <li>
            <Link to="/admin/packs"><span className="text">packs</span></Link>
          </li>
          <li>
            <Link to="/admin/characteristics"><span className="text">caracteristiques</span></Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;