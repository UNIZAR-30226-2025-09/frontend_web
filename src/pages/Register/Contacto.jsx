import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch"; 
import "./Contacto.css";
import { FaEnvelope, FaUser, FaPaperPlane, FaArrowLeft, FaCheck } from "react-icons/fa";

const Contacto = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Si había errores, limpiarlos cuando el usuario comienza a escribir
        if (error) setError(null);
    };

    // Función para mostrar notificaciones
    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Realizar petición al backend
            const response = await apiFetch('/user/contact', {
                method: 'POST',
                body: formData // Nota: usa 'body' en lugar de 'data'
            });           
            // Si todo va bien, mostrar mensaje de éxito
            setSubmitted(true);
            
            showNotification('success', "Mensaje enviado correctamente");

            // Resetear después de 5 segundos
            setTimeout(() => {
                setSubmitted(false);
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                });
            }, 5000);
            
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            
            // Mostrar mensaje de error
            setError(error.response?.data?.error || "No se pudo enviar el mensaje. Inténtalo nuevamente más tarde.");
            
            showNotification('error', error.message || "Error al enviar mensaje");
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vb-contacto-wrapper">
            {/* Notificación personalizada */}
            {notification.show && (
                <div className={`vb-contacto-notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <div className="vb-contacto-hero">
                <div className="vb-contacto-overlay"></div>
                <div className="vb-contacto-logo-container">
                    <Link to="/home">
                        <img src="/vibrablanco.png" alt="Vibra Logo" className="vb-contacto-logo" />
                    </Link>                
                </div>
                <h1 className="vb-contacto-title">
                    <span className="vb-contacto-title-line">Hablemos</span>
                    <span className="vb-contacto-accent">Estamos aquí para ayudarte</span>
                </h1>
            </div>

            <div className="vb-contacto-container">
                <div className="vb-contacto-info-panel">
                    <h2 className="vb-contacto-subtitle">Contacta con Vibra</h2>
                    <p className="vb-contacto-description">
                        Nos encanta escucharte. Si tienes alguna pregunta, sugerencia o 
                        comentario sobre nuestros servicios, no dudes en contactarnos.
                    </p>
                    
                    <div className="vb-contacto-methods">
                        <div className="vb-contacto-method">
                            <div className="vb-contacto-method-icon"><FaEnvelope /></div>
                            <div className="vb-contacto-method-text">
                                <h3>Correo Electrónico</h3>
                                <a href="mailto:vibraassistance@gmail.com">vibraassistance@gmail.com</a>
                            </div>
                        </div>
                        
                        <div className="vb-contacto-divider"></div>
                        
                        <div className="vb-contacto-social">
                            <h3>Síguenos</h3>
                            <div className="vb-contacto-social-icons">
                                <a href="#" className="vb-contacto-social-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="currentColor" d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                                    </svg>
                                </a>
                                <a href="#" className="vb-contacto-social-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="currentColor" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
                                    </svg>
                                </a>
                                <a href="#" className="vb-contacto-social-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                                    </svg>
                                </a>
                                <a href="#" className="vb-contacto-social-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="currentColor" d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vb-contacto-form-panel">
                    <div className="vb-contacto-form-container">
                        <h2 className="vb-contacto-form-title">Envíanos un mensaje</h2>
                        
                        {submitted ? (
                            <div className="vb-contacto-success">
                                <div className="vb-contacto-success-icon">
                                    <FaCheck />
                                </div>
                                <h3>¡Mensaje enviado!</h3>
                                <p>Gracias por contactarnos. Te responderemos lo antes posible.</p>
                                <p className="vb-contacto-success-email">Hemos enviado una confirmación a tu correo electrónico.</p>
                            </div>
                        ) : (
                            <form className="vb-contacto-form" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="vb-contacto-error-message">
                                        {error}
                                    </div>
                                )}
                                <div className="vb-contacto-form-group">
                                    <label htmlFor="name">Nombre</label>
                                    <div className="vb-contacto-input-container">
                                        <span className="vb-contacto-input-icon"><FaUser /></span>
                                        <input 
                                            type="text" 
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Tu nombre" 
                                            required 
                                        />
                                    </div>
                                </div>
                                
                                <div className="vb-contacto-form-group">
                                    <label htmlFor="email">Correo electrónico</label>
                                    <div className="vb-contacto-input-container">
                                        <span className="vb-contacto-input-icon"><FaEnvelope /></span>
                                        <input 
                                            type="email" 
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange} 
                                            placeholder="ejemplo@mail.com" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="vb-contacto-form-group">
                                    <label htmlFor="subject">Asunto</label>
                                    <div className="vb-contacto-input-container">
                                        <input 
                                            type="text" 
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange} 
                                            placeholder="¿Sobre qué quieres contactarnos?" 
                                            required 
                                        />
                                    </div>
                                </div>
                                
                                <div className="vb-contacto-form-group">
                                    <label htmlFor="message">Mensaje</label>
                                    <div className="vb-contacto-input-container">
                                        <textarea 
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Escribe tu mensaje aquí..." 
                                            rows="5" 
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                
                                <div className="vb-contacto-button-container">
                                    <button 
                                        type="submit" 
                                        className={`vb-contacto-submit ${loading ? 'vb-contacto-loading' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="vb-contacto-spinner"></span>
                                        ) : (
                                            <>
                                                <FaPaperPlane /> <span>Enviar mensaje</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Nuevo footer similar al de QuienesSomos */}
            <footer className="vb-contacto-footer">
                <div className="vb-contacto-footer-content">
                    <div className="vb-contacto-footer-logo">
                        <img src="/vibrablanco.png" alt="Vibra Logo" className="vb-contacto-footer-logo-img" />
                        <span>Vibra</span>
                    </div>
                    <div className="vb-contacto-footer-links">
                        <Link to="/home">Inicio</Link>
                        <Link to="/quienes-somos">Quiénes Somos</Link>
                        <Link to="/terminos-condiciones">Términos y Condiciones</Link>
                        <Link to="/politica-privacidad">Política de Privacidad</Link>
                    </div>
                    <div className="vb-contacto-footer-social">
                        <a href="#" className="vb-contacto-social-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                            </svg>
                        </a>
                        <a href="#" className="vb-contacto-social-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
                            </svg>
                        </a>
                        <a href="#" className="vb-contacto-social-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="vb-contacto-copyright">
                    © {new Date().getFullYear()} Vibra. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
};

export default Contacto;