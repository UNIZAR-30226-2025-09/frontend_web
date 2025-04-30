import React from "react";
import { Link } from "react-router-dom";
import "./QuienesSomos.css";
import { FaMusic, FaUsers, FaGlobeAmericas, FaRocket, FaHeadphones, FaLightbulb } from "react-icons/fa";

const QuienesSomos = () => {
    return (
        <div className="vb-about-wrapper">
            <header className="vb-about-hero">
                <div className="vb-about-overlay"></div>
                <div className="vb-about-logo-container">
                    <Link to="/home">
                        <img src="/vibrablanco.png" alt="Vibra Logo" className="vb-about-logo" />
                    </Link>
                </div>
                <div className="vb-about-hero-content">
                    <h1 className="vb-about-title">
                        Quiénes Somos
                        <span className="vb-about-accent-bar"></span>
                    </h1>
                    <p className="vb-about-tagline">Una nueva forma de experimentar la música</p>
                </div>
            </header>

            <section className="vb-about-container">
                <div className="vb-about-intro">
                    <div className="vb-about-intro-text">
                        <h2 className="vb-about-section-title">Nuestra Historia</h2>
                        <p><strong>Vibra</strong> nació en 2022 con una misión clara: conectar a las personas a través de la música
                            y crear experiencias únicas que vibren con tu estilo de vida.</p>

                        <p>Somos un equipo joven, apasionado por la tecnología, el arte y la innovación. Creemos que la
                            música no solo se escucha, sino que se siente y se comparte.</p>
                    </div>
                    <div className="vb-about-intro-image">
                        <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600" alt="Experiencia musical" />
                    </div>
                </div>

                <div className="vb-about-vision">
                    <div className="vb-about-vision-overlay"></div>
                    <div className="vb-about-vision-content">
                        <h2>Nuestra Visión</h2>
                        <p>Ser la plataforma de referencia para descubrir nueva música, conectar con artistas emergentes y
                            formar comunidades auténticas alrededor del sonido.</p>
                    </div>
                </div>

                <div className="vb-about-services">
                    <h2 className="vb-about-section-title">Lo que hacemos</h2>
                    <div className="vb-about-services-grid">
                        <div className="vb-about-service-card">
                            <div className="vb-about-service-icon">
                                <FaHeadphones />
                            </div>
                            <h3>Curaduría musical</h3>
                            <p>Contenido musical adaptado a tus emociones y momentos del día.</p>
                        </div>

                        <div className="vb-about-service-card">
                            <div className="vb-about-service-icon">
                                <FaUsers />
                            </div>
                            <h3>Conexión artistas-audiencia</h3>
                            <p>Conectamos artistas con sus fans a través de experiencias inmersivas.</p>
                        </div>

                        <div className="vb-about-service-card">
                            <div className="vb-about-service-icon">
                                <FaGlobeAmericas />
                            </div>
                            <h3>Talento global</h3>
                            <p>Fomentamos el descubrimiento de talento local y global.</p>
                        </div>

                        <div className="vb-about-service-card">
                            <div className="vb-about-service-icon">
                                <FaRocket />
                            </div>
                            <h3>Innovación tecnológica</h3>
                            <p>Desarrollamos tecnología para potenciar la forma en que vivimos la música.</p>
                        </div>
                    </div>
                </div>

                <div className="vb-about-team">
                    <h2 className="vb-about-section-title">Nuestro equipo</h2>
                    <div className="vb-about-team-grid">
                        <div className="vb-about-team-member">
                            <div className="vb-about-team-photo" style={{backgroundColor: "#4f74ff"}}>
                                <span>C</span>
                            </div>
                            <h3>Carlos Fernández</h3>
                            <p>Fundador & CEO</p>
                        </div>
                        <div className="vb-about-team-member">
                            <div className="vb-about-team-photo" style={{backgroundColor: "#79e2ff"}}>
                                <span>M</span>
                            </div>
                            <h3>María García</h3>
                            <p>Directora de Producto</p>
                        </div>
                        <div className="vb-about-team-member">
                            <div className="vb-about-team-photo" style={{backgroundColor: "#5ac2e0"}}>
                                <span>J</span>
                            </div>
                            <h3>Javier López</h3>
                            <p>Director de Tecnología</p>
                        </div>
                        <div className="vb-about-team-member">
                            <div className="vb-about-team-photo" style={{backgroundColor: "#3d5dc4"}}>
                                <span>L</span>
                            </div>
                            <h3>Lucía Torres</h3>
                            <p>Directora de Contenidos</p>
                        </div>
                        <div className="vb-about-team-member">
                            <div className="vb-about-team-photo" style={{backgroundColor: "#6d78e6"}}>
                                <span>A</span>
                            </div>
                            <h3>Ana Rodríguez</h3>
                            <p>Directora de Experiencia</p>
                        </div>
                        <div className="vb-about-team-member">
                            <div className="vb-about-team-photo" style={{backgroundColor: "#41b0d3"}}>
                                <span>D</span>
                            </div>
                            <h3>Daniel Martín</h3>
                            <p>Director de Innovación</p>
                        </div>
                        <div className="vb-about-team-member">
                            <div className="vb-about-team-photo" style={{backgroundColor: "#5a7fff"}}>
                                <span>P</span>
                            </div>
                            <h3>Paula Sánchez</h3>
                            <p>Directora de Marketing</p>
                        </div>
                        <div className="vb-about-team-member">
                            <div className="vb-about-team-photo" style={{backgroundColor: "#37d8e6"}}>
                                <span>R</span>
                            </div>
                            <h3>Roberto Vega</h3>
                            <p>Director de Desarrollo</p>
                        </div>
                    </div>
                </div>

                <div className="vb-about-location">
                    <div className="vb-about-location-text">
                        <h2 className="vb-about-section-title">¿Dónde estamos?</h2>
                        <p>Nuestras oficinas principales están ubicadas en <strong>María Zambrano 4, Zaragoza, España</strong>, pero
                            nuestra comunidad es global.</p>
                        <p>Operamos en más de 15 países y seguimos creciendo cada día.</p>
                        
                        <div className="vb-about-counter-section">
                            <div className="vb-about-counter">
                                <span className="vb-about-counter-number">4M+</span>
                                <span className="vb-about-counter-label">Usuarios activos</span>
                            </div>
                            <div className="vb-about-counter">
                                <span className="vb-about-counter-number">23K+</span>
                                <span className="vb-about-counter-label">Artistas</span>
                            </div>
                            <div className="vb-about-counter">
                                <span className="vb-about-counter-number">5M+</span>
                                <span className="vb-about-counter-label">Canciones</span>
                            </div>
                        </div>
                    </div>
                    <div className="vb-about-location-map">
                        <div className="vb-about-map-interactive">
                            <div className="vb-about-map-bg"></div>
                            <div className="vb-about-map-pin vb-about-map-pin-main" style={{top: '38%', left: '48%'}}>
                                {/* <div className="vb-about-map-pin-pulse"></div> */}
                                <div className="vb-about-map-pin-point"></div>
                                <div className="vb-about-map-pin-label">Zaragoza</div>
                            </div>
                            <div className="vb-about-map-pin" style={{top: '32%', left: '25%'}}>
                                <div className="vb-about-map-pin-point"></div>
                                <div className="vb-about-map-pin-label">Nueva York</div>
                            </div>
                            <div className="vb-about-map-pin" style={{top: '68%', left: '78%'}}>
                                <div className="vb-about-map-pin-point"></div>
                                <div className="vb-about-map-pin-label">Sídney</div>
                            </div>
                            <div className="vb-about-map-pin" style={{top: '30%', left: '65%'}}>
                                <div className="vb-about-map-pin-point"></div>
                                <div className="vb-about-map-pin-label">Tokio</div>
                            </div>
                            <div className="vb-about-map-pin" style={{top: '70%', left: '45%'}}>
                                <div className="vb-about-map-pin-point"></div>
                                <div className="vb-about-map-pin-label">Ciudad del Cabo</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vb-about-cta">
                    <div className="vb-about-cta-content">
                        <div className="vb-about-cta-icon">
                            <FaMusic />
                        </div>
                        <h2>Gracias por formar parte de Vibra</h2>
                        <p>Estamos construyendo esto contigo. Cada día trabajamos para llevar la experiencia musical al siguiente nivel.</p>
                        <Link to="/home" className="vb-about-cta-button">Comenzar a escuchar</Link>
                        <Link to="/contacto" className="vb-about-cta-button-secondary">Contactar con nosotros</Link>
                    </div>
                </div>
            </section>

            <footer className="vb-about-footer">
                <div className="vb-about-footer-content">
                    <div className="vb-about-footer-logo">
                        <img src="/vibrablanco.png" alt="Vibra Logo" className="vb-about-footer-logo-img" />
                        <span>Vibra</span>
                    </div>
                    <div className="vb-about-footer-links">
                        <Link to="/home">Inicio</Link>
                        <Link to="/terminos-condiciones">Términos y Condiciones</Link>
                        <Link to="/politica-privacidad">Política de Privacidad</Link>
                        <Link to="/contacto">Contacto</Link>
                    </div>
                    <div className="vb-about-footer-social">
                        <a href="#" className="vb-about-social-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                            </svg>
                        </a>
                        <a href="#" className="vb-about-social-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
                            </svg>
                        </a>
                        <a href="#" className="vb-about-social-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="vb-about-copyright">
                    © {new Date().getFullYear()} Vibra. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
};

export default QuienesSomos;