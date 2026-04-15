import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Power, Trash2 } from "lucide-react";

import Threads from "../../components/bg/threads";

function LoginAdmin() {

  return (
    <section className="loginSection">
      <div className="threads-container">
        <Threads
          amplitude={5}
          distance={0}
          enableMouseInteraction={false}
        />
      </div>
      <div className="loginContainer">
        <h1>Login</h1>
        <form action="">
          <div>
            <label htmlFor="username">Usuari: </label>
            <input type="username" />
          </div>
          <div>
            <label htmlFor="password">Contrasenya: </label>
            <input type="password" />
          </div>
          <div>
            <a href="#">Has oblidat la contrasenya?</a>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LoginAdmin;