import { Link } from "react-router-dom";
import "./PoliticaPrivacidad.css";
import { FaLock, FaUsers, FaShieldAlt, FaUserLock, FaCookie, FaInfoCircle } from "react-icons/fa";

const PoliticaPrivacidad = () => {
    return (
        <div className="vb-privacy-wrapper">
            <header className="vb-privacy-header">
                <div className="vb-privacy-logo-container">
                    <Link to="/home">
                        <img src="../vibrablanco.png" alt="Vibra Logo" className="vb-privacy-logo" />
                    </Link>
                </div>
                <h1 className="vb-privacy-title">Política de Privacidad</h1>
                <div className="vb-privacy-divider"></div>
                <p className="vb-privacy-subtitle">Última actualización: Abril 2025</p>
            </header>

            <div className="vb-privacy-container">
                <nav className="vb-privacy-nav">
                    <ul>
                        <li><a href="#introduccion"><FaInfoCircle className="vb-privacy-nav-icon" /> Introducción</a></li>
                        <li><a href="#recopilacion"><FaUsers className="vb-privacy-nav-icon" /> Información recopilada</a></li>
                        <li><a href="#uso"><FaUserLock className="vb-privacy-nav-icon" /> Uso de datos</a></li>
                        <li><a href="#comparticion"><FaShieldAlt className="vb-privacy-nav-icon" /> Compartición de datos</a></li>
                        <li><a href="#cookies"><FaCookie className="vb-privacy-nav-icon" /> Cookies</a></li>
                        <li><a href="#seguridad"><FaLock className="vb-privacy-nav-icon" /> Seguridad</a></li>
                        <li><a href="#derechos"><FaUsers className="vb-privacy-nav-icon" /> Tus derechos</a></li>
                    </ul>
                </nav>

                <div className="vb-privacy-content">
                    <section id="introduccion" className="vb-privacy-section">
                        <div className="vb-privacy-section-header">
                            <FaInfoCircle className="vb-privacy-icon" />
                            <h2>Introducción</h2>
                        </div>
                        <div className="vb-privacy-text">
                            <p>En <strong>Vibra</strong>, nos comprometemos a proteger tu privacidad y garantizar el uso seguro
                                de tus datos personales. Esta política de privacidad explica cómo recopilamos, utilizamos y 
                                protegemos tu información cuando utilizas nuestra plataforma.</p>
                            <p>Al utilizar Vibra, aceptas las prácticas descritas en esta política. Te recomendamos que 
                                la leas detenidamente para entender nuestro enfoque respecto a tus datos personales.</p>
                        </div>
                    </section>

                    <section id="recopilacion" className="vb-privacy-section">
                        <div className="vb-privacy-section-header">
                            <FaUsers className="vb-privacy-icon" />
                            <h2>Información que recopilamos</h2>
                        </div>
                        <div className="vb-privacy-text">
                            <p>Recopilamos diferentes tipos de información para proporcionarte nuestros servicios:</p>
                            
                            <h3>Datos proporcionados por ti</h3>
                            <ul className="vb-privacy-list">
                                <li>Información de registro (nombre, correo electrónico, fecha de nacimiento)</li>
                                <li>Información de perfil (foto, biografía, género preferido)</li>
                                <li>Preferencias musicales y listas de reproducción</li>
                                <li>Comunicaciones con nuestro equipo de soporte</li>
                            </ul>
                            
                            <h3>Datos recopilados automáticamente</h3>
                            <ul className="vb-privacy-list">
                                <li>Información de uso (canciones reproducidas, tiempo de escucha)</li>
                                <li>Información del dispositivo (tipo, sistema operativo)</li>
                                <li>Ubicación aproximada (basada en IP)</li>
                                <li>Registros de actividad y errores</li>
                            </ul>
                        </div>
                    </section>

                    <section id="uso" className="vb-privacy-section">
                        <div className="vb-privacy-section-header">
                            <FaUserLock className="vb-privacy-icon" />
                            <h2>Uso de la información</h2>
                        </div>
                        <div className="vb-privacy-text">
                            <p>Utilizamos la información recopilada para los siguientes propósitos:</p>
                            <ul className="vb-privacy-list">
                                <li>Proporcionarte una experiencia personalizada en Vibra</li>
                                <li>Recomendarte música y contenido basado en tus preferencias</li>
                                <li>Enviar notificaciones sobre actualizaciones y ofertas especiales</li>
                                <li>Mejorar nuestros servicios y funcionalidades</li>
                                <li>Analizar patrones de uso para optimizar la plataforma</li>
                                <li>Resolver problemas técnicos y prevenir fraudes</li>
                            </ul>
                            
                            <div className="vb-privacy-note">
                                <p>Solo utilizamos tus datos para los fines mencionados y según lo permitido por la ley aplicable.</p>
                            </div>
                        </div>
                    </section>

                    <section id="comparticion" className="vb-privacy-section">
                        <div className="vb-privacy-section-header">
                            <FaShieldAlt className="vb-privacy-icon" />
                            <h2>Compartición de datos</h2>
                        </div>
                        <div className="vb-privacy-text">
                            <p>Tu privacidad es importante para nosotros. No vendemos tu información personal a terceros.</p>
                            
                            <p>Podemos compartir información en las siguientes circunstancias:</p>
                            <ul className="vb-privacy-list">
                                <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                                <li>Con socios artísticos cuando participas en eventos especiales</li>
                                <li>Cuando sea requerido por ley o proceso legal</li>
                                <li>Para proteger los derechos y la seguridad de Vibra y sus usuarios</li>
                            </ul>
                            
                            <p>Todos nuestros socios y proveedores de servicios están obligados a mantener la confidencialidad
                               y seguridad de tus datos, y a utilizarlos únicamente para los fines específicos que hemos acordado.</p>
                        </div>
                    </section>

                    <section id="cookies" className="vb-privacy-section">
                        <div className="vb-privacy-section-header">
                            <FaCookie className="vb-privacy-icon" />
                            <h2>Cookies y tecnologías similares</h2>
                        </div>
                        <div className="vb-privacy-text">
                            <p>Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra plataforma:</p>
                            
                            <ul className="vb-privacy-list">
                                <li>Cookies esenciales: necesarias para el funcionamiento básico de la plataforma</li>
                                <li>Cookies de preferencias: recuerdan tus ajustes y personalizaciones</li>
                                <li>Cookies analíticas: nos ayudan a entender cómo interactúas con nuestros servicios</li>
                                <li>Cookies de marketing: permiten mostrar contenido publicitario relevante</li>
                            </ul>
                            
                            <p>Puedes administrar tus preferencias de cookies a través de la configuración de tu navegador.
                               Ten en cuenta que desactivar ciertas cookies puede afectar la funcionalidad de nuestra plataforma.</p>
                        </div>
                    </section>

                    <section id="seguridad" className="vb-privacy-section">
                        <div className="vb-privacy-section-header">
                            <FaLock className="vb-privacy-icon" />
                            <h2>Seguridad de datos</h2>
                        </div>
                        <div className="vb-privacy-text">
                            <p>Implementamos medidas de seguridad técnicas y organizativas avanzadas para proteger tus datos:</p>
                            
                            <ul className="vb-privacy-list">
                                <li>Encriptación de datos sensibles</li>
                                <li>Sistemas de detección de intrusiones</li>
                                <li>Revisiones regulares de seguridad</li>
                                <li>Acceso restringido a datos personales</li>
                                <li>Protocolos de respuesta a incidentes</li>
                            </ul>
                            
                            <p>A pesar de nuestros esfuerzos, ningún sistema es 100% seguro. Si descubres algún problema
                               de seguridad, por favor infórmanos inmediatamente a <a href="mailto:seguridad@vibra.com">seguridad@vibra.com</a>.</p>
                        </div>
                    </section>

                    <section id="derechos" className="vb-privacy-section">
                        <div className="vb-privacy-section-header">
                            <FaUsers className="vb-privacy-icon" />
                            <h2>Tus derechos</h2>
                        </div>
                        <div className="vb-privacy-text">
                            <p>Como usuario de Vibra, tienes los siguientes derechos sobre tus datos personales:</p>
                            
                            <ul className="vb-privacy-list">
                                <li><strong>Acceso</strong>: solicitar una copia de los datos que tenemos sobre ti</li>
                                <li><strong>Rectificación</strong>: corregir información inexacta o incompleta</li>
                                <li><strong>Eliminación</strong>: solicitar que eliminemos tus datos</li>
                                <li><strong>Restricción</strong>: limitar el procesamiento de tus datos</li>
                                <li><strong>Portabilidad</strong>: recibir tus datos en un formato estructurado</li>
                                <li><strong>Objeción</strong>: oponerte al procesamiento de tus datos</li>
                            </ul>
                            
                            <p>Para ejercer cualquiera de estos derechos, contacta con nosotros a través de
                               <a href="mailto:privacidad@vibra.com"> privacidad@vibra.com</a>. Responderemos a tu solicitud
                               dentro del plazo establecido por la ley aplicable.</p>

                            <div className="vb-privacy-cta">
                                <h3>¿Tienes dudas sobre tu privacidad?</h3>
                                <p>Nuestro equipo está disponible para resolver cualquier pregunta relacionada con el tratamiento de tus datos.</p>
                                <Link to="/contacto" className="vb-privacy-button">Contactar con nosotros</Link>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <footer className="vb-privacy-footer">
                <div className="vb-privacy-footer-content">
                    <div className="vb-privacy-footer-logo">
                        <img src="../vibrablanco.png" alt="Vibra Logo" className="vb-privacy-footer-logo-img" />
                        <span>Vibra</span>
                    </div>
                    <div className="vb-privacy-footer-links">
                        <Link to="/home">Inicio</Link>
                        <Link to="/quienes-somos">Quiénes Somos</Link>
                        <Link to="/terminos-condiciones">Términos y Condiciones</Link>
                        <Link to="/contacto">Contacto</Link>
                    </div>
                </div>
                <div className="vb-privacy-copyright">
                    © {new Date().getFullYear()} Vibra. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
};

export default PoliticaPrivacidad;