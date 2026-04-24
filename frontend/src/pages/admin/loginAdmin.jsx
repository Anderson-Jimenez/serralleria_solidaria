import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Power, Trash2 } from "lucide-react";

import Threads from "../../components/bg/threads";
import FloatingLines from '../../components/bg/floatingLines';

function LoginAdmin() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const mostrarLogIn = (e) =>{
    console.log(username+password)
  }
  const logIn = (e) =>{
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
        console.log(data);
        localStorage.setItem('token', data.access_token);
        navigate("/admin");
      })
      .catch(err => {
        console.error('Error detallat:', err);
        alert('Error al fer login. Revisa la consola per mes detalls.');
      });
  }

  return (
    <section className="loginSection">
      <div className="floating-lines-container">
        {/*
        <Threads
        color={[3,0.6,0]}
          amplitude={2}
          distance={0.1}
          enableMouseInteraction={false}
        />
        */}

        <FloatingLines 
            enabledWaves={["middle","top","bottom"]}
            // Array - specify line count per wave; Number - same count for all waves
            lineCount={8}
            // Array - specify line distance per wave; Number - same distance for all waves
            lineDistance={11}
            bendRadius={8}
            bendStrength={0}
            interactive={false}
            parallax={true}
            animationSpeed={1}
            linesGradient={["#F97316", "#6f6f6f", "#271d0e"]}
        />

      </div>
      <div className="loginContainer">
        <h1>Inici de Sessió</h1>
        <form action={logIn}>
          <div className="loginCredentials">
            <label htmlFor="username">Usuari: </label>
            <input type="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
          </div>
          <div className="loginCredentials">
            <label htmlFor="password">Contrasenya: </label>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>
          <button type="submit">Iniciar Sessió</button>
        </form>
      </div>
    </section>
  );
}

export default LoginAdmin;