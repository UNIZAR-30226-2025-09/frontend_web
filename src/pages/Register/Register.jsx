import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.includes("@")) {
            setErrorMessage("El correo electrónico debe contener '@'");
            setTimeout(() => setErrorMessage(""), 2000); // El error desaparece después de 2 segundos
            return;
        }

        try {
            // Hacer una petición al backend para verificar si el correo ya está registrado
            const response = await fetch("http://localhost:5001/api/user/check-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mail: email }),
            });

            const data = await response.json();

            // Si el correo ya está registrado
            if (data.exists) {
                setErrorMessage("El correo electrónico ya está registrado.");
                return;
            }

            // Guardar el correo en localStorage para pasarlo a los siguientes pasos
            localStorage.setItem("email", email);

            // Redirigir al siguiente paso del registro
            navigate("/register1");

        } catch (error) {
            console.error("Error al verificar el correo:", error);
            setErrorMessage("Hubo un problema al verificar el correo.");
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
                    {errorMessage && <p style={{ color: "red", fontSize: "14px" }}>{errorMessage}</p>}
                    <button type="submit" className="btn-blue">
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
