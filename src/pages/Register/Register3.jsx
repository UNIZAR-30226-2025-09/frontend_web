import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register3.css";

const Register3 = () => {
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const styles = [
        "Pop",
        "Rock",
        "Reggaeton",
        "Flamenco",
        "Rap",
        "Trap",
    ];

    const handleStyleSelection = (style) => {
        setSelectedStyle(style);
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedStyle) {
            setError("Por favor, selecciona un estilo musical favorito.");
            return;
        }

        const userData = JSON.parse(localStorage.getItem("userData")) || {};
        userData.style_fav = selectedStyle;
        localStorage.setItem("userData", JSON.stringify(userData));

        navigate("/register4");
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
                        <div className="progress-step active">
                            <div className="step-number">3</div>
                            <div className="step-label">Preferencias</div>
                        </div>
                        <div className="progress-connector"></div>
                        <div className="progress-step">
                            <div className="step-number">4</div>
                            <div className="step-label">Final</div>
                        </div>
                    </div>
                </div>
                
                <div className="auth-content">
                    <div>
                        <h1 className="auth-title">Selecciona tu estilo favorito</h1>
                        <p className="auth-subtitle">Esto nos ayudará a recomendarte contenido que te encantará</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="styles-container">
                            {styles.map((style) => (
                                <div
                                    key={style}
                                    className={`style-item ${selectedStyle === style ? "selected" : ""}`}
                                    onClick={() => handleStyleSelection(style)}
                                >
                                    {style}
                                </div>
                            ))}
                        </div>
                        
                        {error && (
                            <div className="error-message" style={{justifyContent: "center", marginTop: "16px"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={!selectedStyle}
                        >
                            <span className="button-text">Continuar</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="button-icon">
                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register3;