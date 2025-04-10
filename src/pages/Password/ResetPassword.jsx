import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";
import "../Login/Login.css";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [validations, setValidations] = useState({
        hasLetter: false,
        hasSpecialCharOrNumber: false,
        hasMinLength: false,
    });
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setMessage("Enlace de recuperación inválido o expirado.");
        }
    }, [token]);

    const validatePassword = (password) => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSpecialCharOrNumber = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~\d]/.test(password);
        const hasMinLength = password.length >= 10;
        
        setValidations({
            hasLetter,
            hasSpecialCharOrNumber,
            hasMinLength,
        });
        
        return hasLetter && hasSpecialCharOrNumber && hasMinLength;
    };

    const handleChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
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
        <div className="login-container">
            <div className="login-box">
                <img
                    src="../vibrablanco.png"
                    alt="Vibra Logo"
                    className="logo"
                    onClick={() => navigate("/")}
                />
                <h1 className="login-txt">Restablecer Contraseña</h1>
                <hr className="line" />
                
                {!token ? (
                    <div className="error-message">
                        <p>{message}</p>
                        <button 
                            onClick={() => navigate("/login")} 
                            className="btn-blue"
                        >
                            Volver a Iniciar Sesión
                        </button>
                    </div>
                ) : !isSuccess ? (
                    <form onSubmit={handleSubmit}>
                        <div className="input-label">
                            <label htmlFor="password">Nueva Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Ingresa tu nueva contraseña"
                                value={password}
                                onChange={handleChange}
                                className="globalInput"
                                required
                            />
                            <div className="password-validations">
                                <p className={validations.hasLetter ? "valid" : "invalid"}>
                                    ✓ Debe contener al menos una letra
                                </p>
                                <p className={validations.hasSpecialCharOrNumber ? "valid" : "invalid"}>
                                    ✓ Debe contener al menos un número o carácter especial
                                </p>
                                <p className={validations.hasMinLength ? "valid" : "invalid"}>
                                    ✓ Debe tener al menos 10 caracteres
                                </p>
                            </div>
                        </div>
                        <div className="input-label">
                            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirma tu nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="globalInput"
                                required
                            />
                        </div>
                        {message && (
                            <p style={{ color: "red", fontSize: "14px" }}>
                                {message}
                            </p>
                        )}
                        <button 
                            type="submit" 
                            className="btn-blue"
                            disabled={isLoading}
                        >
                            {isLoading ? "Procesando..." : "Restablecer Contraseña"}
                        </button>
                    </form>
                ) : (
                    <div className="success-message">
                        <p>{message}</p>
                        <button 
                            onClick={() => navigate("/login")} 
                            className="btn-blue"
                        >
                            Ir a Iniciar Sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;