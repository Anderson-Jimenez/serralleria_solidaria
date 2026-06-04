import { useState, useEffect } from "react";
import {
  ShoppingCart,
  ChevronDown,
  KeyRound,
  User,
} from "lucide-react";
import LogInView from "../logIn";
import { apiFetch } from "../../hooks/apiUtils";
import CartSidebar from "./cartSidebar";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, refreshCart } = useCart();

  const [categories, setCategories] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (location.state?.openLogin) {
      setLoginOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetch("http://localhost:8000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));

    const handleStorage = () => {
      const saved = localStorage.getItem("user");
      setLoggedUser(saved ? JSON.parse(saved) : null);
      refreshCart();
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshCart]);

  const logOut = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/logout", { method: "POST" });
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("user");
      localStorage.removeItem("order_id");
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        {/* LOGO */}
        <Link className="navbar-brand" to="/">
          <KeyRound size={24} color="#ff6b35" />
          <span className="brand-name">Serralleria Solidaria</span>
        </Link>

        {/* LINKS */}
        <ul className="nav-links">
          <li>
            <Link to="/">Inici</Link>
          </li>
          <li className="dropdown">
            <button className="dropdown-trigger" aria-label="Veure categories de productes">
              Productes <ChevronDown size={14} />
            </button>
            <ul className="dropdown-menu">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={`/products/${encodeURIComponent(category.name)}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link to="/packs">Packs</Link>
          </li>
          <li>
            <Link to="/solucions_personalitzades">Solucions Personalitzades</Link>
          </li>
        </ul>

        {/* ICONOS */}
        <div className="navbar-icons">

          {/* CARRITO */}
          <button className="cart-btn-nav" onClick={() => setCartOpen(true)} aria-label="Obrir carret de la compra">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>

          {/* USER */}
          {loggedUser ? (
            <div
              className="dropdown user-dropdown"
              onMouseLeave={() => setUserOpen(false)}
            >
              <button
                className="user-btn"
                onClick={() => setUserOpen(!userOpen)}
              >
                Benvingut, {loggedUser.username} <ChevronDown size={14} />
              </button>
              {userOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="/profile">Perfil</Link></li>
                  <li><button onClick={logOut}>Tancar Sessió</button></li>
                </ul>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => setLoginOpen(true)} aria-label="Iniciar sessió">
                <User size={20} />
              </button>
              <LogInView
                isOpen={loginOpen}
                onClose={() => setLoginOpen(false)}
              />
            </>
          )}
        </div>
      </nav>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default Navbar;