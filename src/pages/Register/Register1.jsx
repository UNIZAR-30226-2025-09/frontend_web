import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Asegúrate de que el path sea correcto

function Register1() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/next-step"); // Redirigir al siguiente paso del registro
    };

    return (
        <div className="login-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div className="login-box" style={{ backgroundColor: "#1e1e1e" }}>
                <img
                    src="../vibrablanco.png"
                    alt="Vibra Logo"
                    className="logo"
                    onClick={() => window.location.reload()}
                />

                {/* Barra de progreso actualizada a azul */}
                <div className="progress-bar" style={{ width: "100%", height: "5px", backgroundColor: "#333", borderRadius: "2px", marginBottom: "15px" }}>
                    <div style={{ width: "33%", height: "100%", backgroundColor: "#79e2ff", borderRadius: "2px" }}></div>
                </div>

                <h2 style={{ fontSize: "18px", color: "#fff", marginBottom: "10px" }}>Paso 1 de 3</h2>
                <h1 className="login-txt" style={{ fontSize: "22px" }}>Crea una contraseña</h1>
                <hr className="line" />
                <form onSubmit={handleSubmit}>
                    <div className="input-label" style={{ position: "relative" }}>
                        <label htmlFor="password">Contraseña</label>
                        <div style={{ position: "relative", width: "80%", margin: "auto" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="globalInput"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: "100%", paddingRight: "40px", height: "40px", borderRadius: "5px", boxSizing: "border-box" }}
                            />
                            <span
                                className="password-toggle"
                                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: "20px", lineHeight: "1", display: "flex", alignItems: "center" }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>
                    </div>

                    <p style={{ fontSize: "14px", color: "#fff", textAlign: "left", marginLeft: "20%" }}>La contraseña debe contener al menos:</p>
                    <ul className="password-validation" style={{ textAlign: "left", fontSize: "14px", color: "#fff", marginLeft: "20%" }}>
                        <li>✔ 1 letra</li>
                        <li>✔ 1 número o carácter especial (por ejemplo, "#", "?", "!" o "&")</li>
                        <li>✔ 10 caracteres</li>
                    </ul>

                    <button type="submit" className="btn-blue" style={{ backgroundColor: "#79e2ff", color: "black" }}>
                        Siguiente
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register1;

