import { useState, useEffect } from "react";

export function useAuth() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userType, setUserType] = useState(localStorage.getItem('userType'));

    // Escolta canvis al localStorage
    useEffect(() => {
        const handleStorage = () => {
            setToken(localStorage.getItem('token'));
            setUserType(localStorage.getItem('userType'));
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        window.dispatchEvent(new Event('storage'));
        setToken(null);
        setUserType(null);
        navigate('/');
    };

    const isAdmin = () => userType === 'admin';
    const isUser = () => userType === 'user';
    const isAuthenticated = () => !!token;

    return { token, userType, isAdmin, isUser, isAuthenticated, logOut };
}