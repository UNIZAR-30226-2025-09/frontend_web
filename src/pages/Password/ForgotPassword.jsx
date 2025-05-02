import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "#utils/apiFetch";
import "./ForgotPassword.css"; // Actualizado para usar su propio CSS

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await apiFetch("/user/forgot-password", {
                method: "POST",
                body: { mail: email },
            });
            
            setIsSuccess(true);
            setMessage("Se ha enviado un correo con instrucciones para restablecer tu contraseña.");
        } catch (error) {
            setIsSuccess(false);
            if (error.status === 404) {
                setMessage("El correo electrónico introducido no está registrado en el sistema.");
            } else {
                setMessage("Error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.");
            }
        } finally {
            setIsLoading(false);
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
                            onClick={() => navigate("/")}
                        />
                    </div>
                </div>
                
                <div className="auth-content">
                    <div>
                        <h1 className="auth-title">Recuperar Contraseña</h1>
                        <p className="auth-subtitle">
                            Introduce tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
                        </p>
                    </div>
                    
                    {!isSuccess ? (
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-field">
                                <label htmlFor="email" className="field-label">Correo Electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="field-input"
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            {message && !isSuccess && (
                                <div className="message message-error">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                    <span>{message}</span>
                                </div>
                            )}
                            
                            <button 
                                type="submit" 
                                className={`submit-button ${isLoading ? 'button-loading' : ''}`}
                                disabled={isLoading || !email}
                            >
                                <span className="button-content">
                                    {isLoading && <div className="loading-spinner-password"></div>}
                                    <span>{isLoading ? "Enviando..." : "Enviar enlace de recuperación"}</span>
                                </span>
                            </button>
                            
                            <div style={{ textAlign: "center" }}>
                                <a className="back-link" onClick={() => navigate("/login")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                                    </svg>
                                    Volver a Iniciar Sesión
                                </a>
                            </div>
                        </form>
                    ) : (
                        <div className="success-container">
                            <svg className="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M0 0h24v24H0V0z" fill="none"/>
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                            <p className="success-message">{message}</p>
                            <button 
                                onClick={() => navigate("/login")} 
                                className="submit-button"
                            >
                                Volver a Iniciar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;