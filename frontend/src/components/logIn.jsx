import React from 'react';
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogIn, UserRoundPlus, User } from "lucide-react";
import { apiFetch } from '../hooks/apiUtils';

function LogInView() {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isDisplayed, setIsDisplayed] = useState(true);
    const [showRegister, setShowRegister] = useState(false); // 👈 nou esta

    const [error, setError] = useState("");

    const toggleLogIn = () => setIsDisplayed(!isDisplayed);

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

    return (
       <div>
            <button onClick={toggleLogIn}><User size={20} /></button>
            <div className={`logInContainer ${isDisplayed ? 'hiddenLogIn' : ''}`}>

                {/* Slider intern */}
                <div className={`loginSlider ${showRegister ? 'showRegister' : ''}`}>

                    {/* VISTA LOGIN */}
                    <div className='logInHalf'>
                        <h3>Iniciar Sessió</h3>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <form onSubmit={logIn}>
                            <div className="loginCredentials">
                                <label>Usuari: </label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder='Usuari o Correu' />
                            </div>
                            <div className="loginCredentials">
                                <label>Contrasenya: </label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='Contrasenya' />
                            </div>
                            <button type="submit"><LogIn size={20} /> Iniciar Sessió</button>
                        </form>
                        <a href="#">Has oblidat la teva contrasenya?</a>
                    </div>

                    {/* VISTA REGISTRE */}
                    <div className='registerHalf'>
                        <h3>Crear Compte</h3>
                        <form>
                            <div className="loginCredentials">
                                <input type="text" placeholder='Nom d&apos;usuari' />
                            </div>
                            <div className="loginCredentials">
                                <input type="email" placeholder='Correu electrònic' />
                            </div>
                            <div className="loginCredentials">
                                <input type="password" placeholder='Contrasenya' />
                            </div>
                            <button type="submit"><UserRoundPlus size={20} /> Crear Compte</button>
                        </form>
                        <a href="#" onClick={(e) => { e.preventDefault(); setShowRegister(false); }}>
                            Ja tens compte? Inicia Sessió
                        </a>
                    </div>

                </div>

                {/* BOTÓ CREAR COMPTE — fora del slider */}
                {!showRegister && (
                    <div className='signInHalf'>
                        <h3>No tens compte?</h3>
                        <p>Si no tens compte creala ara mateix en menys de 2 minuts!</p>
                        <a href="#" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>
                            <UserRoundPlus size={20} /> Crear Compte
                        </a>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LogInView;