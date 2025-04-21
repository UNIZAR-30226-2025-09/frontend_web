import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";
import "./ResetPassword.css";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validations, setValidations] = useState({
        hasLetter: false,
        hasSpecialCharOrNumber: false,
        hasMinLength: false,
    });
    const [strength, setStrength] = useState(0); // 0: vacío, 1: débil, 2: moderado, 3: fuerte
    const [formValid, setFormValid] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setMessage("Enlace de recuperación inválido o expirado.");
        }
    }, [token]);

    // Validación de la contraseña y actualización de la fuerza
    const validatePassword = (password) => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSpecialCharOrNumber = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~\d]/.test(password);
        const hasMinLength = password.length >= 10;
        
        setValidations({
            hasLetter,
            hasSpecialCharOrNumber,
            hasMinLength,
        });
        
        // Calcular la fuerza de la contraseña (3 niveles como en Register1)
        let currentStrength = 0;
        
        if (password.length > 0) {
            currentStrength = 1; // Débil por defecto
            
            if (hasSpecialCharOrNumber && password.length >= 8) {
                currentStrength = 2; // Moderada
            }
            
            if (hasLetter && hasSpecialCharOrNumber && hasMinLength) {
                currentStrength = 3; // Fuerte
            }
        }
        
        setStrength(currentStrength);
        
        return hasLetter && hasSpecialCharOrNumber && hasMinLength;
    };

    useEffect(() => {
        const allValid = validations.hasLetter && 
                        validations.hasSpecialCharOrNumber && 
                        validations.hasMinLength && 
                        password === confirmPassword && 
                        confirmPassword.length > 0;
        
        setFormValid(allValid);
    }, [validations, password, confirmPassword]);

    const handleChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    const handleConfirmChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const getStrengthLabel = () => {
        switch(strength) {
            case 0: return "";
            case 1: return "Débil";
            case 2: return "Moderada";
            case 3: return "Fuerte";
            default: return "";
        }
    };

    const getStrengthClass = () => {
        switch(strength) {
            case 0: return "";
            case 1: return "strength-weak";
            case 2: return "strength-moderate";
            case 3: return "strength-strong";
            default: return "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePassword(password)) {
            setMessage("La contraseña no cumple con los requisitos");
            return;
        }
        
        if (password !== confirmPassword) {
            setMessage("Las contraseñas no coinciden");
            return;
        }
        
        setIsLoading(true);
        try {
            await apiFetch("/user/reset-password", {
                method: "POST",
                body: { 
                    token: token,
                    newPassword: password 
                },
            });
            
            setIsSuccess(true);
            setMessage("Tu contraseña ha sido actualizada correctamente");
        } catch (error) {
            setIsSuccess(false);
            setMessage(error.message || "Error al restablecer la contraseña");
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
                        <h1 className="auth-title">Restablecer Contraseña</h1>
                        <p className="auth-subtitle">
                            Crea una nueva contraseña para tu cuenta
                        </p>
                    </div>
                    
                    {!token ? (
                        <div className="error-message">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <p>{message}</p>
                            <button 
                                onClick={() => navigate("/login")} 
                                className="submit-button enabled"
                            >
                                Volver a Iniciar Sesión
                            </button>
                        </div>
                    ) : !isSuccess ? (
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-field">
                                <label htmlFor="password" className="field-label">Contraseña</label>
                                <div className="password-field">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Ingresa tu nueva contraseña"
                                        value={password}
                                        onChange={handleChange}
                                        className="field-input"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        className="toggle-visibility"
                                        onClick={togglePasswordVisibility}
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

                                {/* Medidor de fuerza de contraseña (3 niveles) */}
                                {password.length > 0 && (
                                    <div className={`strength-meter-container ${getStrengthClass()}`}>
                                        <div className="strength-info">
                                            <span>Seguridad:</span>
                                            <span className="strength-label">{getStrengthLabel()}</span>
                                        </div>
                                        <div className="strength-bar">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Validaciones de contraseña estilo Register1 */}
                                <div className="password-validations">
                                    <div className="password-validations-title">Tu contraseña debe incluir:</div>
                                    
                                    <div className={`validation-item ${validations.hasLetter ? "fulfilled" : ""}`}>
                                        <div className={`validation-icon ${validations.hasLetter ? "success" : ""}`}>
                                            {validations.hasLetter ? "✓" : ""}
                                        </div>
                                        <div className="validation-text">Al menos una letra</div>
                                    </div>
                                    
                                    <div className={`validation-item ${validations.hasSpecialCharOrNumber ? "fulfilled" : ""}`}>
                                        <div className={`validation-icon ${validations.hasSpecialCharOrNumber ? "success" : ""}`}>
                                            {validations.hasSpecialCharOrNumber ? "✓" : ""}
                                        </div>
                                        <div className="validation-text">Un número o carácter especial</div>
                                    </div>
                                    
                                    <div className={`validation-item ${validations.hasMinLength ? "fulfilled" : ""}`}>
                                        <div className={`validation-icon ${validations.hasMinLength ? "success" : ""}`}>
                                            {validations.hasMinLength ? "✓" : ""}
                                        </div>
                                        <div className="validation-text">Mínimo 10 caracteres</div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="confirmPassword" className="field-label">Confirmar Contraseña</label>
                                <div className="password-field">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        placeholder="Confirma tu nueva contraseña"
                                        value={confirmPassword}
                                        onChange={handleConfirmChange}
                                        className="field-input"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        className="toggle-visibility"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        {showConfirmPassword ? (
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
                            
                            {message && (
                                <div className="message message-error">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                    <span>{message}</span>
                                </div>
                            )}
                            
                            <button 
                                type="submit" 
                                className={`submit-button ${formValid ? "enabled" : ""}`}
                                disabled={isLoading || !formValid}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        <span>Procesando...</span>
                                    </>
                                ) : "Restablecer Contraseña"}
                            </button>
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
                                className="submit-button enabled"
                            >
                                Ir a Iniciar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;