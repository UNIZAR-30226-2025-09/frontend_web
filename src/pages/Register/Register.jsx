import { useNavigate } from "react-router-dom";
import { apiFetch } from "#utils/apiFetch";
import "./Register.css";
import {useState} from "react";

function Register() {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.includes("@")) {
            setErrorMessage("El correo electrónico debe contener '@'");
            setTimeout(() => setErrorMessage(""), 2000);
            return;
        }

        try {
            const data = await apiFetch("/user/check-email", {
                method: "POST",
                body: { mail: email },
            });

            if (data.exists) {
                setErrorMessage("El correo electrónico ya está registrado.");
                return;
            }

            localStorage.setItem("email", email);
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