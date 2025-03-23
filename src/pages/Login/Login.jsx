import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import {apiFetch} from "#utils/apiFetch";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorVisible, setErrorVisible] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let error = "";

        // Validación de email y contraseña
        if (!email.includes("@")) {
            error = "El correo electrónico debe contener '@'";
        } else if (password.length < 6) {
            error = "La contraseña debe tener al menos 6 caracteres";
        }

        if (error) {
            setErrorMessage(error);
            setErrorVisible(true);
            setTimeout(() => setErrorVisible(false), 2000);
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        try {
            const data = await apiFetch("/user/login", {
                method: "POST",
                body: {
                    mail: email,
                    password,
                },
            });

            // Si llegamos aquí, la respuesta fue exitosa
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.dispatchEvent(new Event("storage"));

            alert("Inicio de sesión exitoso");
            navigate("/home");

        } catch (error) {
            console.error("Error en el inicio de sesión:", error);

            setErrorMessage("Error en el inicio de sesión");
            setErrorVisible(true);
            setTimeout(() => setErrorVisible(false), 2000);
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    const goToRegister = () => navigate("/register");
    const goToSubs = () => navigate("/Subs");

    return (
        <div className="login-container">
            <div className="login-box">
                <img
                    src="../vibrablanco.png"
                    alt="Vibra Logo"
                    className="logo"
                    onClick={() => window.location.reload()}
                />
                <h1 className="login-txt">Iniciar Sesión en Vibra</h1>
                <hr className="line" />
                <form onSubmit={handleSubmit}>
                    <div className="input-label">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="globalInput"
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
                            className="globalInput"
                            required
                        />
                    </div>

                    {errorMessage && (
                        <p
                            style={{
                                color: "red",
                                fontSize: "14px",
                                opacity: errorVisible ? 1 : 0,
                                transition: "opacity 1s ease-in-out",
                            }}
                        >
                            {errorMessage}
                        </p>
                    )}

                    <button type="submit" className="btn-blue">
                        Continuar
                    </button>
                </form>

                <div className="divider">o</div>

                <p className="footer-text">
                    ¿No tienes una cuenta?{" "}
                    <span className="register-txt" onClick={goToRegister}>
                        Regístrate en Vibra.
                    </span>
                </p>

                <p className="small-text">
                    Si quieres saber más sobre nuestras suscripciones, visita{" "}
                    <span className="subs-txt" onClick={goToSubs}>
                        Vibra Suscripciones.
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;
