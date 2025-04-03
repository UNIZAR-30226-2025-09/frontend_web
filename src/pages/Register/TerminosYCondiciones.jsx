import { useNavigate, Link } from "react-router-dom";
import "./TerminosYCondiciones.css";


const TerminosYCondiciones = () => {
    const navigate = useNavigate();

    return (
        <div className="terminos-container">
            <div className="terminos-box">
                <img src="../vibrablanco.png" alt="Vibra Logo" className="logo"/>
                <h1 className="terminos-title">Política de Términos y Condiciones</h1>

                <div className="terminos-text">
                    <p>Bienvenido a <strong>Vibra</strong>. Estos términos y condiciones describen las reglas y
                        regulaciones para el uso del sitio web de Vibra.</p>
                    <p>Vibra se encuentra en <strong>Calle Inventada 123, Madrid, España</strong>.</p>
                    <p>Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones en su totalidad.
                        No continúes usando el sitio web de Vibra si no aceptas todos los términos y condiciones
                        establecidos en esta página.</p>

                    <h3>Cookies</h3>
                    <p>Empleamos el uso de cookies. Al utilizar el sitio web de Vibra, usted acepta el uso de cookies de
                        acuerdo con nuestra política de privacidad.</p>

                    <h3>Licencia</h3>
                    <p>A menos que se indique lo contrario, Vibra y/o sus licenciatarios poseen los derechos de
                        propiedad intelectual de todo el material en Vibra.</p>
                    <p>No debes:</p>
                    <ul>
                        <li>Volver a publicar material desde Vibra.</li>
                        <li>Vender, alquilar u otorgar una sub-licencia del material de Vibra.</li>
                        <li>Reproducir, duplicar o copiar material de Vibra.</li>
                        <li>Redistribuir contenido de Vibra sin permiso.</li>
                    </ul>

                    <h3>Aviso legal</h3>
                    <p>En la medida máxima permitida por la ley aplicable, excluimos todas las representaciones,
                        garantías y condiciones relacionadas con nuestro sitio web.</p>

                </div>

                <button className="btn-close" onClick={() => navigate('/')}>Volver</button>
            </div>
        </div>
    );
};

export default TerminosYCondiciones;
