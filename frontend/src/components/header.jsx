import React from 'react';
import { useEffect, useState } from "react";
import { apiFetch } from '../hooks/apiUtils'; // 👈 ajusta el path

function Header() {

  const [user, setUser] = useState(null);

    useEffect(() => {
        apiFetch("/me", { method: "GET" })
            .then(async res => {
                if (!res.ok) throw new Error('No autenticat');
                return res.json();
            })
            .then(data => {
                setUser(data);
            })
            .catch(err => {
                console.error('Error:', err);
            });
    }, []);

  
  return (
    <header className="admin-header">
      <div className="search-container">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" placeholder="Busca qualsevol cosa..." />
      </div>

      <div className="header-right">
        <div className="user-greeting">
           Hola, <span>{user ? user.username || user.email : 'Administrador'}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;