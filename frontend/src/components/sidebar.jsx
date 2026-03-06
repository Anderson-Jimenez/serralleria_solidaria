import React from 'react';
import '../styles/sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Serralleria Solidària</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="active">
            <a href="#dashboard"><span className="text">dashboard</span></a>
          </li>
          <li>
            <a href="#productes"><span className="text">productes</span></a>
          </li>
          <li>
            <a href="#categories"><span className="text">categories</span></a>
          </li>
          <li>
            <a href="#packs"><span className="text">packs</span></a>
          </li>
          <li>
            <a href="#caracteristiques"><span className="text">caracteristiques</span></a>
          </li>
          <li>
            <a href="#usuaris"><span className="text">usuaris</span></a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;