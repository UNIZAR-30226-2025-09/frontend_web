import React from "react";
import { useNavigate } from "react-router-dom";
import "./TerminosYCondiciones.css";

const QuienesSomos = () => {
    const navigate = useNavigate();

    return (
        <div className="terminos-container">
            <div className="terminos-box">
                <img src="../vibrablanco.png" alt="Vibra Logo" className="logo" />
                <h1 className="terminos-title">Quiénes Somos</h1>

                <div className="terminos-text">
                    <p><strong>Vibra</strong> nació con una misión clara: conectar a las personas a través de la música y crear experiencias únicas que vibren con tu estilo de vida.</p>

                    <p>Somos un equipo joven, apasionado por la tecnología, el arte y la innovación. Creemos que la música no solo se escucha, sino que se siente y se comparte.</p>

                    <h3>Nuestra visión</h3>
                    <p>Ser la plataforma de referencia para descubrir nueva música, conectar con artistas emergentes y formar comunidades auténticas alrededor del sonido.</p>

                    <h3>Lo que hacemos</h3>
                    <ul>
                        <li>Curamos contenido musical adaptado a tus emociones y momentos del día.</li>
                        <li>Conectamos artistas con su audiencia a través de experiencias inmersivas.</li>
                        <li>Fomentamos el descubrimiento de talento local y global.</li>
                        <li>Desarrollamos tecnología para potenciar la forma en que vivimos la música.</li>
                    </ul>

                    <h3>¿Dónde estamos?</h3>
                    <p>Nuestras oficinas están ubicadas en <strong>Calle Creativa 456, Barcelona, España</strong>, pero nuestra comunidad es global.</p>

                    <p>Gracias por formar parte de Vibra. Estamos construyendo esto contigo.</p>
                </div>

                <button className="btn-close" onClick={() => navigate(-1)}>Cerrar</button>
            </div>
        </div>
    );
};

export default QuienesSomos;
