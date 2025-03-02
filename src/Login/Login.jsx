import React, { useState } from "react";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Iniciando sesión con: ${email}`);
    };

    const goToRegister = () => {
       // Redirige a la página de registro
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img
                    src="../public/vibra.png"
                    alt="Vibra Logo"
                    className="logo"
                    onClick={() => window.location.reload()}
                />
                <h1 className="login-txt">Iniciar Sesión en Vibra</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-label">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-label">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-blue">Continuar</button>
                </form>

                <div className="divider">o</div>

                <p className="footer-text">
                    ¿No tienes una cuenta? 
                    <span className="register-txt" onClick={goToRegister}>
                        Regístrate en Vibra.
                    </span>
                </p>

                <p className="small-text">
                    Si quieres saber más sobre nuestras suscripciones, visita
                    <a href="#"> Vibra Suscripciones.</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
