import { useNavigate } from "react-router-dom";
import "./Contacto.css";

const Contacto = () => {
    const navigate = useNavigate();

    return (
        <div className="contacto-container">
            <img src="../vibrablanco.png" alt="Vibra Logo" className="logo" />
            <h1 className="contacto-title">Contáctanos</h1>

            <div className="contacto-text">
                <p>
                    ¿Tienes alguna duda, sugerencia o simplemente quieres decirnos algo?
                    En <strong>Vibra</strong>, nos encanta escucharte.
                    Puedes escribirnos a <a href="mailto:soporte@vibra.com">soporte@vibra.com</a> o usar el formulario de abajo.
                </p>

                <form className="contacto-form">
                    <input type="text" placeholder="Tu nombre" required />
                    <input type="email" placeholder="Tu correo electrónico" required />
                    <textarea placeholder="Escribe tu mensaje aquí..." rows="5" required></textarea>
                    <button type="submit">Enviar</button>
                </form>
            </div>

            <button className="btn-close" onClick={() => navigate('/')}>Volver</button>

        </div>
    );
};

export default Contacto;
