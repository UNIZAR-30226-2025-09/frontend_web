import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register1() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const navigate = useNavigate();

    const validatePassword = () => {
        const errors = [];
        if (!/[a-zA-Z]/.test(password)) errors.push("La contraseña debe contener al menos una letra.");
        if (!/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(password)) errors.push("La contraseña debe contener al menos un carácter especial.");
        if (password.length < 10) errors.push("La contraseña debe tener al menos 10 caracteres.");
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validatePassword();
        if (errors.length > 0) {
            setErrorMessages(errors);
            return;
        }

        // Guardar la contraseña en localStorage junto con el correo
        const email = localStorage.getItem("email");
        localStorage.setItem("userData", JSON.stringify({ email, password }));

        navigate("/register2"); // Redirige al siguiente paso
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
                <div className="progress-bar" style={{ width: "100%", height: "5px", backgroundColor: "#333", borderRadius: "2px", marginBottom: "15px" }}>
                    <div style={{ width: "33%", height: "100%", backgroundColor: "#79e2ff", borderRadius: "2px" }}></div>
                </div>

                <h2>Paso 1 de 3</h2>
                <h1 className="login-txt">Crea una contraseña</h1>
                <hr className="line" />
                <form onSubmit={handleSubmit}>
                    <div className="input-label">
                        <label htmlFor="password">Contraseña</label>
                        <div style={{position: "relative", width: "80%", display: "flex", alignItems: "center"}}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="globalInput"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    paddingRight: "40px",
                                    height: "40px",
                                    borderRadius: "5px",
                                    boxSizing: "border-box",
                                    textAlign: "left"
                                }}
                            />
                            <span
                                className="password-toggle"
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "30%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    fontSize: "20px"
                                }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>
                    </div>

                    {errorMessages.length > 0 && (
                        <div style={{color: "red", fontSize: "14px", marginTop: "5px"}}>
                            {errorMessages.map((msg, index) => (
                                <p key={index}>{msg}</p>
                            ))}
                        </div>
                    )}
                    <p style={{fontSize: "14px", color: "#fff", textAlign: "left", marginLeft: "20%"}}>La contraseña
                        debe contener al menos:</p>
                    <ul className="password-validation"
                        style={{textAlign: "left", fontSize: "14px", color: "#fff", marginLeft: "20%"}}>
                        <li>✔ 1 letra</li>
                        <li>✔ 1 número o carácter especial permitido</li>
                        <li>✔ 10 caracteres</li>
                    </ul>

                    <button type="submit" className="btn-blue" style={{backgroundColor: "#79e2ff", color: "black"}}>
                        Siguiente
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register1;
