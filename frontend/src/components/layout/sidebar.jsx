import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");

  const links = [
    "Dashboard",
    "Productos",
    "Categorías",
    "Pedidos",
    "Usuarios",
  ];

  return (
    <div className={`sidebar ${!isOpen ? "closed" : ""}`}>
      
      <div className="sidebar-header">
        {isOpen && (
          <h2 className="sidebar-title">
            Serrallería Solidària
          </h2>
        )}

        <button
          className="toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      <ul className="sidebar-list">
        {links.map((link) => (
          <li
            key={link}
            className={`sidebar-item ${
              active === link ? "active" : ""
            }`}
            onClick={() => setActive(link)}
          >
            {isOpen ? link : link.charAt(0)}
          </li>
        ))}
      </ul>
    </div>
  );
}