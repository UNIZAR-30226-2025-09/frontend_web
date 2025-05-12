import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "#utils/apiFetch";
import "./Register4.css";

const Register4 = () => {
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const handleRegister = async () => {
        if (!checked1 || !checked2) {
            setError("Debes aceptar los términos y condiciones para continuar");
            return;
        }

        try {
            await apiFetch("/user/register", {
                method: "POST",
                body: {
                    nickname: userData.nickname,
                    password: userData.password,
                    mail: userData.email,
                    name: userData.name,
                    dob: userData.dob,
                    gender: userData.gender,
                    style_fav: userData.style_fav,
                    daily_skips: 5,
                },
            });

            // Limpiamos los datos del usuario del localStorage
            localStorage.removeItem("userData");
            
            // Mostramos un mensaje y redirigimos al login
            alert("¡Registro completado! Inicia sesión para comenzar a disfrutar de Vibra.");
            navigate("/login");

        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            setError("Hubo un problema durante el registro. Por favor, inténtalo de nuevo.");
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
                
                <div className="auth-progress">
                    <div className="progress-track">
                        <div className="progress-step completed">
                            <div className="step-number">1</div>
                            <div className="step-label">Seguridad</div>
                        </div>
                        <div className="progress-connector active"></div>
                        <div className="progress-step completed">
                            <div className="step-number">2</div>
                            <div className="step-label">Perfil</div>
                        </div>
                        <div className="progress-connector active"></div>
                        <div className="progress-step completed">
                            <div className="step-number">3</div>
                            <div className="step-label">Preferencias</div>
                        </div>
                        <div className="progress-connector active"></div>
                        <div className="progress-step active">
                            <div className="step-number">4</div>
                            <div className="step-label">Final</div>
                        </div>
                    </div>
                </div>
                
                <div className="auth-content">
                    <div>
                        <h1 className="auth-title">Términos y Condiciones</h1>
                        <p className="auth-subtitle">Para finalizar, necesitamos que aceptes nuestros términos de uso</p>
                    </div>
                    
                    <div className="terms-container">
                        <div className="checkbox-item">
                            <div className="checkbox-custom">
                                <input
                                    type="checkbox"
                                    id="check1"
                                    checked={checked1}
                                    onChange={() => {
                                        setChecked1(!checked1);
                                        setError("");
                                    }}
                                />
                                <div className="checkbox-ui"></div>
                            </div>
                            <label htmlFor="check1" className="checkbox-label">
                                Quiero que me enviéis novedades y ofertas de Vibra
                            </label>
                        </div>
                        
                        <div className="checkbox-item">
                            <div className="checkbox-custom">
                                <input
                                    type="checkbox"
                                    id="check2"
                                    checked={checked2}
                                    onChange={() => {
                                        setChecked2(!checked2);
                                        setError("");
                                    }}
                                />
                                <div className="checkbox-ui"></div>
                            </div>
                            <label htmlFor="check2" className="checkbox-label">
                                Compartir mis datos de registro con los proveedores de contenido de Vibra para fines de
                                marketing. Ten en cuenta que tus datos pueden ser transferidos a un país fuera del EEE, tal y como se
                                recoge en nuestra Política de Privacidad
                            </label>
                        </div>
                    </div>
                    
                    <div className="terms-links">
                        <p className="terms-text">
                            Al hacer clic en Registrarte, aceptas los{" "}
                            <span className="terms-link" onClick={() => navigate("/terminos-condiciones")}>
                                Términos y condiciones de uso
                            </span>
                        </p>
                        
                        <p className="terms-text">
                            Para obtener más información sobre cómo Vibra recopila,
                            utiliza y protege tus datos personales, consulta nuestra{" "}
                            <span className="terms-link" onClick={() => navigate("/politica-privacidad")}>
                                Política de privacidad
                            </span>
                        </p>
                    </div>
                    
                    {error && (
                        <div className="error-message">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <button 
                        className="submit-button" 
                        onClick={handleRegister}
                        disabled={!checked1 || !checked2}
                    >
                        <span className="button-text">Registrarte</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register4;