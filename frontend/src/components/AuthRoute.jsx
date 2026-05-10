// AuthRoute.jsx
import { Navigate } from 'react-router-dom';

function AuthRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Pasamos un flag en el state de la navegación
    return <Navigate to="/" state={{ openLogin: true }} replace />;
  }

  return children;
}

export default AuthRoute;