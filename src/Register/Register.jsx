import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Asegúrate de que el path sea correcto

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        alert(`Registrando usuario: ${username}, Email: ${email}`);
        // Aquí podrías enviar los datos al backend...
    };

    const goToLogin = () => {
        navigate("/login"); // Redirige a la página de inicio de sesión
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img
                    src="../vibrablanco.png"
                    alt="Vibra Logo"
                    className="logo"
                    onClick={() => window.location.reload()}
                />
                <h1 className="login-txt">Regístrate en Vibra</h1>
                <hr className="line" />
                <form onSubmit={handleSubmit}>
                    <div className="input-label">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="username"
                            className="globalInput"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-label">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="globalInput"
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
                            className="globalInput"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-label">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="globalInput"
                            placeholder="********"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-blue">
                        Registrarse
                    </button>
                </form>

                <div className="divider">o</div>

                <p className="footer-text">
                    ¿Ya tienes una cuenta?
                    <span className="login-link" onClick={goToLogin}>
            Inicia sesión en Vibra.
          </span>
                </p>
            </div>
        </div>
    );
}

export default Register;
