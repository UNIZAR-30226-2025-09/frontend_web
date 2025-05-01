import { Link } from "react-router-dom";
import "./TerminosYCondiciones.css";
import { FaShieldAlt, FaCookieBite, FaCopyright, FaExclamationTriangle } from "react-icons/fa";

const TerminosYCondiciones = () => {

    return (
        <div className="vb-terms-wrapper">
            <header className="vb-terms-header">
                <div className="vb-terms-logo-container">
                    <Link to="/home">
                        <img src="../vibrablanco.png" alt="Vibra Logo" className="vb-terms-logo" />
                    </Link>
                </div>
                <h1 className="vb-terms-title">Términos y Condiciones</h1>
                <div className="vb-terms-divider"></div>
                <p className="vb-terms-subtitle">Última actualización: Abril 2025</p>
            </header>

            <div className="vb-terms-container">
                <nav className="vb-terms-nav">
                    <ul>
                        <li><a href="#introduccion"><FaShieldAlt className="vb-terms-nav-icon" /> Introducción</a></li>
                        <li><a href="#cookies"><FaCookieBite className="vb-terms-nav-icon" /> Cookies</a></li>
                        <li><a href="#licencia"><FaCopyright className="vb-terms-nav-icon" /> Licencia</a></li>
                        <li><a href="#aviso-legal"><FaExclamationTriangle className="vb-terms-nav-icon" /> Aviso Legal</a></li>
                    </ul>
                </nav>

                <div className="vb-terms-content">
                    <section id="introduccion" className="vb-terms-section">
                        <div className="vb-terms-section-header">
                            <FaShieldAlt className="vb-terms-icon" />
                            <h2>Introducción</h2>
                        </div>
                        <div className="vb-terms-text">
                            <p>Bienvenido a <strong>Vibra</strong>. Estos términos y condiciones describen las reglas y
                                regulaciones para el uso del sitio web y servicios de Vibra.</p>
                            <p>Vibra se encuentra en <strong>María Zambrano 4, Zaragoza, España</strong>.</p>
                            <p>Al acceder a este sitio web o utilizar nuestros servicios, asumimos que aceptas estos términos y condiciones en su totalidad.
                                No continúes usando Vibra si no aceptas todos los términos y condiciones
                                establecidos en esta página.</p>
                        </div>
                    </section>

                    <section id="cookies" className="vb-terms-section">
                        <div className="vb-terms-section-header">
                            <FaCookieBite className="vb-terms-icon" />
                            <h2>Cookies</h2>
                        </div>
                        <div className="vb-terms-text">
                            <p>Empleamos el uso de cookies. Al utilizar Vibra, aceptas el uso de cookies de
                                acuerdo con nuestra política de privacidad.</p>
                            <p>Nuestras cookies nos ayudan a:</p>
                            <ul className="vb-terms-list">
                                <li>Hacer que nuestra plataforma funcione como esperas</li>
                                <li>Recordar tus ajustes durante y entre visitas</li>
                                <li>Mejorar la velocidad y seguridad del sitio</li>
                                <li>Permitirte compartir páginas con redes sociales</li>
                                <li>Personalizar nuestra plataforma para ti</li>
                            </ul>
                        </div>
                    </section>

                    <section id="licencia" className="vb-terms-section">
                        <div className="vb-terms-section-header">
                            <FaCopyright className="vb-terms-icon" />
                            <h2>Licencia</h2>
                        </div>
                        <div className="vb-terms-text">
                            <p>A menos que se indique lo contrario, Vibra y/o sus licenciatarios poseen los derechos de
                                propiedad intelectual de todo el material en Vibra.</p>
                            <p>Como usuario de nuestra plataforma, no debes:</p>
                            <ul className="vb-terms-list">
                                <li>Volver a publicar material desde Vibra sin autorización</li>
                                <li>Vender, alquilar u otorgar una sub-licencia del material de Vibra</li>
                                <li>Reproducir, duplicar o copiar material de Vibra para uso comercial</li>
                                <li>Redistribuir contenido de Vibra sin permiso explícito</li>
                                <li>Utilizar técnicas de ingeniería inversa en cualquier parte de nuestro software</li>
                            </ul>
                            <p>Ciertas partes de este sitio web ofrecen la oportunidad de que los usuarios publiquen e intercambien opiniones e información. Vibra no filtra, edita, publica o revisa los comentarios antes de su presencia en el sitio web.</p>
                        </div>
                    </section>

                    <section id="aviso-legal" className="vb-terms-section">
                        <div className="vb-terms-section-header">
                            <FaExclamationTriangle className="vb-terms-icon" />
                            <h2>Aviso Legal</h2>
                        </div>
                        <div className="vb-terms-text">
                            <p>En la medida máxima permitida por la ley aplicable, excluimos todas las representaciones,
                                garantías y condiciones relacionadas con nuestro sitio web y el uso de este sitio web.</p>
                            <p>Nada en este aviso legal:</p>
                            <ul className="vb-terms-list">
                                <li>Limitará o excluirá nuestra o tu responsabilidad por muerte o daños personales</li>
                                <li>Limitará o excluirá nuestra o tu responsabilidad por fraude o tergiversación fraudulenta</li>
                                <li>Limitará cualquiera de nuestras o tus responsabilidades de cualquier manera que no esté permitida bajo la ley aplicable</li>
                                <li>Excluirá cualquiera de nuestras o tus responsabilidades que no puedan ser excluidas bajo la ley aplicable</li>
                            </ul>
                            <p>Las limitaciones y prohibiciones de responsabilidad establecidas en esta Sección y en otras partes de este aviso legal: (a) están sujetas al párrafo anterior; y (b) rigen todas las responsabilidades que surjan en virtud de la exención de responsabilidad, incluidas las responsabilidades que surjan por contrato, agravio y por incumplimiento de obligaciones legales.</p>
                        </div>
                    </section>
                </div>
            </div>

            <footer className="vb-terms-footer">
                <div className="vb-terms-footer-content">
                    <div className="vb-terms-footer-logo">
                        <img src="../vibrablanco.png" alt="Vibra Logo" className="vb-terms-footer-logo-img" />
                        <span>Vibra</span>
                    </div>
                    <div className="vb-terms-footer-links">
                        <Link to="/home">Inicio</Link>
                        <Link to="/quienes-somos">Quiénes Somos</Link>
                        <Link to="/politica-privacidad">Política de Privacidad</Link>
                        <Link to="/contacto">Contacto</Link>
                    </div>
                </div>
                <div className="vb-terms-copyright">
                    © {new Date().getFullYear()} Vibra. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
};

export default TerminosYCondiciones;