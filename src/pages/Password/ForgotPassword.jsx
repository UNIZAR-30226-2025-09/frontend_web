import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "#utils/apiFetch";
import "../Login/Login.css";

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
            setMessage(error.message || "Error al procesar la solicitud. Inténtalo de nuevo.");
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
                <h1 className="login-txt">Recuperar Contraseña</h1>
                <hr className="line" />
                
                {!isSuccess ? (
                    <form onSubmit={handleSubmit}>
                        <div className="input-label">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Ingresa tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                        </button>
                        <p className="back-to-login" onClick={() => navigate("/login")}>
                            Volver a Iniciar Sesión
                        </p>
                    </form>
                ) : (
                    <div className="success-message">
                        <p>{message}</p>
                        <button 
                            onClick={() => navigate("/login")} 
                            className="btn-blue"
                        >
                            Volver a Iniciar Sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;