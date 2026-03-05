import React from 'react';
import '../styles/sidebar.css'; 

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: '📈', active: true },
    { name: 'Productes', icon: '🎁', active: false },
    { name: 'Categories', icon: '📚', active: false },
    { name: 'Packs', icon: '🏰', active: false },
    { name: 'Característiques', icon: '⭐', active: false },
    { name: 'Usuaris', icon: '👥', active: false },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Serralleria Solidària</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className={item.active ? 'active' : ''}>
              <span className="icon">{item.icon}</span>
              <span className="text">{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;