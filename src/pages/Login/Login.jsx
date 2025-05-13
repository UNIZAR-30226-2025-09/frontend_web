import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { apiFetch } from "#utils/apiFetch";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [formCompleted, setFormCompleted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Verificar si el formulario está completo
    useEffect(() => {
        if (email && password) {
            setFormCompleted(true);
        } else {
            setFormCompleted(false);
        }
    }, [email, password]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validación de email y contraseña
        if (!email.includes("@")) {
            setError("El correo electrónico debe contener '@'");
            return;
        } else if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
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

            // Redirigir al home sin alert
            navigate("/home");

        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            setError("Correo electrónico o contraseña incorrectos");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="auth-bg-shape shape1"></div>
                <div className="auth-bg-shape shape2"></div>
                <div className="auth-bg-shape shape3"></div>
            </div>
            
            <div className="auth-card">
                <div className="auth-header">
                    <div className="logo-container">
                        <img
                            src="../vibrablanco.png"
                            alt="Vibra Logo"
                            className="logo-image"
                            onClick={() => window.location.reload()}
                        />
                    </div>
                </div>
                
                <div className="auth-content">
                    <div>
                        <h1 className="auth-title">Iniciar Sesión en Vibra</h1>
                        <p className="auth-subtitle">Accede para disfrutar de todo el contenido</p>
                    </div>
                    
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="email" className="field-label">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                className="field-input"
                                placeholder="ejemplo@correo.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="password" className="field-label">Contraseña</label>
                            <div className="password-field">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="field-input"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    required
                                />
                                <button 
                                    type="button"
                                    className="password-toggle"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="error-message" style={{justifyContent: "center"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={!formCompleted}
                        >
                            <span>Iniciar sesión</span>
                        </button>
                    </form>
                    
                    <a className="forgot-password" onClick={() => navigate("/forgot-password")}>
                        ¿Olvidaste tu contraseña?
                    </a>
                    
                    <div className="divider">o</div>
                    
                    <p className="footer-text">
                        ¿No tienes una cuenta?{" "}
                        <span className="register-link" onClick={() => navigate("/register")}>
                            Regístrate en Vibra
                        </span>
                    </p>
                    
                    <p className="info-text">
                        Si quieres saber más sobre nuestras suscripciones, visita{" "}
                        <span className="info-link" onClick={() => navigate("/plans")}>
                            Vibra Suscripciones
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;