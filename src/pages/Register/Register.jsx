import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Asegúrate de que el path sea correcto

function Register() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5001/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mail: email, // Se usa "mail" en lugar de "email"
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Usuario registrado con éxito");
                navigate("/login"); // Redirige a login tras registrarse
            } else {
                alert(data.message || "Error al registrar usuario");
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Hubo un problema en el servidor");
        }
    };

    return (
        <div className="login-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
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

                    <button type="submit" className="btn-blue" onClick={() => navigate("/register1")} >
                        Siguiente
                    </button>
                </form>

                <p className="footer-text">
                    ¿Ya tienes una cuenta?
                    <span className="login-link" onClick={() => navigate("/login")}>
                        Inicia sesión en Vibra.
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Register;
