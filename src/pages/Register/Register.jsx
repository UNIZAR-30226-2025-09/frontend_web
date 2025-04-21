import { useNavigate } from "react-router-dom";
import { apiFetch } from "#utils/apiFetch";
import "./Register.css";
import { useState } from "react";

function Register() {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!email.includes("@") || !email.includes(".")) {
            setErrorMessage("Por favor, introduce un correo electrónico válido");
            setIsSubmitting(false);
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        try {
            const data = await apiFetch("/user/check-email", {
                method: "POST",
                body: { mail: email },
            });

            if (data.exists) {
                setErrorMessage("Este correo electrónico ya está registrado");
                setIsSubmitting(false);
                return;
            }

            localStorage.setItem("email", email);
            navigate("/register1");

        } catch (error) {
            console.error("Error al verificar el correo:", error);
            setErrorMessage("Hubo un problema al verificar el correo");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-background">
                <div className="register-bg-shape shape1"></div>
                <div className="register-bg-shape shape2"></div>
                <div className="register-bg-shape shape3"></div>
            </div>
            
            <div className="register-card">
                <div className="register-header">
                    <div className="register-logo-container">
                        <img
                            src="../vibrablanco.png"
                            alt="Vibra Logo"
                            className="register-logo-image"
                            onClick={() => window.location.reload()}
                        />
                    </div>
                </div>
                
                <div className="register-content">
                    <h1 className="register-title">Regístrate en Vibra</h1>
                    <p className="register-subtitle">Crea una cuenta para disfrutar de toda la música sin límites</p>
                    
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="register-form-field">
                            <label htmlFor="email" className="register-field-label">Correo electrónico</label>
                            <div className="register-input-field">
                                <input
                                    type="email"
                                    id="email"
                                    className={`register-field-input ${errorMessage ? "field-error" : ""}`}
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {errorMessage && (
                                <div className="register-error-message">
                                    <div className="register-error-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                        </svg>
                                    </div>
                                    <span>{errorMessage}</span>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="register-submit-button"
                            disabled={!email || isSubmitting}
                        >
                            <span className="register-button-text">{isSubmitting ? "Verificando..." : "Continuar"}</span>
                            {!isSubmitting && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="register-button-icon">
                                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                                </svg>
                            )}
                        </button>
                    </form>
                    
                    <div className="register-separator">
                        <span>o</span>
                    </div>
                    
                    <div className="register-actions">
                        <div className="register-account-prompt">
                            ¿Ya tienes una cuenta?
                            <button 
                                onClick={() => navigate("/login")} 
                                className="register-text-button"
                                type="button"
                            >
                                Inicia sesión
                            </button>
                        </div>
                    </div>
                    
                    <div className="register-security-info">
                        <div className="register-security-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                            </svg>
                        </div>
                        <div className="register-security-message">Tu información está segura y nunca será compartida con terceros</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;