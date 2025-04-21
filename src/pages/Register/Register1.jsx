import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register1.css";

function Register1() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [validations, setValidations] = useState({
        hasLetter: false,
        hasSpecialCharOrNumber: false,
        hasMinLength: false,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [strength, setStrength] = useState(0);
    const navigate = useNavigate();

    // Validación de la contraseña
    const validatePassword = (password) => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSpecialCharOrNumber = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~\d]/.test(password);
        const hasMinLength = password.length >= 10;

        setValidations({
            hasLetter,
            hasSpecialCharOrNumber,
            hasMinLength,
        });

        return { hasLetter, hasSpecialCharOrNumber, hasMinLength };
    };

    // Calcula la fuerza de la contraseña
    useEffect(() => {
        const calculateStrength = () => {
            let score = 0;
            if (validations.hasLetter) score += 1;
            if (validations.hasSpecialCharOrNumber) score += 1;
            if (validations.hasMinLength) score += 1;
            setStrength(score);
        };
        
        calculateStrength();
    }, [validations]);

    // Actualizar contraseña y validaciones en tiempo real
    const handleChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const { hasLetter, hasSpecialCharOrNumber, hasMinLength } = validations;

        if (hasLetter && hasSpecialCharOrNumber && hasMinLength) {
            const email = localStorage.getItem("email");
            localStorage.setItem("userData", JSON.stringify({ email, password }));
            navigate("/register2");
        }
    };

    const getStrengthLabel = () => {
        if (strength === 0) return "Débil";
        if (strength === 1) return "Moderada";
        if (strength === 2) return "Buena";
        return "Fuerte";
    };

    const getStrengthColor = () => {
        if (strength === 0) return "#ff4d4d";
        if (strength === 1) return "#ffaa33";
        if (strength === 2) return "#2db7f5";
        return "#52c41a";
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
                        <div className="progress-step active">
                            <div className="step-number">1</div>
                            <div className="step-label">Seguridad</div>
                        </div>
                        <div className="progress-connector"></div>
                        <div className="progress-step">
                            <div className="step-number">2</div>
                            <div className="step-label">Perfil</div>
                        </div>
                        <div className="progress-connector"></div>
                        <div className="progress-step">
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
                    <h1 className="auth-title">Crea una contraseña segura</h1>
                    <p className="auth-subtitle">Tu contraseña debe ser única y fácil de recordar solo para ti</p>
                    
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-field">
                            <label htmlFor="password" className="field-label">Contraseña</label>
                            <div className="password-field">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className={`field-input ${isSubmitted && !Object.values(validations).every(Boolean) ? "field-error" : ""}`}
                                    placeholder="Crea una contraseña fuerte"
                                    value={password}
                                    onChange={handleChange}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="toggle-visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className={showPassword ? "hidden" : ""}>
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className={showPassword ? "" : "hidden"}>
                                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {password && (
                            <div className="strength-meter-container">
                                <div className="strength-info">
                                    <span>Seguridad:</span>
                                    <span className="strength-label" style={{ color: getStrengthColor() }}>{getStrengthLabel()}</span>
                                </div>
                                <div className="strength-bar">
                                    {[...Array(3)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`strength-segment ${i < strength ? "active" : ""}`}
                                            style={{ backgroundColor: i < strength ? getStrengthColor() : "" }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="requirements-panel">
                            <div className="requirements-title">Tu contraseña debe incluir:</div>
                            <ul className="requirements-list">
                                <li className={validations.hasLetter ? "fulfilled" : "pending"}>
                                    <div className={`requirement-icon ${validations.hasLetter ? "success" : ""}`}>
                                        {validations.hasLetter ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="requirement-text">Al menos una letra</div>
                                </li>
                                <li className={validations.hasSpecialCharOrNumber ? "fulfilled" : "pending"}>
                                    <div className={`requirement-icon ${validations.hasSpecialCharOrNumber ? "success" : ""}`}>
                                        {validations.hasSpecialCharOrNumber ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="requirement-text">Un número o carácter especial</div>
                                </li>
                                <li className={validations.hasMinLength ? "fulfilled" : "pending"}>
                                    <div className={`requirement-icon ${validations.hasMinLength ? "success" : ""}`}>
                                        {validations.hasMinLength ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="requirement-text">Mínimo 10 caracteres</div>
                                </li>
                            </ul>
                        </div>

                        <button 
                            type="submit" 
                            className={`submit-button ${Object.values(validations).every(Boolean) ? "enabled" : ""}`}
                            disabled={!Object.values(validations).every(Boolean)}
                        >
                            <span className="button-text">Continuar</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="button-icon">
                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                            </svg>
                        </button>
                    </form>
                    
                    <div className="security-info">
                        <div className="security-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                            </svg>
                        </div>
                        <div className="security-message">Tu contraseña está protegida con encriptación de grado militar</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register1;