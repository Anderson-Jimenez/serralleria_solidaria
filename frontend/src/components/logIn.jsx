import React from 'react';
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogIn, UserRoundPlus, User } from "lucide-react";

function LogInView() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isDisplayed, setIsDisplayed] = useState(true);
    const toggleLogIn = () => setIsDisplayed(!isDisplayed);

    const logIn = (e) => {
        fetch("http://localhost:8000/api/logIn/logIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
            })
        })
            .then(async res => {
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(JSON.stringify(errorData));
                }
                return res.json();
            })
            .then(data => {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('userType', data.userType);
                
                // Força actualització de l'estat disparant l'event
                window.dispatchEvent(new Event('storage'));
                
                if (data.userType === 'admin') {
                    navigate("/admin");
                } else {
                    window.location.reload()
                }
            })
            .catch(err => {
                console.error('Error detallat:', err);
                alert('Error al fer login. Revisa la consola per mes detalls.');
            });
    }

    return (
        <div>
            <button onClick={toggleLogIn}><User size={20} /></button>
            <div className={`logInContainer ${isDisplayed ? 'hiddenLogIn' : ''}`} >
                <div className='logInHalf'>
                    <h3>Iniciar Sessió</h3>
                    <form onSubmit={(e) => { e.preventDefault(); logIn(); }}>
                        <div className="loginCredentials">
                            <label htmlFor="username">Usuari: </label>
                            <input type="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder='Usuari o Correu' />
                        </div>
                        <div className="loginCredentials">
                            <label htmlFor="password">Contrasenya: </label>
                            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='Contrasenya' />
                        </div>
                        <button type="submit"><LogIn size={20} /> Iniciar Sessió</button>
                    </form>
                    <a href="">Has oblidat la teva contrasenya?</a>

                </div>
                <div className='signInHalf'>
                    <h3>No tens compte?</h3>
                    <p>Si no tens compte creala ara mateix en menys de 2 minuts!</p>
                    <a href=""> <UserRoundPlus size={20} /> Crear Compte</a>
                </div>
            </div>
        </div>
    );
};

export default LogInView;