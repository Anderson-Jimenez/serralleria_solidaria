// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Ruta que requereix autenticació
export function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated() ? children : <Navigate to="/" />;
}

// Ruta exclusiva per admins
export function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated()) return <Navigate to="/" />;
    if (!isAdmin()) return <Navigate to="/" />; // redirigeix si no és admin

    return children;
}