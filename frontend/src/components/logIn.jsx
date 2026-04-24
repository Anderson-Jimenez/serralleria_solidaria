import React from 'react';
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogIn, UserRoundPlus, User } from "lucide-react";
import { apiFetch } from '../hooks/apiUtils';

function LogInView() {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isDisplayed, setIsDisplayed] = useState(true);
    const [showRegister, setShowRegister] = useState(false); // 👈 nou esta
    const [transitioning, setTransitioning] = useState(false);
    const [visible, setVisible] = useState('login'); // 'login' | 'register'

    const [error, setError] = useState("");

    const toggleLogIn = () => setIsDisplayed(!isDisplayed);

    const switchToRegister = (e) => {
        e.preventDefault();
        setTransitioning(true);         // 1. desapareix contingut
        setTimeout(() => {
            setVisible('register');     // 2. canvia contingut (el recuadre s'ajusta)
            setTransitioning(false);    // 3. apareix nou contingut
        }, 300);
    };

    const switchToLogin = (e) => {
        e.preventDefault();
        setTransitioning(true);
        setTimeout(() => {
            setVisible('login');
            setTransitioning(false);
        }, 300);
    };

    const logIn = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await apiFetch('/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                const err = await res.json();
                setError(err.message || 'Error al iniciar sesión');
                return;
            }

            const data = await res.json();

            // Guarda token y tipo de usuario
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('userType', data.userType);
            localStorage.setItem('user', JSON.stringify(data.user));

            window.dispatchEvent(new Event('storage'));
            const resUser = await apiFetch('/me');
            const user = await resUser.json();

            if (user.userType === 'admin') {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (err) {
            setError('Error de conexión con el servidor');
            console.error(err);
        }
    };

    const signIn = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await apiFetch('/signin', {
                method: 'POST',
                body: JSON.stringify({ username, email, phone, password })
            });

            if (!res.ok) {
                const err = await res.json();
                setError(err.message || 'Error al crear compte');
                return;
            }

            try {
                const res = await apiFetch('/login', {
                    method: 'POST',
                    body: JSON.stringify({ username, password })
                });

                if (!res.ok) {
                    const err = await res.json();
                    setError(err.message || 'Error al iniciar sesión');
                    return;
                }

                const data = await res.json();

                // Guarda token y tipo de usuario
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('userType', data.userType);
                localStorage.setItem('user', JSON.stringify(data.user));

                window.dispatchEvent(new Event('storage'));
                const resUser = await apiFetch('/me');
                const user = await resUser.json();

                navigate("/");

            } catch (err) {
                setError('Error de conexión con el servidor');
                console.error(err);
            }

        } catch (err) {
            setError('Error de conexión con el servidor');
            console.error(err);
        }
    };

    return (
        <div>
            <button onClick={toggleLogIn}><User size={20} /></button>
            <div className={`logInContainer ${isDisplayed ? 'hiddenLogIn' : ''}`}>

                <div className={`loginContent ${transitioning ? 'fadeOut' : 'fadeIn'}`}>

                    {visible === 'login' && (
                        <>
                            <div className='logInHalf'>
                                <h3>Iniciar Sessió</h3>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                <form onSubmit={logIn}>
                                    <div className="loginCredentials">
                                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder='Usuari o Correu' />
                                    </div>
                                    <div className="loginCredentials">
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='Contrasenya' />
                                    </div>
                                    <button type="submit"><LogIn size={20} /> Iniciar Sessió</button>
                                </form>
                                <a href="#">Has oblidat la teva contrasenya?</a>
                            </div>

                            <div className='signInHalf'>
                                <h3>No tens compte?</h3>
                                <p>Si no tens compte creala ara mateix en menys de 2 minuts!</p>
                                <a href="#" onClick={switchToRegister}>
                                    <UserRoundPlus size={20} /> Crear Compte
                                </a>
                            </div>
                        </>
                    )}

                    {visible === 'register' && (
                        <div className='registerHalf'>
                            <h3>Crear Compte</h3>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <form onSubmit={signIn}>
                                <div className="loginCredentials">
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Nom d'usuari" />
                                </div>
                                <div className="loginCredentials">
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='Correu electrònic' />
                                </div>
                                <div className="loginCredentials">
                                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={9} required placeholder='Telèfon' />
                                </div>
                                <div className="loginCredentials">
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='Contrasenya' />
                                </div>
                                <button type="submit"><UserRoundPlus size={20} /> Crear Compte</button>
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
};

export default LogInView;