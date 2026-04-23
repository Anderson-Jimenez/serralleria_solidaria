// components/AdminRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiFetch } from '../hooks/apiUtils';

function AdminRoute({ children }) {
    const [status, setStatus] = useState('loading'); // loading | ok | denied

    useEffect(() => {
        apiFetch('/me')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(user => {
                setStatus(user.userType === 'admin' ? 'ok' : 'denied');
            })
            .catch(() => setStatus('denied'));
    }, []);

    if (status === 'loading') return <p>Carregant...</p>;
    if (status === 'denied') return <Navigate to="/" />;
    return children;
}

export default AdminRoute;