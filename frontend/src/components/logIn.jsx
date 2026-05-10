import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserRoundPlus, User, Eye, EyeClosed, X } from "lucide-react";
import { apiFetch } from "../hooks/apiUtils";

function LogInView({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState("login");
  const [error, setError] = useState("");

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const togglePasswordLogin = () => setShowPasswordLogin((prev) => !prev);

  const [showPasswordSignin, setShowPasswordSignin] = useState(false);
  const togglePasswordSignin = () => setShowPasswordSignin((prev) => !prev);

  // Transiciones suaves entre login y registro
  const switchToRegister = (e) => {
    e.preventDefault();
    setTransitioning(true);
    setTimeout(() => {
      setVisible("register");
      setTransitioning(false);
    }, 300);
  };

  const switchToLogin = (e) => {
    e.preventDefault();
    setTransitioning(true);
    setTimeout(() => {
      setVisible("login");
      setTransitioning(false);
    }, 300);
  };

  const logIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Error al iniciar sesión");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userType", data.userType);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));

      // Obtener datos completos del usuario si es necesario
      const resUser = await apiFetch("/me");
      const user = await resUser.json();

      if (onClose) onClose();

      if (user.userType === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiFetch("/signin", {
        method: "POST",
        body: JSON.stringify({ username, email, phone, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Error al crear compte");
        return;
      }

      // Login automático tras registro
      const resLogin = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!resLogin.ok) {
        const err = await resLogin.json();
        setError(err.message || "Error al iniciar sesión");
        return;
      }

      const data = await resLogin.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userType", data.userType);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));

      if (onClose) onClose();
      navigate("/");
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    }
  };

  return (
    <div>
      {/* Contenedor del modal con clase condicional */}
      <div className={`logInContainer ${!isOpen ? "hiddenLogIn" : ""}`}>
        {/* Botón de cerrar (X) */}
        <button className="close-login" onClick={onClose}>
          <X size={24} />
        </button>

        <div className={`loginContent ${transitioning ? "fadeOut" : "fadeIn"}`}>
          {/* Vista LOGIN */}
          {visible === "login" && (
            <>
              <div className="logInHalf">
                <h3>Iniciar Sessió</h3>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={logIn}>
                  <div className="loginCredentials">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Usuari o Correu"
                    />
                  </div>
                  <div className="loginCredentials">
                    <input
                      type={showPasswordLogin ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Contrasenya"
                    />
                    {showPasswordLogin ? (
                      <EyeClosed size={20} onClick={togglePasswordLogin} />
                    ) : (
                      <Eye size={20} onClick={togglePasswordLogin} />
                    )}
                  </div>
                  <button type="submit">
                    <LogIn size={20} /> Iniciar Sessió
                  </button>
                </form>
                <a href="#">Has oblidat la teva contrasenya?</a>
              </div>

              <div className="signInHalf">
                <h3>No tens compte?</h3>
                <p>
                  Si no tens compte creala ara mateix en menys de 2 minuts!
                </p>
                <a href="#" onClick={switchToRegister}>
                  <UserRoundPlus size={20} /> Crear Compte
                </a>
              </div>
            </>
          )}

          {/* Vista REGISTRO */}
          {visible === "register" && (
            <div className="registerHalf">
              <h3>Crear Compte</h3>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <form onSubmit={signIn}>
                <div className="loginCredentials">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Nom d'usuari"
                  />
                </div>
                <div className="loginCredentials">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Correu electrònic"
                  />
                </div>
                <div className="loginCredentials">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={9}
                    required
                    placeholder="Telèfon"
                  />
                </div>
                <div className="loginCredentials">
                  <input
                    type={showPasswordSignin ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Contrasenya"
                  />
                  {showPasswordSignin ? (
                    <EyeClosed size={20} onClick={togglePasswordSignin} />
                  ) : (
                    <Eye size={20} onClick={togglePasswordSignin} />
                  )}
                </div>
                <button type="submit">
                  <UserRoundPlus size={20} /> Crear Compte
                </button>
              </form>
              <a href="#" onClick={switchToLogin}>
                Ja tens compte? Inicia Sessió
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LogInView;