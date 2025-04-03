import { useNavigate, Link } from "react-router-dom";

import "./PoliticaPrivacidad.css";

const PoliticaPrivacidad = () => {
    const navigate = useNavigate();

    return (
        <div className="politica-container">
            <div className="politica-box">
                <img src="../vibrablanco.png" alt="Vibra Logo" className="logo"/>
                <h1 className="politica-title">Política de Privacidad</h1>

                <div className="politica-text">
                    <p>En <strong>Vibra</strong>, nos comprometemos a proteger tu privacidad y garantizar el uso seguro
                        de tus datos personales.</p>

                    <h3>Información que recopilamos</h3>
                    <p>Recopilamos información personal que nos proporcionas al registrarte, como tu nombre, dirección
                        de correo electrónico y preferencias musicales.</p>

                    <h3>Uso de la información</h3>
                    <p>La información que recopilamos se utiliza para:</p>
                    <ul>
                        <li>Proporcionarte una experiencia personalizada en Vibra.</li>
                        <li>Enviar notificaciones sobre actualizaciones y ofertas especiales.</li>
                        <li>Mejorar nuestros servicios y funcionalidades.</li>
                    </ul>

                    <h3>Compartición de datos</h3>
                    <p>No compartimos tu información personal con terceros, excepto cuando sea necesario para
                        proporcionarte nuestros servicios o cumplir con la ley.</p>

                    <h3>Seguridad</h3>
                    <p>Implementamos medidas de seguridad avanzadas para proteger tus datos contra accesos no
                        autorizados.</p>

                    <h3>Tus derechos</h3>
                    <p>Puedes solicitar la eliminación o modificación de tus datos en cualquier momento contactándonos
                        a <a href="mailto:privacidad@vibra.com">privacidad@vibra.com</a>.</p>


                </div>

                <button className="btn-close" onClick={() => navigate('/')}>Volver</button>
            </div>
        </div>
    );
};

export default PoliticaPrivacidad;
