import React from 'react';
import './footer.css';
const logoInsta = "/insta.png";
const logoTwitter = "/twitter.png";
const logoFacebook = "/facebook.png";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Sobre Nosotros</h3>
                    <p>Somos Vibra, tu plataforma de música en streaming favorita. Con miles de canciones para todos los gustos.</p>
                </div>
                <div className="footer-section">
                    <h3>Enlaces Útiles</h3>
                    <ul>
                        <li><a href="/quienes-somos" target="_blank" rel="noopener noreferrer">Quiénes Somos</a></li>
                        <li><a href="/contacto" target="_blank" rel="noopener noreferrer">Contacto</a></li>
                        <li><a href="/terminos-condiciones" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a></li>
                        <li><a href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer">Política de Privacidad</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Contáctanos</h3>
                    <p><strong>Email:</strong> contacto@vibra.com</p>
                    <p><strong>Teléfono:</strong> +34 900 123 456</p>
                    <p><strong>Dirección:</strong> Calle Musical, 45, 28001, Madrid, España</p>
                </div>
            </div>

            {/* Barra de separación */}
            <div className="footer-divider">
                <hr />
            </div>

            <div className="footer-bottom">
                <p>&copy; 2024 Vibra. Todos los derechos reservados.</p>
                <div className="footer-socials">
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src={logoInsta} alt="Instagram" className="social-icon"/>
                    </a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src={logoFacebook} alt="Facebook" className="social-icon"/>
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                        <img src={logoTwitter} alt="Twitter" className="social-icon"/>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
