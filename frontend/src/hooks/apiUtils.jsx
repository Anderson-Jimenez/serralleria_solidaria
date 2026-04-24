// src/utils/api.js
const API_URL = 'http://localhost:8000/api';

export function authHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

export async function apiFetch(endpoint, options = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...authHeaders(),
            ...(options.headers || {})
        }
    });

    if (res.status === 401) {
        // Token expirado o inválido — limpia y redirige
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        //window.location.href = '/';
    }

    return res;
}