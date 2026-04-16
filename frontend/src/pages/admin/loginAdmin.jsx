import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Power, Trash2 } from "lucide-react";

import Threads from "../../components/bg/threads";
import FloatingLines from '../../components/bg/floatingLines';

function LoginAdmin() {

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
        <form action="">
          <div className="loginCredentials">
            <label htmlFor="username">Usuari: </label>
            <input type="username" />
          </div>
          <div className="loginCredentials">
            <label htmlFor="password">Contrasenya: </label>
            <input type="password" />
          </div>
          <button type="submit">Iniciar Sessió</button>
        </form>
      </div>
    </section>
  );
}

export default LoginAdmin;